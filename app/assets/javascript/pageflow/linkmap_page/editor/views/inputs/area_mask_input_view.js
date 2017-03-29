pageflow.linkmapPage.AreaMaskInputView = pageflow.ReferenceInputView.extend({
  choose: function() {
    return this.model.selectMask().then(function() {
      // Reject promise to prevent ReferenceInputView from settings
      // attributes again.
      return new $.Deferred().reject().promise();
    });
  },

  getTarget: function(permaId) {
    return !this.options.disabled &&
      permaId !== undefined &&
      new pageflow.linkmapPage.AreaMaskInputView.Mask({perma_id: permaId});
  }
});

pageflow.linkmapPage.AreaMaskInputView.Mask = Backbone.Model.extend({
  title: function() {
    return I18n.t('pageflow.linkmap_page.editor.views.area_mask_input_view.present');
  },

  thumbnailFile: function() {
    return new pageflow.linkmapPage.AreaMaskInputView.MaskThumbnail();
  }
});

pageflow.linkmapPage.AreaMaskInputView.MaskThumbnail = Backbone.Model.extend({
  mixins: [pageflow.stageProvider],

  thumbnailPictogram: 'linkmap_page_area_mask_input_pictogram',

  isReady: function() {
    return true;
  }
});