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
    var view = this;
    var area = this.model;
    var areaCollection = this.model.collection;
    var configurationEditor = new pageflow.ConfigurationEditorView({
      model: this.model
    });

    this.configure(configurationEditor);

    this.formContainer.show(configurationEditor);
    this.model.set('highlighted', true);
    this.model.collection.page.set('areas_editable', true);

    this.on('close', function() {
      area.unset('highlighted');
      areaCollection.page.unset('areas_editable');
    });
  },

  configure: function(configurationEditor) {
    var view = this;

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