pageflow.linkmapPage.MaskedImageFile = pageflow.linkmapPage.GeneratedImageFile.extend({
  toJSON: function() {
    return _.pick(this.attributes,
                  'source_image_file_id',
                  'color_map_file_id');
  }
});
