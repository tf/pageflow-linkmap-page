module Pageflow
  module LinkmapPage
    FactoryGirl.define do
      factory :color_map_file, class: ColorMapFile do
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
