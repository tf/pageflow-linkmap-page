pageflow.linkmapPage.AreasCollection = Backbone.Collection.extend({
  model: pageflow.linkmapPage.Area,

  initialize: function(models, options) {
    this.page = options.page;
    this.defaultPosition = {
      left: 10,
      top: 10
    };
  },

  /**
   * @param [Object, Function] value
   */
  setDefaultPosition: function(value) {
    this.defaultPosition = value;
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
    this.add(_.extend(
      {width: 7, height: 7},
      _.result(this, 'defaultPosition'),
      attributes
    ));
  }
});