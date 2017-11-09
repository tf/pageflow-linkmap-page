pageflow.linkmapPage.MobileInfoBoxEmbeddedView = Backbone.Marionette.View.extend({
  modelEvents: {
    'change:mobile_info_box_title change:mobile_info_box_description': 'update'
  },

  render: function() {
    var collection = this.model.linkmapAreas();
    var paginator = this.paginator = this.$el.find('.linkmap-paginator');

    this.setupOverviewPage();

    this.subview(new pageflow.CollectionView({
      el: this.$el.find('.linkmap-paginator-page_group'),
      collection: collection,
      itemViewConstructor: pageflow.linkmapPage.MobileInfoBoxPageItemEmbeddedView,
      itemViewOptions: {
        paginator: paginator
      }
    }));

    this.listenTo(collection, 'add remove', function() {
      paginator.linkmapPaginator('update');
    });

    this.update();
    paginator.linkmapPaginator('update');

    return this;
  },

  setupOverviewPage: function() {
    var overviewPage = this.$el.find('.linkmap-paginator-page').eq(1);

    this.ui = {
      title: $('<h3 />').appendTo(overviewPage),
      description: $('<p />').appendTo(overviewPage)
    };
  },

  update: function() {
    this.ui.title.text(this.model.get('mobile_info_box_title'));
    this.ui.description.html(this.model.get('mobile_info_box_description'));

    this.paginator.linkmapPaginator('updateHeight');
  }
});