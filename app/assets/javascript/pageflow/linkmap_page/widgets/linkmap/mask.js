pageflow.linkmapPage.Mask = function Mask(options) {
  var sprite = options.sprite;
  var spriteOffset = options.spriteOffset;
  var boundingBox = options.boundingBox;

  this.permaId = options.permaId;

  this.areaAttributes = function() {
    return {
      mask_perma_id: options.permaId,
      top: boundingBox.top / options.originalHeight * 100,
      left: boundingBox.left / options.originalWidth * 100,
      height: boundingBox.height / options.originalHeight * 100,
      width: boundingBox.width / options.originalWidth * 100
    };
  };

  this.contains = function(fractionX, fractionY) {
    var x = fractionX * options.originalWidth;
    var y = fractionY * options.originalHeight;

    var spriteX = x - boundingBox.left;
    var spriteY = y - boundingBox.top;

    if (spriteX < 0 || spriteX >= boundingBox.width ||
        spriteY < 0 || spriteY >= boundingBox.height) {
      return false;
    }

    return sprite.nonTransparentAt(spriteOffset + spriteX, spriteY);
  };

  this.draw = function(context, currentWidth) {
    var scale = currentWidth / options.originalWidth;
    sprite.draw(context, spriteOffset, boundingBox, scale);
  };
};
