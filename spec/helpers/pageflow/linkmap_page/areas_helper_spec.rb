require 'spec_helper'

module Pageflow
  module LinkmapPage
    describe AreasHelper do
      describe '#linkmap_area_divs' do
        it 'renders div with attribute name as class' do
          entry = create(:entry)
          configuration = {}

          html = helper.linkmap_areas_div(entry, configuration)

          expect(html).to have_selector('div.linkmap_areas')
        end

        it 'renders linkmap areas' do
          entry = create(:entry)
          configuration = {'linkmap_areas' => [{}]}

          html = helper.linkmap_areas_div(entry, configuration)

          expect(html).to have_selector('div a[href]')
        end

        it 'renders hover image inside linkmap areas' do
          entry = create(:entry)
          configuration = {'linkmap_areas' => [{}], 'hover_image_id' => 5}

          html = helper.linkmap_areas_div(entry, configuration)

          expect(html).to have_selector('a div[class~="image_panorama_5"]')
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
