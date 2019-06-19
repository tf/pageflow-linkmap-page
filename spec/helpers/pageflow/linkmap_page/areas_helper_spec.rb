require 'spec_helper'

module Pageflow
  module LinkmapPage
    describe AreasHelper do
      describe '#linkmap_content_and_background_css_classes' do
        it 'contains default css classes' do
          classes = helper.linkmap_content_and_background_css_classes({}).split(' ')

          expect(classes).to include('content_and_background')
          expect(classes).to include('linkmap_page')
          expect(classes).to include('unplayed')
        end

        it 'contains hide_overlay_boxes if option is set and pan zoom is active' do
          configuration = {
            'mobile_panorama_navigation' => 'pan_zoom',
            'hide_linkmap_overlay_boxes'=> true
          }

          classes = helper.linkmap_content_and_background_css_classes(configuration).split(' ')

          expect(classes).to include('hide_overlay_boxes')
        end

        it 'does not contain hide_overlay_boxes if option is not set even if pan zoom is active' do
          configuration = {
            'mobile_panorama_navigation' => 'pan_zoom',
            'hide_linkmap_overlay_boxes'=> false
          }

          classes = helper.linkmap_content_and_background_css_classes(configuration).split(' ')

          expect(classes).not_to include('hide_overlay_boxes')
        end

        it 'does not contain hide_overlay_boxes if option is set even but pan zoom is not active' do
          configuration = {
            'hide_linkmap_overlay_boxes'=> true
          }

          classes = helper.linkmap_content_and_background_css_classes(configuration).split(' ')

          expect(classes).not_to include('hide_overlay_boxes')
        end
      end

      describe '#linkmap_area_divs' do
        it 'renders div with attribute name as class' do
          @entry = PublishedEntry.new(create(:entry, :published))
          configuration = {}

          html = helper.linkmap_areas_div(@entry, configuration)

          expect(html).to have_selector('div.linkmap_areas')
        end

        it 'renders linkmap areas' do
          @entry = PublishedEntry.new(create(:entry, :published))
          configuration = {'linkmap_areas' => [{}]}

          html = helper.linkmap_areas_div(@entry, configuration)

          expect(html).to have_selector('div a[href]')
        end

        it 'renders hover image inside linkmap areas' do
          @entry = PublishedEntry.new(create(:entry, :published))
          configuration = {'linkmap_areas' => [{}], 'hover_image_id' => 5}

          html = helper.linkmap_areas_div(@entry, configuration)

          expect(html).to have_selector("a div[class~='image_panorama_5']")
        end

        it 'renders masked hover image inside masked linkmap areas' do
          @entry = PublishedEntry.new(create(:entry, :published))
          color_map_file = create(:used_file, model: :color_map_file, revision: @entry.revision)
          masked_image_file = create(:used_file, model: :masked_image_file, revision: @entry.revision)
          configuration = {
            'linkmap_areas' => [{'color_map_component_id' => "#{color_map_file.perma_id}:aaa"}],
            'hover_image_id' => 5,
            'linkmap_color_map_file_id' => color_map_file.perma_id,
            'linkmap_masked_hover_image_id' => masked_image_file.perma_id
          }

          html = helper.linkmap_areas_div(@entry, configuration)

          image_class = "pageflow_linkmap_page_masked_image_file_aaa_#{masked_image_file.perma_id}"
          expect(html).to have_selector("a div[class~=#{image_class}]")
        end

        it 'only uses masked hover image if area is masked' do
          @entry = PublishedEntry.new(create(:entry, :published))
          masked_image_file = create(:used_file, model: :masked_image_file, revision: @entry.revision)
          configuration = {
            'linkmap_areas' => [{}],
            'hover_image_id' => 5,
            'linkmap_masked_hover_image_id' => masked_image_file.perma_id
          }

          html = helper.linkmap_areas_div(@entry, configuration)

          expect(html).to have_selector('a div[class~="image_panorama_5"]')
        end

        it 'does not use masked hover image if area color map component id references other image' do
          @entry = PublishedEntry.new(create(:entry, :published))
          masked_image_file = create(:used_file, model: :masked_image_file, revision: @entry.revision)
          color_map_file = create(:used_file, model: :color_map_file, revision: @entry.revision)
          other_id = color_map_file.perma_id + 1
          configuration = {
            'linkmap_areas' => [{'color_map_component_id' => "#{other_id}:aaa"}],
            'hover_image_id' => 5,
            'linkmap_masked_hover_image_id' => masked_image_file.perma_id
          }

          html = helper.linkmap_areas_div(@entry, configuration)

          expect(html).to have_selector('a div[class~="image_panorama_5"]')
        end

        it 'renders visited image inside linkmap areas' do
          @entry = PublishedEntry.new(create(:entry, :published))
          configuration = {'linkmap_areas' => [{}], 'visited_image_id' => 5}

          html = helper.linkmap_areas_div(@entry, configuration)

          expect(html).to have_selector('a div[class~="image_panorama_5"]')
        end

        it 'renders masked visited image inside masked linkmap areas' do
          @entry = PublishedEntry.new(create(:entry, :published))
          color_map_file = create(:used_file, model: :color_map_file, revision: @entry.revision)
          masked_image_file = create(:used_file, model: :masked_image_file, revision: @entry.revision)
          configuration = {
            'linkmap_areas' => [{'color_map_component_id' => "#{color_map_file.perma_id}:aaa"}],
            'hover_image_id' => 5,
            'linkmap_color_map_file_id' => color_map_file.perma_id,
            'linkmap_masked_visited_image_id' => masked_image_file.perma_id
          }

          html = helper.linkmap_areas_div(@entry, configuration)

          image_class = "pageflow_linkmap_page_masked_image_file_aaa_#{masked_image_file.perma_id}"
          expect(html).to have_selector("a div[class~='#{image_class}']")
        end

        it 'sets data-color-map-component-id attribute if area has color_map_component_id' do
          @entry = PublishedEntry.new(create(:entry, :published))
          configuration = {'linkmap_areas' => [{'color_map_component_id' => '1:aaa'}]}

          html = helper.linkmap_areas_div(@entry, configuration)

          expect(html).to have_selector('a[data-color-map-component-id="1:aaa"]')
        end

        it 'uses color map component id if present, preceding mask perma id' do
          @entry = PublishedEntry.new(create(:entry, :published))
          color_map_file_1 = create(:used_file, model: :color_map_file, revision: @entry.revision)
          color_map_file_2 = create(:used_file, model: :color_map_file, revision: @entry.revision)
          configuration = {
            'linkmap_areas' => [{'color_map_component_id' => "#{color_map_file_2.perma_id}:aaa",
                                 'mask_perma_id' => "#{color_map_file_1.perma_id}:aaa"}]
          }

          html = helper.linkmap_areas_div(@entry, configuration)

          expect(html).to have_selector("a[data-color-map-component-id='#{color_map_file_2.perma_id}:aaa']")
        end

        it 'uses mask perma id as fallback if present and color map component id is blank' do
          @entry = PublishedEntry.new(create(:entry, :published))
          color_map_file = create(:used_file, model: :color_map_file, revision: @entry.revision)
          configuration = {
            'linkmap_areas' => [{'mask_perma_id' => "#{color_map_file.perma_id}:aaa"}]
          }

          html = helper.linkmap_areas_div(@entry, configuration)

          expect(html).to have_selector("a[data-color-map-component-id='#{color_map_file.perma_id}:aaa']")
        end

        it 'does not set data-color-map-component-id attribute if background type is hover_video' do
          @entry = PublishedEntry.new(create(:entry, :published))
          configuration = {
            'linkmap_areas' => [{'color_map_component_id' => '1:aaa'}],
            'background_type' => 'hover_video'
          }

          html = helper.linkmap_areas_div(@entry, configuration)

          expect(html).not_to have_selector('a[data-color-map-component-id]')
        end
      end

      describe '#linkmap_area' do
        it 'renders link tag' do
          entry = create(:entry)

          html = helper.linkmap_area(entry, {}, 0)

          expect(html).to have_selector('a[href]')
        end

        it 'sets inline styles for position and size' do
          entry = create(:entry)
          attributes = {top: 20, left: 30, width: 40, height: 50}

          html = helper.linkmap_area(entry, attributes, 0)

          expect(html).to include('top: 20%;')
          expect(html).to include('left: 30%;')
          expect(html).to include('width: 40%;')
          expect(html).to include('height: 50%;')
        end

        it 'sets data attribute for audio file' do
          entry = create(:entry)
          attributes = {target_type: 'audio_file', target_id: 25}

          html = helper.linkmap_area(entry, attributes, 5)

          expect(html).to have_selector('a[data-audio-file="25.area_5"]')
        end

        it 'sets data attribute for page link' do
          entry = create(:entry)
          attributes = {target_type: 'page', target_id: 10}

          html = helper.linkmap_area(entry, attributes, 0)

          expect(html).to have_selector('a[data-target-id="10"]')
        end
      end
    end
  end
end
