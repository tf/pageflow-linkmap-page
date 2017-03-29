pageflow.linkmapPage.AreasEmbeddedView = Backbone.Marionette.View.extend({
  events: {
    'linkmapbackgroundclick': function() {
      this.model.linkmapAreas(this.options.propertyName).resetSelection();
      pageflow.editor.navigate('/pages/' + this.model.page.id + '/areas', {trigger: true});
    }
  },

  render: function() {
    var view = this;

    var masksDelegator = this.masks = new pageflow.linkmapPage.MasksDelegator();

    this.$el.on('linkmapupdatemasks', function(event, options) {
      masksDelegator.updateDelegate(options.masks);
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
        masks: masksDelegator
      }
    }));

    view.appendSubview(new pageflow.linkmapPage.AreaOutlinesEmbeddedView({
      model: this.model,
      areas: this.model.linkmapAreas(this.options.propertyName),
      masks: masksDelegator
    }));

    view.appendSubview(new pageflow.linkmapPage.AreaMasksPreviewEmbeddedView({
      model: this.model,
      areas: this.model.linkmapAreas(this.options.propertyName),
      masks: masksDelegator
    }));

    this.listenTo(this.model.page, 'change:areas_editable', function() {
      this.updateClassNames();
    });

    return this;
  },

  updateClassNames: function() {
    var editable = this.model.page.get('areas_editable');

    this.$el.toggleClass('editable', !!editable);
    this.$el.toggleClass('masks_available', !this.masks.isEmpty());
  }
});