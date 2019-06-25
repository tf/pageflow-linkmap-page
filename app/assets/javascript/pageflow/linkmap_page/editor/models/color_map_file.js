pageflow.linkmapPage.ColorMapFile = pageflow.linkmapPage.GeneratedImageFile.extend({
  toJSON: function() {
    return _.pick(this.attributes,
                  'source_image_file_id');
  }
});
