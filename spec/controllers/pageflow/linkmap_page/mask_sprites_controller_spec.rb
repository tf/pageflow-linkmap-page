require 'spec_helper'

module Pageflow
  module LinkmapPage
    describe MaskSpritesController do
      DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAA' \
        'ANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAGXRFWHRTb2Z' \
        '0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAENJREFU' \
        'eNpiYICABCDeAcRfoXQCA5LEDyD+j4R/wBTsQJOAYZA42' \
        'Chskl+ZgMRhBuzgMEhyBRD/RJP4CRXH7VqAAAMA2qweFJ' \
        'llSygAAAAASUVORK5CYII='.freeze

      describe '#create' do
        routes { Pageflow::LinkmapPage::Engine.routes }

        it 'responds with success for member' do
          user = create(:user)
          entry = create(:entry, with_editor: user)
          image_file = create(:image_file, used_in: entry.draft)

          sign_in(user)
          post(:create,
               image_file_id: image_file.id,
               mask_sprite: {attachment: DATA_URL},
               format: 'json')

          expect(response.status).to eq(201)
        end

        it 'includes id of created mask sprite in response' do
          user = create(:user)
          entry = create(:entry, with_editor: user)
          image_file = create(:image_file, used_in: entry.draft)

          sign_in(user)
          post(:create,
               image_file_id: image_file.id,
               mask_sprite: {attachment: DATA_URL},
               format: 'json')

          json = JSON.parse(response.body)

          expect(json['id']).to eq(MaskSprite.last.id)
        end

        it 'creates mask sprite for image' do
          user = create(:user)
          entry = create(:entry, with_editor: user)
          image_file = create(:image_file, used_in: entry.draft)

          sign_in(user)
          post(:create,
               image_file_id: image_file.id,
               mask_sprite: {attachment: DATA_URL},
               format: 'json')
          mask_sprite = MaskSprite.where(image_file: image_file).first

          expect(mask_sprite).to be_present
          expect(mask_sprite.attachment).to be_present
        end

        it 'does not recreate mask sprite if it already exists' do
          user = create(:user)
          entry = create(:entry, with_editor: user)
          image_file = create(:image_file, used_in: entry.draft)

          sign_in(user)
          post(:create,
               image_file_id: image_file.id,
               mask_sprite: {attachment: DATA_URL},
               format: 'json')

          expect {
            post(:create,
                 image_file_id: image_file.id,
                 mask_sprite: {attachment: DATA_URL},
                 format: 'json')
          }.not_to change { MaskSprite.count }
        end

        it 'requires user to have permissions for entry' do
          user = create(:user)
          entry = create(:entry)
          image_file = create(:image_file, used_in: entry.draft)

          sign_in(user)
          post(:create,
               image_file_id: image_file.id,
               mask_sprite: {attachment: DATA_URL},
               format: 'json')

          expect(response.status).to eq(403)
        end

        it 'requires user to be signed in' do
          image_file = create(:image_file)

          post(:create,
               image_file_id: image_file.id,
               mask_sprite: {attachment: DATA_URL},
               format: 'json')

          expect(response.status).to eq(401)
        end
      end
    end
  end
end
