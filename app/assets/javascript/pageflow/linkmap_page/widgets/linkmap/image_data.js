pageflow.linkmapPage.ImageData = (function() {
  function ImageData(width, height, image) {
    var canvas = document.createElement('canvas');

    this.width = width;
    this.height = height;

    canvas.width = width;
    canvas.height = height;

    image.draw(canvas.getContext('2d'), {
      width: width,
      disableImageSmoothing: true
    });

    this.draw = function(context, sx, sy, sw, sh, dx, dy, dw, dh) {
      context.drawImage(canvas, sx, sy, sw, sh, dx, dy, dw, dh);
    };

    this.nonTransparentAt = function(x, y) {
      var context = canvas.getContext('2d');
      var pixel = context.getImageData(x, y, 1, 1).data;

      return pixel[3] > 0;
    };
  }

  ImageData.empty = {
    hasColorAt: function() {
      return false;
    },

    colorAt: function() {
      return null;
    }
  };

  ImageData.load = function(url) {
    return pageflow.linkmapPage.RemoteImage.load(url).then(function(image) {
      return new ImageData(image.width(), image.height(), image);
    });
  };

  return ImageData;
}());
