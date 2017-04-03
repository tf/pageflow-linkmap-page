module Pageflow
  module LinkmapPage
    module AreasHelper
      include BackgroundImageHelper

      def linkmap_areas_div(entry, configuration)
        hover_image_file = Pageflow::ImageFile.find_by_id(configuration['hover_image_id'])
        visited_image_file = Pageflow::ImageFile.find_by_id(configuration['visited_image_id'])

        mask_sprite_url_template = MaskSprite.new(id: 1, attachment_file_name: 'data').attachment.url
          .gsub(%r'(\d{3}/)+', ':id_partition/')

        render('pageflow/linkmap_page/areas/div',
               entry: entry,
               configuration: configuration,
               data_attributes: {
                 hover_image_url: hover_image_file &&
                   hover_image_file.attachment.url(:panorama_large),
                 visited_image_url: visited_image_file &&
                   visited_image_file.attachment.url(:panorama_large),
                 mask_sprite_url_template: mask_sprite_url_template
               })
      end

      def linkmap_area(entry, attributes, index, &block)
        Link.new(self, entry, attributes.symbolize_keys, index).render(&block)
      end

      class Link < Struct.new(:template, :entry, :attributes, :index)
        delegate :content_tag, to: :template

        def render(&block)
          content_tag(:a,
                      '',
                      href: href,
                      target: target,
                      class: css_classes,
                      style: inline_styles,
                      data: data_attributes,
                      &block)
        end

        private

        def href
          if attributes[:target_type] == 'external_site'
            external_site ? external_site.url : '#'
          elsif attributes[:target_type] == 'page'
            "##{attributes[:target_id]}"
          else
            '#'
          end
        end

        def target
          return '' unless attributes[:target_type] == 'external_site'
          (external_site && external_site.open_in_new_tab?) ? '_blank' : ''
        end

        def external_site
          @external_site ||=
            ExternalLinks::Site.find_by_revision_id_and_perma_id(entry.try(:revision),
                                                                 attributes[:target_id])
        end

        def data_attributes
          audio_file_id = attributes[:target_id]

          {
            target_type: attributes[:target_type],
            target_id: attributes[:target_id],
            audio_file: audio_file_id.present? ? "#{audio_file_id}.area_#{index}" : nil,
            page_transition: attributes[:page_transition],
            mask_id: attributes[:mask_perma_id],
            width: attributes[:width],
            height: attributes[:height]
          }.delete_if { |key, value| value.blank? }
        end

        def inline_styles
          styles_string(top: in_percent(attributes[:top]),
                        left: in_percent(attributes[:left]),
                        width: in_percent(attributes[:width]),
                        height: in_percent(attributes[:height]))
        end

        def css_classes
          ['hover_area',
            (external_site && !external_site.open_in_new_tab?) ? 'target_self' : nil,
            attributes[:marker].to_s,
            attributes[:inverted] ? 'inverted' : nil,
            "#{attributes[:target_type]}_area"].compact.join(' ')
        end

        def styles_string(properties)
          properties.map do |name, value|
            "#{name}: #{value};"
          end.join(' ')
        end

        def in_percent(value)
          value ? "#{value}%" : ''
        end
      end
    end
  end
end
