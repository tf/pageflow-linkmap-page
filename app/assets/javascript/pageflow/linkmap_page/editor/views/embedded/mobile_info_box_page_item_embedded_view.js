pageflow.linkmapPage.MobileInfoBoxPageItemEmbeddedView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/linkmap_page/editor/templates/embedded/mobile_info_box_page_item',

  className: 'linkmap-paginator-page',

  ui: {
    title: 'h3',
    description: 'p'
  },

  modelEvents: {
    'change:link_title change:link_description': 'update'
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    this.ui.title.text(this.model.get('link_title'));
    this.ui.description.html(this.model.get('link_description'));

    this.ui.title.toggle(!!this.model.get('link_title'));
    this.ui.description.toggle(!!this.model.get('link_description'));

    this.options.paginator.linkmapPaginator('updateHeight');
  }
});