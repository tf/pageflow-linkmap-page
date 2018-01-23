ENV['RAILS_ENV'] ||= 'test'
ENV['PAGEFLOW_PLUGIN_ENGINE'] = 'pageflow_linkmap_page'

require 'factory_girl_rails'
require 'unindent'

require 'pageflow/support'
Pageflow::Dummy.setup

require 'pageflow-linkmap-page'
require 'rspec/rails'

engine_root = File.join(File.dirname(__FILE__), '..')
Dir[File.join(engine_root, 'spec/support/**/*.rb')].each { |file| require(file) }

RSpec.configure do |config|
  config.infer_spec_type_from_file_location!
  config.use_transactional_fixtures = true
  config.infer_base_class_for_anonymous_controllers = false
  config.order = "random"

  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end
end
