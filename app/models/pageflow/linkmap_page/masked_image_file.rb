module Pageflow
  module LinkmapPage
    class MaskedImageFile < ProcessedImageFile
      belongs_to :color_map_file, class_name: 'Pageflow::LinkmapPage::ColorMapFile'

      STYLES = lambda do |attachment|
        masked_image_file = attachment.instance

        masked_image_file.present_styles.each_with_object({}) do |color, result|
          result[color.to_sym] = {
            processors: [
              :thumbnail,
              :pageflow_linkmap_page_color_mask,
              :pageflow_linkmap_page_invoke_callback
            ],
            color_map_attachment: masked_image_file.color_map_file.processed_attachment,
            format: 'png',
            geometry: GEOMETRY,
            callback: :update_processing_progress
          }
        end
      end

      has_attached_file(:attachment,
                        Pageflow.config.paperclip_s3_default_options
                          .merge(styles: STYLES))

      do_not_validate_attachment_file_type :attachment

      def url_for_color(color)
        attachment.url(color.to_sym)
      end

      def for_color(color)
        attachment.styles[color.to_sym]
      end

      def present_styles
        color_map_file.present_colors
      end

      private

      def update_processing_progress(style)
        update_column(:processing_progress,
                      (present_styles.index(style.to_s) + 1) * 100 / present_styles.size)
        touch
      end
    end
  end
end
