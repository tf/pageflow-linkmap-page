module Pageflow
  module LinkmapPage
    class ColorMapFile < ProcessedImageFile
      belongs_to :source_image_file, class_name: 'Pageflow::ImageFile'

      # Prevent anti aliasing. Otherwise, when processing color map
      # images, borders between areas are blurred.
      SOURCE_FILE_OPTIONS = '-filter point'.freeze

      PALETTE_PATH = Pageflow::LinkmapPage::Engine.root
        .join('lib', 'pageflow', 'linkmap_page', 'images', 'palette.png').freeze

      CONVERT_OPTIONS = [
        '-quality 70',
        '-interlace Plane',
        '-dither None',
        '-colors 64',
        "-remap #{PALETTE_PATH}",
      ].join(' ').freeze

      has_attached_file(:attachment,
                        Pageflow.config.paperclip_s3_default_options
                        .merge(styles: {
                                 remapped: {
                                   processors: [:thumbnail],
                                   format: 'png',
                                   geometry: GEOMETRY,
                                   source_file_options: SOURCE_FILE_OPTIONS,
                                   convert_options: CONVERT_OPTIONS
                                 },
                                 sprite: {
                                   processors: [
                                     :thumbnail,
                                     :pageflow_linkmap_page_image_dimensions,
                                     :pageflow_linkmap_page_image_colors
                                   ],
                                   format: 'png',
                                   geometry: '1024x1024>',
                                   source_file_options: SOURCE_FILE_OPTIONS,
                                   convert_options: CONVERT_OPTIONS,
                                   progress_callback: :update_processing_progress
                                 }
                               }))

      do_not_validate_attachment_file_type :attachment

      serialize :attachment_colors

      def sprite_url
        attachment.url(:sprite)
      end

      def width
        attachment_width
      end

      def height
        attachment_height
      end

      def url
        attachment.url(:remapped)
      end

      def processed_attachment
        attachment.styles[:remapped]
      end

      def present_colors
        attachment_colors ? attachment_colors.keys : []
      end

      def bounding_box_for_color(color)
        attachment_colors[color]
      end

      private

      def update_processing_progress(percent)
        update_column(:processing_progress, percent)
        touch
      end
    end
  end
end
