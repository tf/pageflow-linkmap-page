pageflow.linkmapPage.TextOnlyAreaType = Backbone.Model.extend({
  defaults: function() {
    return {
      label: I18n.t('pageflow.linkmap_page.editor.area_types.text_only')
    };
  },

  initialize: function(attributes, options) {
    this.pageConfiguration = options.pageConfiguration;
  },

  selected: function() {
    this.pageConfiguration.linkmapAreas().addTextOnly();
  }
});