# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'pageflow/linkmap_page/version'

Gem::Specification.new do |spec|
  spec.name          = 'pageflow-linkmap-page'
  spec.version       = Pageflow::LinkmapPage::VERSION
  spec.authors       = ['Codevise Solutions Ltd.']
  spec.email         = ['info@codevise.de']
  spec.summary       = 'Pageflow page type for a page that contains customizable link areas'
  spec.homepage      = 'https://github.com/codevise/pageflow-linkmap-page'
  spec.license       = 'MIT'

  spec.files         = `git ls-files`.split($/)
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ['lib']

  spec.required_ruby_version = '~> 2.1'

  spec.add_runtime_dependency 'pageflow', '~> 13.x'
  spec.add_runtime_dependency 'pageflow-external-links', '~> 2.x'

  spec.add_development_dependency 'pageflow-support', '~> 13.x'
  spec.add_development_dependency 'bundler', '~> 1.0'
  spec.add_development_dependency 'rake', '~> 12.0'
  spec.add_development_dependency 'rspec-rails', '~> 3.7'
  spec.add_development_dependency 'factory_bot_rails', '~> 4.8'
  spec.add_development_dependency 'sqlite3', '~> 1.3'

  # Browser like integration testing
  spec.add_development_dependency 'capybara', '~> 2.13'

  # PNG processing
  spec.add_development_dependency 'chunky_png', '~> 1.3'

  # Remove whitespace from strings
  spec.add_development_dependency 'unindent', '~> 1.0'

  # Semantic versioning rake tasks
  spec.add_development_dependency 'semmy', '~> 1.0'
end
