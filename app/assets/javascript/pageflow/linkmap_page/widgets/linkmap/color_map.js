pageflow.linkmapPage.ColorMap = (function() {
  function ColorMap(width, height, components) {
    this.width = width;
    this.height = height;
    this.components = components;

    this.sumOfComponentWidths = function() {
      return _(components).reduce(function(result, component) {
        return result + component.boundingBox.width;
      }, 0);
    };

    this.maxComponentHeight = function() {
      return _(components).reduce(function(result, rect) {
        return Math.max(result, rect.boundingBox.height);
      }, 0);
    };

    this.serialize = function() {
      return {
        w: this.width,
        h: this.height,
        c: _(components).map(function(component) {
          return {
            c: component.color,
            l: component.boundingBox.left,
            t: component.boundingBox.top,
            w: component.boundingBox.width,
            h: component.boundingBox.height
          };
        })
      };
    };
  }

  ColorMap.deserialize = function(data) {
    return new ColorMap(
      data.w,
      data.h,
      _(data.c).map(function(item) {
        return {
          color: item.c,
          boundingBox: {
            left: item.l,
            top: item.t,
            width: item.w,
            height: item.h,
            right: item.l + item.w,
            bottom: item.t + item.h
          }
        };
      })
    );
  };

  ColorMap.fromImageData = function(imageData) {
    var width = imageData.width;
    var height = imageData.height;

    var data = imageData.get(0, 0, width, height).data;
    var i, key, component;

    var componentsByKey = {};
    var components = [];

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        i = (y * width + x) * 4;

        if (data[i + 3] > 0) {
          key = [data[i], data[i + 1], data[i + 2]].join('-');
          component = componentsByKey[key];

          if (!component) {
            component = componentsByKey[key] = {
              color: [data[i], data[i + 1], data[i + 2]],
              left: x,
              top: y,
              right: x,
              bottom: y
            };

            components.push(component);
          }
          else {
            component.left = Math.min(component.left, x);
            component.top = Math.min(component.top, y);
            component.right = Math.max(component.right, x);
            component.bottom = Math.max(component.bottom, y);
          }
        }
      }
    }

    return new ColorMap(width, height, _(components).map(function(component) {
      return {
        color: component.color,
        boundingBox: {
          left: component.left,
          top: component.top,
          right: component.right,
          bottom: component.bottom,
          width: component.right - component.left,
          height: component.bottom - component.top
        }
      };
    }));
  };

  return ColorMap;
}());