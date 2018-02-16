source 'https://rubygems.org'

# Specify your gem's dependencies in chart.gemspec
gemspec

gem 'state_machine', git: 'https://github.com/codevise/state_machine.git'

gem 'spring-commands-rspec', group: :development
gem 'spring-commands-teaspoon', group: :development

# Required to make Bundler 1.16.1 find a resolution. Without this line
# `bundle install` without a `Gemfile.lock` would run for a very long
# time makin the Travis build time out.
gem 'railties', '~> 4.2'
