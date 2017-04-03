pageflow.linkmapPage.Masks = (function() {
  var SPRITE_IMAGE_ID = 'id';
  var COLOR_MAP = 'c';

  function Masks(masks, sprite, colorMap) {
    this.findByPermaId = function(permaId) {
      return _(masks).detect(function(mask) {
        return mask.permaId === permaId;
      });
    };

    this.atPoint = function(fractionX, fractionY) {
      return _(masks).detect(function(mask) {
        return mask.contains(fractionX, fractionY);
      });
    };

    this.draw = function(context, width) {
      _(masks).each(function(mask) {
        mask.draw(context, width);
      });
    };

    this.each = function(callback, context) {
      _(masks).each(callback, context);
    };

    this.isEmpty = function() {
      return !masks.length;
    };

    this.serialize = function(spriteId) {
      var data = {};

      data[SPRITE_IMAGE_ID] = spriteId;
      data[COLOR_MAP] = colorMap.serialize();

      return data;
    };

    this.getSpriteDataUrl = function() {
      return sprite.toDataURL();
    };
  }

  Masks.empty = new Masks([]);

  Masks.loadColorMapImage = function(url) {
    return pageflow.linkmapPage.ImageData.load(url).then(function(colorMapImageData) {
      var colorMap = pageflow.linkmapPage.ColorMap.fromImageData(colorMapImageData);

      return fromMaskSpriteAndColorMap(
        pageflow.linkmapPage.MaskSprite.fromColorMapImageData(colorMapImageData, colorMap),
        colorMap
      );
    });
  };

  Masks.deserialize = function(data, maskSpriteUrlTemplate) {
    return pageflow.linkmapPage.MaskSprite.load(maskSpriteUrlTemplate, data[SPRITE_IMAGE_ID]).then(function(sprite) {
      return fromMaskSpriteAndColorMap(
        sprite,
        pageflow.linkmapPage.ColorMap.deserialize(data[COLOR_MAP])
      );
    });
  };

  function fromMaskSpriteAndColorMap(sprite, colorMap) {
    var masks = [];
    var permaId = 0;

    _(colorMap.components).reduce(function(offset, component) {
      masks.push(new pageflow.linkmapPage.Mask({
        permaId: sprite.id + ':' + permaId.toString(),

        sprite: sprite,
        spriteOffset: offset,

        originalWidth: colorMap.width,
        originalHeight: colorMap.height,

        boundingBox: component.boundingBox
      }));

      permaId += 1;

      return offset + component.boundingBox.width;
    }, 0);

    return new Masks(masks, sprite, colorMap);
  }

  return Masks;
}());