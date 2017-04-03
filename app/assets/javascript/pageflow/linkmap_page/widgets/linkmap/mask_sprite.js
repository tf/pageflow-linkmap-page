pageflow.linkmapPage.MaskSprite = (function() {
  function MaskSprite(id, imageData) {
    this.id = id;

    this.nonTransparentAt = function(x, y) {
      var pixel = imageData.get(x, y, 1, 1).data;
      return pixel[3] > 0;
    };

    this.draw = function(context, spriteOffset, boundingBox, scale) {
      imageData.draw(context,
                     spriteOffset,
                     0,
                     boundingBox.width,
                     boundingBox.height,
                     boundingBox.left * scale,
                     boundingBox.top * scale,
                     boundingBox.width * scale,
                     boundingBox.height * scale);

    };

    this.toDataURL = function() {
      return imageData.toDataURL();
    };
  }

  MaskSprite.load = function(maskSpriteUrlTemplate, id) {
    return pageflow.linkmapPage.ImageData.load(getUrl(maskSpriteUrlTemplate, id)).then(function(imageData) {
      return new MaskSprite(id, imageData);
    });
  };

  MaskSprite.fromColorMapImageData = function(colorMapImageData, colorMap) {
    var imageData = new pageflow.linkmapPage.ImageData(colorMap.sumOfComponentWidths(),
                                                       colorMap.maxComponentHeight());

    _(colorMap.components).reduce(function(offset, component) {
      imageData.copyColorFrom(colorMapImageData.getBoundingBox(component.boundingBox),
                              component.color,
                              offset, 0);

      return offset + component.boundingBox.width;
    }, 0);

    return new MaskSprite('a', imageData);
  };

  function getUrl(template, id) {
    return template.replace(':id_partition', idPartition(id));
  }

  function idPartition(id) {
    return partition(pad(id, 9), '/');
  }

  function partition(string, separator) {
    return string.replace(/./g, function(c, i, a) {
      return i && ((a.length - i) % 3 === 0) ? '/' + c : c;
    });
  }

  function pad(string, size) {
    return (_.times(size, function() { return '0'; }).join('') + string).slice(-size);
  }

  return MaskSprite;
}());