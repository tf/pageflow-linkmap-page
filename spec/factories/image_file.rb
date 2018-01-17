FactoryGirl.modify do
  fixtures = Pageflow::LinkmapPage::Engine.root.join('spec', 'support', 'fixtures')

  factory :image_file do
    trait :red_fixture do
      processed_attachment File.open(fixtures.join('red.png'))
    end

    trait :color_map_fixture do
      processed_attachment File.open(fixtures.join('color_map.png'))
    end

    trait :transparent_fixture do
      processed_attachment File.open(fixtures.join('transparent.png'))
    end
  end
end
