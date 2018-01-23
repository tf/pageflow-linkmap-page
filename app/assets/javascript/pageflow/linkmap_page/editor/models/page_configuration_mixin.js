(function() {
  pageflow.linkmapPage.pageConfigurationMixin = {
    initialize: function(options) {
      this.listenTo(this,
                    'change:linkmap_color_map_image_id',
                    function(model, imageFileId) {
                      if (imageFileId) {
                        this.setReference('linkmap_color_map_file_id',
                                          colorMapFiles().findOrCreateBy({
                                            source_image_file_id: imageFileId
                                          }));
                      }
                      else {
                        this.unsetReference('linkmap_color_map_file_id');
                      }
                    });

      this.listenTo(this,
                    'change:hover_image_id change:linkmap_color_map_file_id change:linkmap_color_map_file_id:ready',
                    function() {
                      var colorMapFile = colorMapFiles().get(this.get('linkmap_color_map_file_id'));
                      var hoverImageFile = pageflow.imageFiles.get(this.get('hover_image_id'));

                      if (hoverImageFile && colorMapFile && colorMapFile.isReady()) {
                        this.setReference('linkmap_masked_hover_image_id',
                                          maskedImageFiles().findOrCreateBy({
                                            source_image_file_id: hoverImageFile.id,
                                            color_map_file_id: colorMapFile.id
                                          }));
                      }
                      else {
                        this.unsetReference('linkmap_masked_hover_image_id');
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

  function maskedImageFiles() {
    return pageflow.entry.getFileCollection('pageflow_linkmap_page_masked_image_files');
  }

  function colorMapFiles() {
    return pageflow.entry.getFileCollection('pageflow_linkmap_page_color_map_files');
  }
}());
