FactoryBot.modify do
  fixtures = Pageflow::LinkmapPage::Engine.root.join('spec', 'support', 'fixtures')

  factory :image_file do
    trait :red_fixture do
      processed_attachment { File.open(fixtures.join('red.png')) }
    end

    trait :color_map_fixture do
      processed_attachment { File.open(fixtures.join('color_map.png')) }
    end

    trait :transparent_fixture do
      processed_attachment { File.open(fixtures.join('transparent.png')) }
    end

    trait :dots_and_lines_fixture do
      processed_attachment { File.open(fixtures.join('dots_and_lines.png')) }
    end

    trait :green_and_black_fixture do
      processed_attachment { File.open(fixtures.join('green_and_black.png')) }
    end
  end
end
