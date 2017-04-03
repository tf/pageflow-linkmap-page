pageflow.linkmapPage.pageConfigurationMixin = {
  initialize: function() {
    this.listenTo(this, 'change:linkmap_color_map_image_id', function(model, imageFileId) {
      if (imageFileId) {
        pageflow.linkmapPage.StoredMaskSprite
          .findOrCreateForImageFileId(imageFileId,
                                      this.getImageFileUrl('linkmap_color_map_image_id', {
                                        styleGroup: 'panorama'
                                      }))
          .then(function(masks) {
            model.set('linkmap_masks', masks);
          });
      }
      else {
        model.unset('linkmap_masks');
      }
    });
  },

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