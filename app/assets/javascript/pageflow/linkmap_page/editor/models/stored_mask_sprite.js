pageflow.linkmapPage.StoredMaskSprite = Backbone.Model.extend({
  modelName: 'mask_sprite',
  paramRoot: 'mask_sprite',

  url: function() {
    return '/linkmap_page/image_files/' + this.get('image_file_id') + '/mask_sprite';
  }
});

pageflow.linkmapPage.StoredMaskSprite.findOrCreateForImageFileId = function(imageFileId, imageFileUrl) {
  return new $.Deferred(function(deferred) {
    pageflow.linkmapPage.Masks.loadColorMapImage(imageFileUrl).then(function(masks) {
      try {
        var storedMaskSprite = new pageflow.linkmapPage.StoredMaskSprite({
          image_file_id: imageFileId,
          attachment: masks.getSpriteDataUrl()
        });

        storedMaskSprite.save(null, {
          success: function() {
            deferred.resolve(masks.serialize(storedMaskSprite.id));
          },

          error: function() {
            deferred.reject({
              message: 'Error saving mask sprite to the server.',
              i18nKey: 'pageflow.linkmap_page.errors.saving_mask_image_failed'
            });
          }
        });
      }
      catch (e) {
        deferred.reject(e);
      }
    }, deferred.reject);
  }).promise();
};
