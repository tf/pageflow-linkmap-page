# Pageflow Linkmap Page

[![Gem Version](https://badge.fury.io/rb/pageflow-linkmap-page.svg)](http://badge.fury.io/rb/pageflow-linkmap-page)
[![Build Status](https://travis-ci.org/codevise/pageflow-linkmap-page.svg?branch=master)](https://travis-ci.org/codevise/pageflow-linkmap-page)

Page type to display customizable link areas to internal/external
pages and inline audio players.

## Installation

Add this line to your application's `Gemfile`:

    gem 'pageflow-linkmap-page'
    gem 'pageflow-external-links' # needed to copy the migration contained within

Register the page type inside the configure block in `config/initializers/pageflow.rb`

    Pageflow.configure do |config|
      config.plugin(Pageflow::LinkmapPage.plugin)
    end

Include javascripts and stylesheets:

    # app/assets/javascripts/pageflow/application.js
    //= require pageflow/linkmap_page

    # app/assets/javascripts/pageflow/editor.js
    //= require pageflow/linkmap_page/editor

    # app/assets/stylesheets/pageflow/application.scss
    @import "pageflow/linkmap_page";

    # app/assets/stylesheets/pageflow/editor.scss
    @import "pageflow/linkmap_page/editor";

Import default theme additions:

    # app/assets/stylesheets/pageflow/themes/default.scss

    @import "pageflow/linkmap_page/themes/default";

    /* Display arrows left and right to indicate panorama */
    @import "pageflow/linkmap_page/themes/default/scroll_indicators";

Install dependencies:

    bundle install

Install and run migrations:

    $ rake pageflow_linkmap_page:install:migrations
    $ rake db:migrate

Then follow the installation instructions for the [pageflow-external-links](https://github.com/codevise/pageflow-external-links) gem.

Restart the application server and enable the corresponding page type
feature for entries in the tab *features*.

## Troubleshooting

If you run into problems while installing the page type, please also refer to the
[Troubleshooting](https://github.com/codevise/pageflow/wiki/Troubleshooting) wiki
page in the [Pageflow  repository](https://github.com/codevise/pageflow). If that
doesn't help, consider
[filing an issue](https://github.com/codevise/pageflow-linkmap-page/issues).

## Contributing Locales

Edit the translations directly on the
[pageflow-linkmap-page](http://www.localeapp.com/projects/public?search=tf/pageflow-linkmap-page)
locale project.
