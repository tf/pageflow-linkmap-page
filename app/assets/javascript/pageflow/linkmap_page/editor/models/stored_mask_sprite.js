pageflow.linkmapPage.StoredMaskSprite = Backbone.Model.extend({
  modelName: 'mask_sprite',
  paramRoot: 'mask_sprite',

  url: function() {
    return '/linkmap_page/image_files/' + this.get('image_file_id') + '/mask_sprite';
  }
});

pageflow.linkmapPage.StoredMaskSprite.findOrCreateForImageFileId = function(imageFileId, imageFileUrl) {
  return new $.Deferred(function(deferred) {
    console.log('start');
    pageflow.linkmapPage.Masks.loadColorMapImage(imageFileUrl).then(function(masks) {
    console.log('generated');
      var storedMaskSprite = new pageflow.linkmapPage.StoredMaskSprite({
        image_file_id: imageFileId,
        attachment: masks.getSpriteDataUrl()
      });

      storedMaskSprite.save(null, {
        success: function() {
          console.log('stored');
          deferred.resolve(masks.serialize(storedMaskSprite.id));
        }
      });
    });
  }).promise();
};
