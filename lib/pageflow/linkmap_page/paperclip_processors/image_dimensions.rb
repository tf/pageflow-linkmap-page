module Pageflow
  module LinkmapPage
    module PaperclipProcessors
      class ImageDimensions < Paperclip::Processor
        def make
          store_dimensions(file)
          file
        end

        private

        def store_dimensions(file)
          geometry = Paperclip::Geometry.from_file(file)

          attachment.instance_write('width', geometry.width)
          attachment.instance_write('height', geometry.height)
        end
      end
    end
  end
end
