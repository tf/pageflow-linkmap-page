# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "pageflow-linkmap-page"
  spec.version       = "0.1.0"
  spec.authors       = ["Christoph Merkelbach"]
  spec.email         = ["cmerkelbach@codevise.de"]
  spec.summary       = "Pageflow page type for a page that contains customizable link areas"
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_runtime_dependency 'pageflow', '~> 0.10.pre'
  spec.add_runtime_dependency 'pageflow-external-links', '~> 0.3'

  # Using translations from rails locales in javascript code.
  spec.add_runtime_dependency 'i18n-js'

  spec.add_development_dependency "bundler"
  spec.add_development_dependency "rake"
  spec.add_development_dependency "rspec-rails", "~> 2.0"
  spec.add_development_dependency 'factory_girl_rails'
  spec.add_development_dependency "sqlite3"

  # Browser like integration testing
  spec.add_development_dependency 'capybara'
end
