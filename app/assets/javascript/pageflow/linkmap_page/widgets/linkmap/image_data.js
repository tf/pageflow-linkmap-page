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
      return canvas.toDataURL();
    };
  }

  ImageData.load = function(url) {
    var s = new Date();
    return pageflow.linkmapPage.RemoteImage.load(url).then(function(image) {
      window.sss_remote_load = new Date() - s;
      var imageData = new ImageData(image.width(), image.height());
      imageData.loadImage(image);

      return imageData;
    });
  };

  return ImageData;
}());
