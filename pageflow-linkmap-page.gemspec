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
  spec.homepage      = 'http://github.com/codevise/pageflow-linkmap-page'
  spec.license       = 'MIT'

  spec.files         = `git ls-files`.split($/)
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ['lib']

  spec.add_runtime_dependency 'pageflow', ['>= 0.10', '< 13']
  spec.add_runtime_dependency 'pageflow-external-links', ['>= 0.3', '< 2']

  spec.add_development_dependency 'bundler', '~> 1.0'
  spec.add_development_dependency 'rake', '~> 12.0'
  spec.add_development_dependency 'rspec-rails', '~> 3.0'
  spec.add_development_dependency 'factory_girl_rails', '~> 4.5'
  spec.add_development_dependency 'sqlite3', '~> 1.3'

  # Browser like integration testing
  spec.add_development_dependency 'capybara', '~> 2.13'

  # Semantic versioning rake tasks
  spec.add_development_dependency 'semmy', '~> 0.2.1'
end
