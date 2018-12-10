# CHANGELOG

### Version 2.0.0

2018-12-10

[Compare changes](https://github.com/codevise/pageflow-linkmap-page/compare/1-x-stable...v2.0.0)

##### Breaking Changes

- Requires Pageflow 13.
  ([#35](https://github.com/codevise/pageflow-linkmap-page/pull/35),
   [#38](https://github.com/codevise/pageflow-linkmap-page/pull/38))

- Use server side processing for color maps and masked images.
  ([#42](https://github.com/codevise/pageflow-linkmap-page/pull/42))

  Remove the following line from your `config/routes.rb` file:

        mount Pageflow::LinkmapPage::Engine, at: '/linkmap_page'

  Run the following rake task to trigger server side processing of
  color maps and masked images:

        bin/rake pageflow_linkmap_page:migrate_to_masked_image_files

  Consider running this task on a separate machine to handle file
  processing before deploying the update.

##### Features

- Paginated mobile navigation
  ([#43](https://github.com/codevise/pageflow-linkmap-page/pull/43))
- Integrate with horizontal slideshow navigation
  ([#44](https://github.com/codevise/pageflow-linkmap-page/pull/44))

See
[1-x-stable branch](https://github.com/codevise/pageflow-linkmap-page/blob/1-x-stable/CHANGELOG.md)
for previous changes.
