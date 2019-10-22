module Pageflow
  module LinkmapPage
    class PageType < Pageflow::PageType
      name 'linkmap_page'

      def file_types
        [
          LinkmapPage.color_map_file_type,
          LinkmapPage.masked_image_file_type
        ]
      end

      def view_helpers
        [AreasHelper]
      end

      def thumbnail_candidates
        [
          {attribute: 'thumbnail_image_id', file_collection: 'image_files'},
          {attribute: 'panorama_image_id', file_collection: 'image_files'},
          {attribute: 'panorama_video_id', file_collection: 'video_files'}
        ]
      end
    end

    def self.color_map_file_type
      FileType.new(model: ColorMapFile,
                   partial: 'pageflow/linkmap_page/color_map_files/color_map_file',
                   editor_partial: 'pageflow/linkmap_page/editor/color_map_files/color_map_file',
                   custom_attributes: {
                     source_image_file_id: {
                       model: 'Pageflow::ImageFile',
                       permitted_create_param: true
                     }
                   })
    end

    def self.masked_image_file_type
      FileType.new(model: MaskedImageFile,
                   editor_partial: 'pageflow/linkmap_page/editor/' \
                     'masked_image_files/masked_image_file',
                   css_background_image_urls: lambda do |masked_image_file|
                     masked_image_file.present_styles.each_with_object({}) do |color, result|
                       result[color] = masked_image_file.url_for_color(color)
                     end
                   end,
                   custom_attributes: {
                     source_image_file_id: {
                       model: 'Pageflow::ImageFile',
                       permitted_create_param: true
                     },
                     color_map_file_id: {
                       model: 'Pageflow::LinkmapPage::ColorMapFile',
                       permitted_create_param: true
                     }
                   })
    end
  end
end
