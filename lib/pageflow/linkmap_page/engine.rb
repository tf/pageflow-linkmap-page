require 'pageflow-external-links'

module Pageflow
  module LinkmapPage
    class Engine < Rails::Engine
      isolate_namespace Pageflow::LinkmapPage

      config.autoload_paths << File.join(config.root, 'lib')
      config.i18n.load_path += Dir[config.root.join('config', 'locales', '**', '*.yml').to_s]

      initializer 'pageflow_linkmap_page.paperclip' do
        Paperclip.configure do |config|
          config.register_processor(:pageflow_linkmap_page_image_colors,
                                    Pageflow::LinkmapPage::PaperclipProcessors::Colors)

          config.register_processor(:pageflow_linkmap_page_color_mask,
                                    Pageflow::LinkmapPage::PaperclipProcessors::ColorMask)

          config.register_processor(:pageflow_linkmap_page_invoke_callback,
                                    Pageflow::LinkmapPage::PaperclipProcessors::InvokeCallback)

          config.register_processor(:pageflow_linkmap_page_image_dimensions,
                                    Pageflow::LinkmapPage::PaperclipProcessors::ImageDimensions)
        end
      end

      config.generators do |g|
        g.test_framework :rspec,:fixture => false
        g.fixture_replacement :factory_girl, :dir => 'spec/factories'
        g.assets false
        g.helper false
      end
    end
  end
end
