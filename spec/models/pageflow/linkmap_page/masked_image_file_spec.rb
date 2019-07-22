require 'spec_helper'

module Pageflow
  module LinkmapPage
    describe MaskedImageFile, perform_jobs: :except_enqued_at do
      let :color_map_file do
        color_map_image_file = create(:image_file, :color_map_fixture)

        create(:color_map_file,
               :processed,
               source_image_file: color_map_image_file)
      end

      let(:pixel_where_color_map_is_red)         { {left: 0, top: 0} }
      let(:pixel_where_color_map_is_green)       { {right: 0, top: 0} }
      let(:pixel_where_color_map_is_transparent) { {left: 0, bottom: 1} }

      let(:red_from_color_map_palette)   { 'f65b57' }
      let(:green_from_color_map_palette) { '69a77b' }

      let :transparent_source_image_file do
        create(:image_file, :transparent_fixture)
      end

      let :single_color_source_image_file do
        create(:image_file, :red_fixture)
      end

      let(:color_of_source_image) { '#ff0000' }

      describe 'process' do
        it 're-schedules job if source image file is not uploaded yet' do
          image_file = create(:image_file, :not_yet_uploaded)
          masked_image_file = create(:masked_image_file,
                                     color_map_file: color_map_file,
                                     source_image_file: image_file)

          masked_image_file.process

          expect(ProcessSourceImageFileJob)
            .to have_been_enqueued.at(3.seconds.from_now)
        end

        it 're-schedules job if color map file is not ready yet' do
          color_map_file = create(:color_map_file, state: 'processing')
          masked_image_file = create(:masked_image_file,
                                     color_map_file: color_map_file,
                                     source_image_file: single_color_source_image_file)

          masked_image_file.process

          expect(ProcessSourceImageFileJob)
            .to have_been_enqueued.at(3.seconds.from_now)
        end

        it 'fails if source image file failed' do
          image_file = create(:image_file, :uploading_failed)
          masked_image_file = create(:masked_image_file,
                                     color_map_file: color_map_file,
                                     source_image_file: image_file)

          masked_image_file.process
          masked_image_file.reload

          expect(masked_image_file).to be_failed
        end

        it 'fails if color map file failed' do
          color_map_file = create(:color_map_file, state: 'processing_failed')
          masked_image_file = create(:masked_image_file,
                                     color_map_file: color_map_file,
                                     source_image_file: single_color_source_image_file)

          masked_image_file.process
          masked_image_file.reload

          expect(masked_image_file).to be_failed
        end

        it 'creates images for each color in color map masked to the area of that color' do
          masked_image_file = create(:masked_image_file,
                                     color_map_file: color_map_file,
                                     source_image_file: single_color_source_image_file)

          masked_image_file.process
          masked_image_file.reload

          expect(masked_image_file.for_color(red_from_color_map_palette))
            .to have_color(color_of_source_image).at(pixel_where_color_map_is_red)

          expect(masked_image_file.for_color(green_from_color_map_palette))
            .to have_color(color_of_source_image).at(pixel_where_color_map_is_green)
        end

        it 'leaves other parts of the image transparent' do
          masked_image_file = create(:masked_image_file,
                                     color_map_file: color_map_file,
                                     source_image_file: single_color_source_image_file)

          masked_image_file.process
          masked_image_file.reload

          expect(masked_image_file.for_color(red_from_color_map_palette))
            .to have_color(:transparent).at(pixel_where_color_map_is_green)

          expect(masked_image_file.for_color(red_from_color_map_palette))
            .to have_color(:transparent).at(pixel_where_color_map_is_transparent)
        end

        it 'leaves transparent areas of source image transparent' do
          masked_image_file = create(:masked_image_file,
                                     color_map_file: color_map_file,
                                     source_image_file: transparent_source_image_file)

          masked_image_file.process
          masked_image_file.reload

          expect(masked_image_file.for_color(red_from_color_map_palette))
            .to have_color(:transparent).at(pixel_where_color_map_is_red)
        end

        it 'updates processing progress' do
          masked_image_file = create(:masked_image_file,
                                     color_map_file: color_map_file,
                                     source_image_file: single_color_source_image_file)

          masked_image_file.process
          masked_image_file.reload

          expect(masked_image_file.processing_progress).to eq(100)
        end
      end
    end
  end
end
