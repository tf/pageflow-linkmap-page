FactoryGirl.definition_file_paths << Pageflow::LinkmapPage::Engine.root.join('spec', 'factories')

RSpec.configure do |config|
  # Allow to use build and create methods without FactoryGirl prefix.
  config.include FactoryGirl::Syntax::Methods

  # Make sure factories are up to date when using spring. Skip in CI
  # since reloading causes factories to be excluded in test coverage.
  unless ENV['CI']
    config.before(:all) do
      FactoryGirl.reload
    end
  end
end
