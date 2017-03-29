pageflow.linkmapPage.EditAreaView = Backbone.Marionette.Layout.extend({
  template: 'pageflow/linkmap_page/editor/templates/edit_area',

  regions: {
    formContainer: '.form_container'
  },

  ui: {
    backButton: 'a.back'
  },

  events: {
    'click a.back': 'goBack',

    'click a.destroy': 'destroy'
  },

  onRender: function() {
    var configurationEditor = new pageflow.ConfigurationEditorView({
      model: this.model
    });

    this.configure(configurationEditor);
    this.formContainer.show(configurationEditor);

    this.subview(new pageflow.linkmapPage.EditableAreasModeView({
      model: this.model.collection.page
    }));

    this.model.select();
  },

  configure: function(configurationEditor) {
    var view = this;
    var page = this.options.page;

    configurationEditor.tab('general', function() {
      this.input('name', pageflow.TextInputView);

      this.input('target_type', pageflow.SelectInputView, {
        values: ['page', 'external_site', 'audio_file', 'text_only'],
        ensureValueDefined: true
      });

      this.input('target_id', pageflow.PageLinkInputView, {
        visibleBinding: 'target_type',
        visibleBindingValue: 'page'
      });

      this.input('page_transition', pageflow.SelectInputView, {
        translationKeyPrefix: 'pageflow.page_transitions',
        includeBlank: true,
        blankTranslationKey: 'pageflow.linkmap_page.default_page_transition',
        values: pageflow.pageTransitions.names(),
        visibleBinding: 'target_type',
        visibleBindingValue: 'page'
      });

      this.input('target_id', pageflow.externalLinks.SiteReferenceInputView, {
        visibleBinding: 'target_type',
        visibleBindingValue: 'external_site'
      });

      this.input('target_id', pageflow.FileInputView, {
        collection: 'audio_files',
        fileSelectionHandler: 'linkmapPage.area',
        fileSelectionHandlerOptions: {
          areaIndex: view.options.areaIndex,
        },
        visibleBinding: 'target_type',
        visibleBindingValue: 'audio_file'
      });

      this.input('link_title', pageflow.TextInputView);
      this.input('link_description', pageflow.TextAreaInputView, {size: 'short'});
    });

    configurationEditor.tab('appearance', function() {
      this.input('marker', pageflow.SelectInputView, {values: pageflow.linkmapPage.markerOptions});
      this.input('mask_perma_id', pageflow.linkmapPage.AreaMaskInputView, {
        visibleBinding: 'marker',
        visible: function(value) {
          return value !== 'dynamic_marker';
        },
        disabled: !page.configuration.getImageFileUrl('mask_image_id')
      });
      this.input('inverted', pageflow.CheckBoxInputView, {
        visibleBinding: 'target_type',
        visible: function(value) {
          return value !== 'text_only';
        }
      });
    });
  },

  destroy: function() {
    if (confirm(I18n.t('pageflow.linkmap_page.editor.views.edit_area_view.confirm_destroy'))) {
      this.model.remove();
      this.goBack();
    }
  },

  goBack: function() {
    pageflow.editor.navigate('/pages/' + this.options.page.id + '/areas', {trigger: true});
  }
});