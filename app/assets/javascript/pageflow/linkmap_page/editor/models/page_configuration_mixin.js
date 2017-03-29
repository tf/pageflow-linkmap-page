pageflow.linkmapPage.pageConfigurationMixin = {
  linkmapPageLinks: function() {
    this._linkmapPageLinks = this._linkmapPageLinks || new pageflow.linkmapPage.PageLinksCollection({
      areas: this.linkmapAreas()
    });

    return this._linkmapPageLinks;
  },

  linkmapAreas: function() {
    var configuration = this;

    this._linkmapAreas = this._linkmapAreas || create();
    return this._linkmapAreas;

    function create() {
      var collection = new pageflow.linkmapPage.AreasCollection(
        configuration.get('linkmap_areas'),
        {
          page: configuration.page
        }
      );

      configuration.listenTo(collection, 'add remove change', function() {
        configuration.set('linkmap_areas', collection.map(function(area) {
          return _.omit(area.attributes, 'highlighted', 'editing', 'selected');
        }));
      });

      return collection;
    }
  }
};