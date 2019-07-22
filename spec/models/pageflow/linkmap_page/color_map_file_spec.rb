require 'spec_helper'

module Pageflow
  module LinkmapPage
    describe ColorMapFile, perform_jobs: :except_enqued_at do
      let(:red_from_palette) { 'f65b57' }
      let(:green_from_palette) { '69a77b' }

      describe 'process' do
        it 're-schedules job if source image file is not uploaded yet' do
          image_file = create(:image_file, :not_yet_uploaded)
          color_map_file = create(:color_map_file, source_image_file: image_file)

          color_map_file.process

          expect(ProcessSourceImageFileJob)
            .to have_been_enqueued.at(3.seconds.from_now)
        end

        it 'fails if source image file failed' do
          image_file = create(:image_file, :uploading_failed)
          color_map_file = create(:color_map_file, source_image_file: image_file)

          color_map_file.process
          color_map_file.reload

          expect(color_map_file).to be_failed
        end

        it 'remaps colors to fixed palette' do
          image_file = create(:image_file, :red_fixture)
          color_map_file = create(:color_map_file, source_image_file: image_file)

          color_map_file.process
          color_map_file.reload

          expect(color_map_file.processed_attachment)
            .to have_color(red_from_palette).at(left: 0, top: 0)
        end

        it 'removes dots and shapes that are smaller than 3x3' do
          image_file = create(:image_file, :dots_and_lines_fixture)
          color_map_file = create(:color_map_file, source_image_file: image_file)

          color_map_file.process
          color_map_file.reload

          expect(color_map_file.present_colors.size).to eq(1)
        end

        it 'handles black the same as transparency' do
          image_file = create(:image_file, :green_and_black_fixture)
          color_map_file = create(:color_map_file, source_image_file: image_file)

          color_map_file.process
          color_map_file.reload

          expect(color_map_file.present_colors.size).to eq(1)
        end

        it 'stores colors used in remapped image' do
          image_file = create(:image_file, :red_fixture)
          color_map_file = create(:color_map_file, source_image_file: image_file)

          color_map_file.process
          color_map_file.reload

          expect(color_map_file.present_colors).to eql([red_from_palette])
        end

        it 'stores width and height of resized image' do
          image_file = create(:image_file, :color_map_fixture)
          color_map_file = create(:color_map_file, source_image_file: image_file)

          color_map_file.process
          color_map_file.reload

          expect(color_map_file.width).to eq(20)
          expect(color_map_file.height).to eq(10)
        end

        it 'stores bounding boxes of colors' do
          image_file = create(:image_file, :color_map_fixture)
          color_map_file = create(:color_map_file, source_image_file: image_file)

          color_map_file.process
          color_map_file.reload

          expect(color_map_file.bounding_box_for_color(red_from_palette))
            .to eql(left: 0,
                    top: 0,
                    width: color_map_file.width / 2,
                    height: color_map_file.height / 5 * 2)

          expect(color_map_file.bounding_box_for_color(green_from_palette))
            .to eql(left: color_map_file.width / 2,
                    top: 0,
                    width: color_map_file.width / 2,
                    height: color_map_file.height)
        end

        let(:pixel_where_sprite_is_green)       { {left: 0, top: 0} }
        let(:pixel_where_sprite_is_red)         { {right: 0, top: 0} }
        let(:pixel_where_sprite_is_transparent) { {right: 0, bottom: 0} }

        it 'creates sprite with color components sorted by color name' do
          image_file = create(:image_file, :color_map_fixture)
          color_map_file = create(:color_map_file, source_image_file: image_file)

          color_map_file.process
          color_map_file.reload

          expect(color_map_file.attachment.styles[:sprite])
            .to have_color(green_from_palette).at(pixel_where_sprite_is_green)
          expect(color_map_file.attachment.styles[:sprite])
            .to have_color(red_from_palette).at(pixel_where_sprite_is_red)
          expect(color_map_file.attachment.styles[:sprite])
            .to have_color(:transparent).at(pixel_where_sprite_is_transparent)
        end

        it 'sets processing progress' do
          image_file = create(:image_file, :color_map_fixture)
          color_map_file = create(:color_map_file, source_image_file: image_file)

          color_map_file.process
          color_map_file.reload

          expect(color_map_file.processing_progress).to eq(100)
        end
      end
    end
  end
end
