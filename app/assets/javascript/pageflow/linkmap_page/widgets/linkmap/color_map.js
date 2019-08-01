pageflow.linkmapPage.ColorMap = (function() {
  function ColorMapComponent(attributes, options) {
    var colorMapWidth = options.colorMapWidth;
    var colorMapHeight = options.colorMapHeight;
    var colorMapSprite = options.colorMapSprite;

    this.color = attributes.color;
    this.permaId = options.colorMapId + ':' + attributes.color;

    this.draw = function(context, width) {
      var scale = width / attributes.width;

      colorMapSprite.draw(context,
                          attributes.sprite_offset,
                          0,
                          attributes.width,
                          attributes.height,
                          0,
                          0,
                          attributes.width * scale,
                          attributes.height * scale);
    };

    this.areaAttributes = function() {
      return {
        color_map_component_id: this.permaId,
        top: attributes.top / colorMapHeight * 100.0,
        left: attributes.left / colorMapWidth * 100.0,
        height: attributes.height / colorMapHeight * 100.0,
        width: attributes.width / colorMapWidth * 100.0
      };
    };

    this.contains = function(xInPercent, yInPercent) {
      var x = xInPercent * colorMapWidth / 100;
      var y = yInPercent * colorMapHeight / 100;

      return inBoundingBox(x, y) &&
        colorMapSprite.nonTransparentAt(
          x - attributes.left + attributes.sprite_offset,
          y - attributes.top
        );
    };

    function inBoundingBox(x, y) {
      return x > attributes.left &&
        x < attributes.left + attributes.width &&
        y >= attributes.top &&
        y < attributes.top + attributes.height;
    }
  }

  function ColorMap(attributes, sprite) {
    var components = _(attributes.components).map(function(componentAttributes) {
      return new ColorMapComponent(componentAttributes, {
        colorMapId: attributes.id,
        colorMapWidth: attributes.width,
        colorMapHeight: attributes.height,
        colorMapSprite: sprite
      });
    }, this);

    this.components = function() {
      return components;
    };

    this.componentFromPoint = function(xInPercent, yInPercent) {
      return _(components).find(function(component) {
        return component.contains(xInPercent, yInPercent);
      });
    };

    this.componentByPermaId = function(permaId) {
      return _(components).find(function(component) {
        return component.permaId == permaId;
      });
    };

    this.previewUrl = function() {
      return attributes.url;
    };
  }

  ColorMap.empty = new ColorMap({
    components: [],
    width: 0,
    height: 0
  });

  ColorMap.load = function(permaId) {
    var colorMapFile = pageflow.entryData.getFile('pageflow_linkmap_page_color_map_files', permaId);

    if (!colorMapFile) {
      return $.when(ColorMap.empty);
    }

    return pageflow.linkmapPage.ImageData.load(colorMapFile.sprite_url).then(function(sprite) {
      return new ColorMap(colorMapFile, sprite);
    });
  };

  return ColorMap;
}());