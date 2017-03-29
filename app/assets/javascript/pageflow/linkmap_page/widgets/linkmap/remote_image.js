pageflow.linkmapPage.RemoteImage = function(url, image) {
  this.id = function() {
    return url.match(/\/(\d{3}\/)+/g).join().replace(/\//g, '').replace(/^0+/g, '');
  };

  this.width = function() {
    return image.width;
  };

  this.height = function() {
    return image.height;
  };

  this.draw = function(canvas) {
    var context = canvas.getContext('2d');

    context.drawImage(image,
                      0,
                      0,
                      canvas.width,
                      canvas.height);
  };
};

pageflow.linkmapPage.RemoteImage.load = function(url) {
  return new $.Deferred(function(deferred) {
    var image = new Image();

    image.onload = onLoad;
    image.crossOrigin = 'Anonymous';
    image.src = url;

    function onLoad() {
      deferred.resolve(new pageflow.linkmapPage.RemoteImage(url, image));
    }
  }).promise();
};