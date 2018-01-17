module Pageflow
  module LinkmapPage
    FactoryBot.define do
      factory :masked_image_file, class: MaskedImageFile do
        association :source_image_file, factory: :image_file
        color_map_file
      end
    end
  end
end
