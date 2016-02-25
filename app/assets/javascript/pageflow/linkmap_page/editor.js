//= require_self

//= require_tree ./editor/models
//= require_tree ./editor/collections
//= require_tree ./editor/routers
//= require_tree ./editor/controllers
//= require_tree ./editor/templates
//= require_tree ./editor/views

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