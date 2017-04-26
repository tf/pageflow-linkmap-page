(function() {
  pageflow.linkmapPage.pageConfigurationMixin = {
    initialize: function() {
      this.listenTo(this, 'change:linkmap_color_map_image_id', function(model, imageFileId) {
        if (imageFileId) {
          var imageFile = this.getImageFile('linkmap_color_map_image_id');
          generateMaskSpriteWhenReady(this, imageFile);
        }
        else {
          resetMaskSprite(this);
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
    },

    getLinkmapAreaMask: function(masks, permaId) {
      if (this.get('background_type') !== 'hover_video') {
        return masks.findByPermaId(permaId);
      }
    }
  };

  function generateMaskSpriteWhenReady(configuration, imageFile) {
    if (imageFile.isReady()) {
      generateMaskSprite(configuration, imageFile);
    }
    else {
      imageFile.once('change:state', function() {
        generateMaskSpriteWhenReady(configuration, imageFile);
      });
    }
  }

  function generateMaskSprite(configuration, imageFile) {
    pageflow.linkmapPage.StoredMaskSprite
      .findOrCreateForImageFileId(imageFile.id,
                                  imageFile.get('panorama_mask_url'))
      .then(
        function(masks) {
          configuration.set('linkmap_masks', masks);
        },
        function(error) {
          configuration.unset('linkmap_masks');
          configuration.unset('linkmap_color_map_image_id');

          if (error.i18nKey) {
            alert(I18n.t(error.i18nKey));
          }
          else {
            alert(I18n.t('pageflow.linkmap_page.errors.mask_image_failed'));
            throw(error);
          }
        }
      );
  }

  function resetMaskSprite(configuration) {
    configuration.unset('linkmap_masks');
  }
}());