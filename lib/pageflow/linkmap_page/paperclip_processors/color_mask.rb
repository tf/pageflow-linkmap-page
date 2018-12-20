module Pageflow
  module LinkmapPage
    module PaperclipProcessors
      class ColorMask < Paperclip::Processor
        CONVERT_COMMAND = [
          # Create mask by making all non-matching colors in color map
          # image transparent
          ':color_map',
          '+transparent :color',
          # Make all areas transparent in source that are transparent in mask
          ':source',
          '-compose src-in -composite',
          # Write result to output file
          ':dest'
        ].join(' ').freeze

        def make
          with_destination_tempfile do |dest|
            with_color_map do |color_map_path|
              convert(CONVERT_COMMAND,
                      color: "##{options[:style]}",
                      color_map: color_map_path,
                      source: File.expand_path(file.path),
                      dest: File.expand_path(dest.path))
            end
          end
        end

        private

        def with_destination_tempfile
          current_format      = File.extname(file.path)
          basename            = File.basename(file.path, current_format)

          dest = Tempfile.new([basename, '.png'])
          dest.binmode

          yield dest

          dest
        end

        def with_color_map(&block)
          Pageflow::LinkmapPage::PaperclipTempfile.for(color_map_attachment, &block)
        end

        def color_map_attachment
          options.fetch(:color_map_attachment)
        end
      end
    end
  end
end
