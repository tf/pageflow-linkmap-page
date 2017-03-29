pageflow.linkmapPage.SelectAreaPostionHintView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/linkmap_page/editor/templates/select_area_position_hint',
  className: 'select_area_position_hint',

  ui: {
    hint: 'p'
  },

  events: {
    'click .cancel': function() {
      this.options.selection.deferred.reject();
      return false;
    }
  },

  onRender: function() {
    if (this.model.configuration.getImageFileUrl('mask_image_id')) {
      if (this.options.selection.type === 'mask') {
        this.ui.hint.text(this.t('select_mask_hint'));
      }
      else {
        this.ui.hint.text(this.t('select_mask_or_drag_hint'));
      }
    }
    else {
      this.ui.hint.text(this.t('drag_hint'));
    }

    this.model.set('areas_outlined', true);
  },

  onClose: function() {
    this.model.unset('areas_outlined');
  },

  t: function(key) {
    return I18n.t('pageflow.linkmap_page.editor.views.select_area_position_hint.' + key);
  }
});