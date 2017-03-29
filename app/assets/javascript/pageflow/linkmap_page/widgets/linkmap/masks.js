pageflow.linkmapPage.Masks = (function() {
  function Masks(masks) {
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
        mask.draw(context, 0, 0, width);
      });
    };

    this.each = function(callback, context) {
      _(masks).each(callback, context);
    };

    this.isEmpty = function() {
      return !masks.length;
    };
  }

  Masks.empty = new Masks([]);

  Masks.loadColorMap = function(url) {
    return pageflow.linkmapPage.ColorMap.load(url).then(function(colorMap) {
      return Masks.fromColorMap(colorMap);
    });
  };

  Masks.fromColorMap = function(colorMap) {
    var sprite = document.createElement('canvas');
    document.body.appendChild(sprite);
    sprite.className = 'sprite';

    sprite.width = colorMap.sumOfComponentWidths();
    sprite.height = colorMap.maxComponentHeight();

    var context = sprite.getContext('2d');
    var masks = [];
    var permaId = 0;

    _(colorMap.components).reduce(function(offset, component) {
      copyColor(colorMap.getImageData(component),
                component.color,
                context, offset);

      masks.push(new pageflow.linkmapPage.Mask({
        permaId: colorMap.id + ':' + permaId.toString(),

        sprite: sprite,
        spriteOffset: offset,

        originalWidth: colorMap.width,
        originalHeight: colorMap.height,

        boundingBox: component.boundingBox
      }));

      permaId += 1;

      return offset + component.boundingBox.width;
    }, 0);

    return new Masks(masks);
  };

  function copyColor(imageData, color, destinationContext, destinationX) {
    var data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
      if (data[i] != color[0] ||
          data[i + 1] != color[1] ||
          data[i + 2] != color[2]) {

        data[i + 3] = 0;
      }
    }

    destinationContext.putImageData(imageData, destinationX, 0);
  }

  return Masks;
}());