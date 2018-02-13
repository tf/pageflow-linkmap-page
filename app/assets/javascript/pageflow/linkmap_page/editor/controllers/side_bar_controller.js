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

  selectAreaPosition: function(pageId, areaIndex) {
    var returnPath = areaIndex === undefined ?
      'pages/' + pageId + '/areas' :
      'linkmap_pages/' + pageId + '/areas/' + areaIndex;

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

    var areas = page.configuration.linkmapAreas();

    if (!areaIndex) {
      areas.once('add', function(area) {
        pageflow.editor.navigate(area.editPath(), {trigger: true});
      }, this);
    }

    pageflow.linkmapPage.currentAreaSelection.deferred
      .then(
        function() {
          if (areaIndex) {
            pageflow.editor.navigate(returnPath, {trigger: true});
          }
        },
        _.bind(function() {
          areas.off('add', null, this);
          pageflow.editor.navigate(returnPath, {trigger: true});
        }, this)
      );
  }
});