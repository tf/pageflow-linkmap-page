pageflow.linkmapPage.SideBarRouter = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    'linkmap_pages/:pageId/areas/:index': 'area',

    'linkmap_pages/:pageId/select_area_position': 'selectAreaPosition',
  }
});