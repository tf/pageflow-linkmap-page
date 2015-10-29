# Pageflow External Links

Page type to display customizable link areas to internal/external pages.

## Installation

Add this line to your application's `Gemfile`:

    gem 'pageflow-linkmap-page'

Register the page type inside the configure block in `config/initializers/pageflow.rb`

    Pageflow.configure do |config|
      config.register_page_type(Pageflow::LinkmapPage::PageType.new)
    end

Include javascripts and stylesheets:

    # app/assets/javascripts/pageflow/application.js
    //= require pageflow/linkmap_page

    # app/assets/javascripts/pageflow/editor.js
    //= require pageflow/linkmap_page/editor

    # app/assets/stylesheets/pageflow/application.css.scss
    @import "pageflow/linkmap_page";

    # app/assets/stylesheets/pageflow/editor.css.scss
    @import "pageflow/linkmap_page/editor";


Install dependencies:

    bundle install

Restart the application server.

## Troubleshooting

If you run into problems while installing the page type, please also refer to the
[Troubleshooting](https://github.com/codevise/pageflow/wiki/Troubleshooting) wiki
page in the [Pageflow  repository](https://github.com/codevise/pageflow). If that
doesn't help, consider
[filing an issue](https://github.com/upsworld/pageflow-linkmap-page/issues).

## Contributing Locales

Edit the translations directly on the
[pageflow-internal-links](http://www.localeapp.com/projects/public?search=tf/pageflow-linkmap-page)
locale project.
