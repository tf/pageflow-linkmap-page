pageflow.linkmapPage.ColorMap = (function() {
  function ColorMap(id, canvas, components) {
    this.id = id;
    this.components = components;

    this.width = canvas.width;
    this.height = canvas.height;

    this.getImageData = function(component) {
      var context = canvas.getContext('2d');
      return context.getImageData(component.boundingBox.left,
                                  component.boundingBox.top,
                                  component.boundingBox.width,
                                  component.boundingBox.height);
    };

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
  }

  ColorMap.load = function(url) {
    return pageflow.linkmapPage.RemoteImage.load(url).then(function(image) {
        return ColorMap.fromImage(image);
    });
  };

  ColorMap.fromImage = function(image) {
    var canvas = document.createElement('canvas');
    canvas.className = 'colormap';
    document.body.appendChild(canvas);

    var context = canvas.getContext('2d');

    var width = image.width();
    var height = image.height();

    canvas.width = width;
    canvas.height = height;

    image.draw(canvas);

    var data = context.getImageData(0, 0, width, height).data;
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

    return new ColorMap(image.id(), canvas, _(components).map(function(component) {
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