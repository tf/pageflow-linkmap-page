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

    var currentStreakKey, currentStreakLength;

    for (var y = 0; y < height; y++) {
      currentStreakKey = null;
      currentStreakLength = 0;

      for (var x = 0; x < width; x++) {
        i = (y * width + x) * 4;

        if (!blackOrTransparent(data, i)) {
          key = [data[i], data[i + 1], data[i + 2]].join('-');
          component = componentsByKey[key];

          if (currentStreakKey === key && sameColorAboveAndBelow(data, i, width)) {
            currentStreakLength += 1;
          }
          else {
            currentStreakKey = key;
            currentStreakLength = 1;
          }

          if (!component) {
            component = componentsByKey[key] = {
              color: [data[i], data[i + 1], data[i + 2]],
              left: x,
              top: y,
              right: x + 1,
              bottom: y + 1,
              longestStreak: currentStreakLength
            };

            components.push(component);
          }
          else {
            component.left = Math.min(component.left, x);
            component.top = Math.min(component.top, y);
            component.right = Math.max(component.right, x + 1);
            component.bottom = Math.max(component.bottom, y + 1);
            component.longestStreak = Math.max(component.longestStreak, currentStreakLength);
          }
        }
      }
    }

    components = _(components).select(function(component) {
      return component.longestStreak > 7;
    });

    if (components.length === 0) {
      throw noComponentsError();
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

  function blackOrTransparent(data, i) {
    return (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) ||
      data[i + 3] === 0;
  }
  function sameColorAboveAndBelow(data, i, width) {
    var above = i - width * 4;
    var below = i + width * 4;

    return above >= 0 &&
      below < data.length &&
      sameColor(data, i, above) &&
      sameColor(data, i, below);
  }

  function sameColor(data, i, j) {
    return data[i] === data[j] &&
      data[i + 1] === data[j + 1] &&
      data[i + 2] === data[j + 2] &&
      data[i + 3] === data[j + 3];
  }

  function noComponentsError() {
    var error = new Error('No big enough components detected.');
    error.i18nKey = 'pageflow.linkmap_page.errors.no_big_enough_color_map_components';

    return error;
  }

  return ColorMap;
}());