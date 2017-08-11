# CHANGELOG

### Version 1.0.0

2017-08-11

[Compare changes](https://github.com/codevise/pageflow-linkmap-page/compare/0-2-stable...v1.0.0)

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
- Add support for pageflow-external-links 1.x
  ([#26](https://github.com/codevise/pageflow-linkmap-page/pull/26))
- Rename the last `css.scss` files
  ([#25](https://github.com/codevise/pageflow-linkmap-page/pull/25))
- Require pageflow 12
  ([#24](https://github.com/codevise/pageflow-linkmap-page/pull/24))

See
[0-2-stable branch](https://github.com/codevise/pageflow-linkmap-page/blob/0-2-stable/CHANGELOG.md)
for previous changes.
