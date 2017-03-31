pageflow.linkmapPage.MaskSpritesCollection = Backbone.Collection.extend({
  model: pageflow.linkmapPage.MaskSprite,

  name: 'scraped_sites',

  getOrFetch: function(id, options) {
    options = options || {};
    var model = this.get(id);

    if (model) {
      if (options.success) {
        options.success(model);
      }
    }
    else {
      model = new pageflow.chart.ScrapedSite({id: id});
      this.add(model);
      model.fetch(options);
    }

    return model;
  }
});
