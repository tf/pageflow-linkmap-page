pageflow.linkmapPage.RemoteImage = (function() {
  function RemoteImage(url, image) {
    this.width = function() {
      return image.width;
    };

    this.height = function() {
      return image.height;
    };

    this.draw = function(canvas, options) {
      options = options || {};
      var context = canvas.getContext('2d');

      if (options.disableImageSmoothing) {
        context.imageSmoothingEnabled = false;
      }

      context.drawImage(image,
                        0,
                        0,
                        canvas.width,
                        canvas.height);
    };
  }

  RemoteImage.load = function(url) {
    return new $.Deferred(function(deferred) {
      var image = new Image();

      image.onload = onLoad;
      image.onerror = onError;
      image.crossOrigin = 'Anonymous';
      image.src = url;

      function onLoad() {
        deferred.resolve(new pageflow.linkmapPage.RemoteImage(url, image));
      }

      function onError() {
        deferred.reject(loadError(url));
      }
    }).promise();
  };

  return RemoteImage;

  function loadError(url) {
    var error = new Error('Error while loading ' + url + '.');
    error.i18nKey = 'pageflow.linkmap_page.errors.loading_remote_image_failed';

    return error;
  }
}());