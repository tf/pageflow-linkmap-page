pageflow.linkmapPage.ScaledOnPhoneHintView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/linkmap_page/editor/templates/scaled_on_phone_hint',
  className: 'scaled_on_phone_hint',

  modelEvents: {
    'change:scaled_on_portrait_phone change:scaled_on_landscape_phone': 'update'
  },

  ui: {
    hint: 'p'
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    this.$el.toggle(this.model.get('scaled_on_portrait_phone') ||
                    this.model.get('scaled_on_landscape_phone'));

    if (this.model.get('scaled_on_portrait_phone') &&
        this.model.get('scaled_on_landscape_phone')) {
      this.ui.hint.text(this.hintText('both'));
    }
    else if (this.model.get('scaled_on_portrait_phone')) {
      this.ui.hint.text(this.hintText('portrait'));
    }
    else if (this.model.get('scaled_on_landscape_phone')) {
      this.ui.hint.text(this.hintText('landscape'));
    }
  },

  hintText: function(orientation) {
    var prefix = 'pageflow.linkmap_page.editor.views.scaled_on_phone_hint';
    return I18n.t(prefix + '.text', {
      orientation: I18n.t(prefix + '.orientations.' + orientation)
    });
  }
});