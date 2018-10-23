module Pageflow
  module LinkmapPage
    FactoryBot.define do
      factory :color_map_file, class: ColorMapFile do
        association :source_image_file, factory: :image_file

        trait :processed do
          after(:create) do |file|
            file.process!
            file.reload
          end
        end
      end
    end
  end
end
