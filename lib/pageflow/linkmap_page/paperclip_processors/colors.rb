module Pageflow
  module LinkmapPage
    module PaperclipProcessors
      class Colors < Paperclip::Processor
        def make
          with_progress(steps: 2) do |progress|
            colors = unique_colors(file) - ['000000']
            boxes = color_bounding_boxes_ignoring_single_pixels(file, colors, progress)

            attachment.instance_write('colors', boxes)
            make_color_sprite(file, boxes.keys, progress)
          end
        end

        private

        def unique_colors(file)
          ConvertOutput.parse_unique_colors(convert(':source -unique-colors txt:-',
                                                    source: file.path))
        end

        def color_bounding_boxes_ignoring_single_pixels(file, colors, overall_progress)
          overall_progress.divide(steps: colors.size) do |progress|
            boxes = colors.each_with_object({}) do |color, result|
              result[color] = color_bounding_box_ignoring_single_pixels(file, color)
              progress.step
            end

            remove_boxes_for_ignored_colors(boxes)
          end
        end

        def remove_boxes_for_ignored_colors(boxes)
          boxes.delete_if do |_, box|
            box[:width].zero? && box[:height].zero?
          end
        end

        COLOR_MASK_ARGS = [
          # Make transparent areas black
          '-background black -flatten',
          # Make all non matching colors black
          '-fill black +opaque :color',
          # Replace color with white - required for morphology
          '-fill white -opaque :color',
          # Remove shapes that are smaller than 3x3 pixels
          '-morphology Open Square:1',
          # Make black areas transparent
          '-transparent black',
          # Restore original color
          '-fill :color -opaque white',
        ].join(' ').freeze

        TRIM_CONVERT_ARGS = [
          # Make all non-matching colors in color map image
          # transparent
          ':source',
          COLOR_MASK_ARGS,
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

        def color_bounding_box_ignoring_single_pixels(file, color)
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

        def make_color_sprite(file, colors, overall_progress)
          with_destination_tempfile do |sprite_tempfile|
            with_tempfiles(colors) do |color_tempfiles|
              overall_progress.divide(steps: colors.size + 1) do |progress|
                color_tempfiles.each do |color, color_tempfile|
                  make_color_filtered_image(file, color, color_tempfile)
                  progress.step
                end

                make_sprite(color_tempfiles, sprite_tempfile)
                progress.step
              end
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

        def with_progress(steps:)
          progress = Pageflow::LinkmapPage::Progress.new(steps: steps) do |percent|
            if options[:progress_callback]
              attachment.instance.send(options[:progress_callback], percent)
            end
          end

          yield progress
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

            if size_and_offset.ends_with?('-1-1')
              return {left: 0, top: 0, width: 0, height: 0}
            end

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
