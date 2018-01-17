module Pageflow
  module LinkmapPage
    module PaperclipProcessors
      class Colors < Paperclip::Processor
        def make
          colors = unique_colors(file)

          attachment.instance_write('colors', color_bounding_boxes(file, colors))
          make_color_sprite(file, colors)
        end

        private

        def unique_colors(file)
          ConvertOutput.parse_unique_colors(convert(':source -unique-colors txt:-',
                                                    source: file.path))
        end

        def color_bounding_boxes(file, colors)
          colors.each_with_object({}) do |color, result|
            result[color] = color_bounding_box(file, color)
          end
        end

        TRIM_CONVERT_ARGS = [
          # Make all non-matching colors in color map image
          # transparent
          ':source',
          '+transparent :color',
          # Create a transparent border
          '-bordercolor none',
          '-border 1x1',
          # Trim transparent region.
          '-trim',
        ].join(' ').freeze

        TRIM_INFO_CONVERT_ARGS = [
          TRIM_CONVERT_ARGS,
          # Write info to stdout
          'info:-'
        ].join(' ').freeze

        def color_bounding_box(file, color)
          box = ConvertOutput.parse_trim(convert(TRIM_INFO_CONVERT_ARGS,
                                                 color: "##{color}",
                                                 source: file.path))
          ignore_added_border_in_coordinated(box)
        end

        def ignore_added_border_in_coordinated(box)
          {
            left: box[:left] - 1,
            top: box[:top] - 1,
            width: box[:width],
            height: box[:height]
          }
        end

        def make_color_sprite(file, colors)
          with_destination_tempfile do |sprite_tempfile|
            with_tempfiles(colors) do |color_tempfiles|
              color_tempfiles.each_with_index do |(color, color_tempfile), index|
                invoke_progress_callback((index + 1) * 100 / (colors.size + 2))
                make_color_filtered_image(file, color, color_tempfile)
              end

              invoke_progress_callback((colors.size + 1) * 100 / (colors.size + 2))
              make_sprite(color_tempfiles, sprite_tempfile)
              invoke_progress_callback(100)
            end
          end
        end

        COLOR_FILTER_CONVERT_ARGS = [
          TRIM_CONVERT_ARGS,
          # Crop image to trimmed area
          '+repage',
          ':dest'
        ].join(' ').freeze

        def make_color_filtered_image(file, color, destination_tempfile)
          convert(COLOR_FILTER_CONVERT_ARGS,
                  color: "##{color}",
                  source: File.expand_path(file.path),
                  dest: File.expand_path(destination_tempfile.path))
        end

        def make_sprite(files, destination_tempfile)
          inputs = files.each_with_object({}) do |(key, tempfile), result|
            result["input_#{key}"] = File.expand_path(tempfile.path)
          end

          placeholders = inputs.keys.sort.map { |key| ":#{key}" }

          Paperclip.run('montage',
                        [
                          *placeholders,
                          '-background transparent',
                          "-tile #{inputs.size}x",
                          '-mode Concatenate',
                          ':output'
                        ].join(' '),
                        inputs.merge(output: File.expand_path(destination_tempfile.path)))
        end

        def with_destination_tempfile
          dest = create_tempfile
          yield dest
          dest
        end

        def with_tempfiles(keys)
          files = keys.each_with_object({}) do |key, result|
            result[key] = create_tempfile(key)
          end

          yield files
        ensure
          files.each_value do |file|
            file.close
            file.unlink
          end
        end

        def create_tempfile(suffix = nil)
          current_format      = File.extname(file.path)
          basename            = File.basename(file.path, current_format)

          dest = Tempfile.new([[basename, suffix].compact.join('-'), '.png'])
          dest.binmode

          dest
        end

        def invoke_progress_callback(percent)
          attachment.instance.send(options[:progress_callback], percent) if options[:progress_callback]
        end

        module ConvertOutput
          HEX_COLOR_REGEXP = /#[0-9a-f]{6,8}/i
          TRANSPARENT = '#00000000'.freeze

          module_function

          def parse_unique_colors(output)
            output
              .split("\n")
              .reject { |line| line.starts_with?('#') }
              .map { |line| line[HEX_COLOR_REGEXP] }
              .reject { |color| color == TRANSPARENT }
              .map { |color| color.tr('#', '') }
              .map(&:downcase)
              .sort
          end

          def parse_trim(output)
            trimmed_size, size_and_offset = output.split(' ')[2, 3]
            width, height = trimmed_size.split('x')
            _size, left, top = size_and_offset.split('+')

            {
              left: left.to_i,
              top: top.to_i,
              width: width.to_i,
              height: height.to_i
            }
          end
        end
      end
    end
  end
end
