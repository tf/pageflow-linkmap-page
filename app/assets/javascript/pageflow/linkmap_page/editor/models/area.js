pageflow.linkmapPage.Area = Backbone.Model.extend({
  modelName: 'area',
  i18nKey: 'pageflow/linkmap_page/area',

  mixins: [pageflow.transientReferences],

  target: function() {
    // This should eventually be replaces with some sort of
    // polymorphic lookup for referenceable objects i.e.
    //
    //     pageflow.xxx.getPolymorphic(this.get('target_type'), this.get('target_id'));
    //
    if (this.get('target_type') === 'audio_file') {
      return pageflow.audioFiles.get(this.get('target_id'));
    }
    else if (this.get('target_type') === 'page') {
      return pageflow.pages.getByPermaId(this.get('target_id'));
    }
    else if (this.get('target_type') === 'external_site') {
      return pageflow.externalLinks.sites.getByPermaId(this.get('target_id'));
    }
  },

  targetPage: function() {
    return this.get('target_type') === 'page' ? this.target() : null;
  },

  title: function() {
    if (this.get('target_type') === 'text_only') {
      return this.get('link_title');
    }
    else {
      var target = this.target();
      return target ? target.title() : null;
    }
  },

  thumbnailFile: function() {
    if (this.get('target_type') === 'text_only') {
      return this.textOnlyAreaPlaceholderFile();
    }

    var target = this.target();
    return target ? target.thumbnailFile() : null;
  },

  textOnlyAreaPlaceholderFile: function() {
    if (!pageflow.linkmapPage.Area.textOnlyAreaPlaceholderFile) {
      var file = new pageflow.AudioFile({
        state: 'encoded'
      });

      file.thumbnailPictogram = 'text_only';
      pageflow.linkmapPage.Area.textOnlyAreaPlaceholderFile = file;
    }

    return pageflow.linkmapPage.Area.textOnlyAreaPlaceholderFile;
  },

  label: function() {
    return this.get('name');
  },

  highlight: function() {
    this.set('highlighted', true);
  },

  resetHighlight: function() {
    this.unset('highlighted');
  },

  editPath: function() {
    var areaIndex = this.collection.indexOf(this);
    return '/linkmap_pages/' + this.getRoutableId() + '/areas/' + areaIndex;
  },

  getRoutableId: function() {
    return this.collection.page.id;
  },

  remove: function() {
    this.collection.remove(this);
  }
});
