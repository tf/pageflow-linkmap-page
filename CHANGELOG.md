# CHANGELOG

### Unreleased Changes

[Compare changes](http://github.com/codevise/pageflow-linkmap-page/compare/0-2-stable...master)

##### Manual Update Step

The plugin now provides additional routes and migrations. Mount the engine:

    # config/routes.rb
    mount Pageflow::LinkmapPage::Engine, at: '/linkmap_page'

Install and run migrations:

    $ rake pageflow_linkmap_page:install:migrations
    $ rake db:migrate

##### Features

- Support mask image for non rectangular areas
  ([#22](https://github.com/codevise/pageflow-linkmap-page/pull/22))

See
[0-2-stable branch](https://github.com/codevise/pageflow-linkmap-page/blob/0-2-stable/CHANGELOG.md)
for previous changes.
