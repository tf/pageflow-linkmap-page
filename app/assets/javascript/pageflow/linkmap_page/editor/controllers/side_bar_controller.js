pageflow.linkmapPage.SideBarController = Backbone.Marionette.Controller.extend({
  initialize: function(options) {
    this.region = options.region;
  },

  area: function(pageId, areaIndex) {
    var page = pageflow.pages.get(pageId);

    this.region.show(new pageflow.linkmapPage.EditAreaView({
      model: page.configuration.linkmapAreas().at(parseInt(areaIndex, 10)),
      page: page,
      areaIndex: areaIndex
    }));
  },

  selectAreaPosition: function(pageId) {
    var returnPath = 'pages/' + pageId + '/areas';

    if (!pageflow.linkmapPage.currentAreaSelection) {
      pageflow.editor.navigate(returnPath, {trigger: true});
      return;
    }

    var page = pageflow.pages.get(pageId);
    page.configuration.trigger('linkmap:select_area_position', {
      selection: pageflow.linkmapPage.currentAreaSelection
    });

    this.region.show(new pageflow.linkmapPage.SelectAreaPostionHintView({
      model: page,
      selection: pageflow.linkmapPage.currentAreaSelection
    }));

    pageflow.linkmapPage.currentAreaSelection.deferred.always(function() {
      pageflow.editor.navigate(returnPath, {trigger: true});
    });
  }
});