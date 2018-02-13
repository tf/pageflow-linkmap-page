//= require_self

//= require ./editor/models/processed_file
//= require_tree ./editor/models
//= require_tree ./editor/collections
//= require_tree ./editor/routers
//= require_tree ./editor/controllers
//= require_tree ./editor/templates
//= require_tree ./editor/views
//= require_tree ./editor/patterns

//= require ./editor/config

pageflow.linkmapPage = pageflow.linkmapPage || {};

pageflow.linkmapPage.areaTypesFor = function(pageConfiguration) {
  return new Backbone.Collection(_([
    pageflow.linkmapPage.PageLinkAreaType,
    pageflow.linkmapPage.AudioFileAreaType,
    pageflow.linkmapPage.ExternalLinkAreaType,
    pageflow.linkmapPage.TextOnlyAreaType
  ]).map(function(constructor) {
    return new constructor({}, {
      pageConfiguration: pageConfiguration
    });
  }));
};

pageflow.linkmapPage.selectArea = function(page, options) {
  options = options || {};

  pageflow.entry.unset('emulation_mode');

  return $.Deferred(function(deferred) {
    pageflow.linkmapPage.currentAreaSelection = _.extend(options, {
      deferred: deferred
    });

    var path = 'linkmap_pages/' + page.id + '/select_area_position' +
      (options.areaIndex !== undefined ? '?area=' + options.areaIndex : '');

    pageflow.editor.navigate(path, {trigger: true});
  }).promise();
};
