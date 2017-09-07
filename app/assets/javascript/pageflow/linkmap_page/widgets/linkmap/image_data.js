pageflow.linkmapPage.ImageData = (function() {
  function ImageData(width, height) {
    var canvas = document.createElement('canvas');

    this.width = width;
    this.height = height;

    canvas.width = width;
    canvas.height = height;

    this.loadImage = function(image) {
      image.draw(canvas, {disableImageSmoothing: true});
    };

    this.draw = function(context, sx, sy, sw, sh, dx, dy, dw, dh) {
      context.drawImage(canvas, sx, sy, sw, sh, dx, dy, dw, dh);
    };

    this.copyColorFrom = function(imageData, color, destinationX, destinationY) {
      var data = imageData.data;
      var destinationContext = canvas.getContext('2d');

      for (var i = 0; i < data.length; i += 4) {
        if (data[i] != color[0] ||
            data[i + 1] != color[1] ||
            data[i + 2] != color[2]) {

          data[i + 3] = 0;
        }
        else {
          data[i + 3] = 255;
        }
      }

      destinationContext.putImageData(imageData, destinationX, destinationY);
    };

    this.getBoundingBox = function(box) {
      return this.get(box.left, box.top, box.width, box.height);
    };

    this.get = function(left, top, width, height) {
      var context = canvas.getContext('2d');
      return context.getImageData(left, top, width, height);
    };

    this.toDataURL = function() {
      var result = canvas.toDataURL();

      if (!result.match(/^data:image/)) {
        throw new invalidImageDataUrl();
      }

      return result;
    };
  }

  function invalidImageDataUrl() {
    var error = new Error('Invalid data url from canvas.');
    error.i18nKey = 'pageflow.linkmap_page.errors.invalid_image_data';

    return error;
  }

  ImageData.load = function(url) {
    return pageflow.linkmapPage.RemoteImage.load(url).then(function(image) {
      var imageData = new ImageData(image.width(), image.height());
      imageData.loadImage(image);

      return imageData;
    });
  };

  return ImageData;
}());
