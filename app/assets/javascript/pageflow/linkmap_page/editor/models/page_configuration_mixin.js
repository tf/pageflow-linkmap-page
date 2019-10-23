(function() {
  pageflow.linkmapPage.pageConfigurationMixin = {
    initialize: function(options) {
      this.listenTo(this,
                    'change:linkmap_color_map_image_id',
                    function(model, imageFilePermaId) {
                      if (imageFilePermaId) {
                        var sourceImageFile = pageflow.imageFiles.getByPermaId(imageFilePermaId);

                        this.setReference('linkmap_color_map_file_id',
                                          colorMapFiles().findOrCreateBy({
                                            source_image_file_id: sourceImageFile.id
                                          }));
                      }
                      else {
                        this.unsetReference('linkmap_color_map_file_id');
                      }
                    });

      _(['hover_image_id', 'visited_image_id']).each(_.bind(function(attribute) {
        this.listenTo(
          this,
          'change:' + attribute +
            ' change:linkmap_color_map_file_id',
          function() {
            var colorMapFile = this.getReference('linkmap_color_map_file_id', colorMapFiles());
            var imageFile = this.getReference(attribute, pageflow.imageFiles);

            if (imageFile && colorMapFile && !colorMapFile.isNew()) {
              this.setReference('linkmap_masked_' + attribute,
                                maskedImageFiles().findOrCreateBy({
                                  source_image_file_id: imageFile.id,
                                  color_map_file_id: colorMapFile.id
                                }));
            }
            else {
              this.unsetReference('linkmap_masked_' + attribute);
            }
          });
      }, this));
    },

    linkmapReadyColorMapFileId: function() {
      var colorMapFile = this.getReference('linkmap_color_map_file_id', colorMapFiles());
      return colorMapFile && colorMapFile.isReady() ? colorMapFile.get('perma_id') : null;
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

        configuration.listenTo(collection, 'add remove change sort', function() {
          configuration.set('linkmap_areas', collection.map(function(area) {
            return _.omit(area.attributes, 'highlighted', 'editing', 'selected', 'position');
          }));
        });

        return collection;
      }
    }
  };

  function maskedImageFiles() {
    return pageflow.entry.getFileCollection('pageflow_linkmap_page_masked_image_files');
  }

  function colorMapFiles() {
    return pageflow.entry.getFileCollection('pageflow_linkmap_page_color_map_files');
  }
}());
