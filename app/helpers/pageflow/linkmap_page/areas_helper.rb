module Pageflow
  module LinkmapPage
    module AreasHelper
      include BackgroundImageHelper
      include RevisionFileHelper

      def linkmap_content_and_background_css_classes(configuration)
        hide_overlay_boxes =
          configuration['mobile_panorama_navigation'] == 'pan_zoom' &&
          configuration['hide_linkmap_overlay_boxes']

        [
          'content_and_background linkmap_page unplayed',
          hide_overlay_boxes ? 'hide_overlay_boxes' : nil
        ].compact.join(' ')
      end

      def linkmap_areas_div(entry, configuration)
        color_map_file =
          find_file_in_entry(ColorMapFile, configuration['linkmap_color_map_file_id'])
        masked_hover_image_file =
          find_file_in_entry(MaskedImageFile, configuration['linkmap_masked_hover_image_id'])
        masked_visited_image_file =
          find_file_in_entry(MaskedImageFile, configuration['linkmap_masked_visited_image_id'])

        render('pageflow/linkmap_page/areas/div',
               entry: entry,
               configuration: configuration,
               color_map_file: color_map_file,
               masked_hover_image_file: masked_hover_image_file,
               masked_visited_image_file: masked_visited_image_file,
               data_attributes: {
                 color_map_file_id: configuration['color_map_file_id']
               })
      end

      def linkmap_area_background_image_div(prefix, attributes, configuration, color_map_file)
        color_map_component_id = attributes['color_map_component_id'] || attributes['mask_perma_id']
        if color_map_file &&
          color_map_component_id.present? &&
          color_map_component_id.split(':').first.to_i == color_map_file.perma_id
          background_image_div(configuration,
                               "linkmap_masked_#{prefix}_image",
                               class: "#{prefix}_image",
                               file_type: 'pageflow_linkmap_page_masked_image_files',
                               style_group: color_map_component_id.split(':').last)
        else
          background_image_div(configuration,
                               "#{prefix}_image",
                               class: "#{prefix}_image",
                               style_group: :panorama)
        end
      end

      def linkmap_area(entry, attributes, index, background_type = nil, &block)
        Link.new(self, entry, attributes.symbolize_keys, index, background_type).render(&block)
      end

      class Link < Struct.new(:template, :entry, :attributes, :index, :background_type)
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
          color_map_component_id = background_type != 'hover_video' &&
                                   (attributes[:color_map_component_id] || attributes[:mask_perma_id])
          audio_file_id = attributes[:target_id]

          {
            target_type: attributes[:target_type],
            target_id: attributes[:target_id],
            audio_file: audio_file_id.present? ? "#{audio_file_id}.area_#{index}" : nil,
            page_transition: attributes[:page_transition],
            color_map_component_id: color_map_component_id,
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
