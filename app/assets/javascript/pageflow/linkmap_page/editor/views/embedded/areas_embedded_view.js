pageflow.linkmapPage.AreasEmbeddedView = Backbone.Marionette.View.extend({
  events: {
    'linkmapbackgroundclick': function() {
      this.model.linkmapAreas(this.options.propertyName).resetSelection();
      pageflow.editor.navigate('/pages/' + this.model.page.id + '/areas', {trigger: true});
    }
  },

  render: function() {
    var view = this;

    var colorMapDelegator = this.colorMap = new pageflow.linkmapPage.ColorMapDelegator();

    this.$el.on('linkmapupdatecolormap', function(event, options) {
      colorMapDelegator.updateDelegate(options.colorMap);
      view.updateClassNames();
    });

    this.subview(new pageflow.CollectionView({
      el: this.$el,
      collection: this.model.linkmapAreas(this.options.propertyName),
      itemViewConstructor: pageflow.linkmapPage.AreaItemEmbeddedView,
      itemViewOptions: {
        pageConfiguration: this.model,
        page: this.model.page,
        container: this.options.container,
        colorMap: colorMapDelegator
      }
    }));

    view.appendSubview(new pageflow.linkmapPage.AreaMasksPreviewEmbeddedView({
      model: this.model,
      areas: this.model.linkmapAreas(this.options.propertyName),
      colorMap: colorMapDelegator
    }));

    this.listenTo(this.model.page, 'change:areas_editable', function() {
      this.updateClassNames();
    });

    this.listenTo(pageflow.entry, 'change:emulation_mode', function() {
      this.updateClassNames();
    });

    return this;
  },

  updateClassNames: function() {
    var editable = this.model.page.get('areas_editable') && !pageflow.entry.has('emulation_mode');

    this.$el.toggleClass('editable', !!editable);
    this.$el.toggleClass('masks_available',
                         this.colorMap.components().length > 0 &&
                         this.model.get('background_type') !== 'hover_video');
  }
});