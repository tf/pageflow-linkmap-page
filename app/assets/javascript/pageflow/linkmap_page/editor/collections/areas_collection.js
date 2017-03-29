pageflow.linkmapPage.AreasCollection = Backbone.Collection.extend({
  model: pageflow.linkmapPage.Area,

  initialize: function(models, options) {
    this.page = options.page;
    this.defaultPosition = {
      left: 10,
      top: 10
    };

    this.listenTo(this, 'select', this.updateSelectedAttributes);
  },

  canAddLink: function() {
    return true;
  },

  addLink: function(targetPageId) {
    this.addWithPosition({
      target_type: 'page',
      target_id: targetPageId
    });
  },

  addAudioFile: function(audioFileId) {
    this.addWithPosition({
      target_type: 'audio_file',
      target_id: audioFileId
    });
  },

  addExternalSite: function(siteId) {
    this.addWithPosition({
      target_type: 'external_site',
      target_id: siteId
    });
  },

  addTextOnly: function() {
    this.addWithPosition({
      target_type: 'text_only'
    });
  },

  addWithPosition: function(attributes) {
    var collection = this;

    pageflow.linkmapPage.selectArea(this.page).then(function(positionAttributes) {
      collection.add(_.extend(
        positionAttributes,
        attributes
      ));
    });
  },

  resetSelection: function() {
    this.updateSelectedAttributes(null);
  },

  updateSelectedAttributes: function(selectedArea) {
    this.each(function(area) {
      area.set('selected', area === selectedArea);
    });
  }
});
