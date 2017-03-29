pageflow.linkmapPage.AreasEmbeddedView = Backbone.Marionette.View.extend({
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

    this.listenTo(this.model.page, 'change:areas_editable', function() {
      this.updateClassName();
    });

    return this;
  },

  updateClassName: function() {
    var editable = this.model.page.get('areas_editable');

    this.$el.toggleClass('editable', !!editable);
  }
});