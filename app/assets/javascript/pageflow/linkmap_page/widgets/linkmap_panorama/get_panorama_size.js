pageflow.linkmapPage.getPanoramaSize = (function() {
  var MIN_SCALING_SIZE = 30;
  var ENVIRONMENT_MARGIN = 1.2;

  return function getPanoramaSize(options) {
    var result = {
      scaled: false
    };

    var environmentMargin = options.addEnvironment ? ENVIRONMENT_MARGIN : 1;

    var windowRatio = options.pageWidth / options.pageHeight;
    var imageRatio;

    if (options.panoramaHeight > 0) {
      imageRatio = options.panoramaWidth / options.panoramaHeight;
    }
    else {
      imageRatio = 1;
    }

    if (imageRatio > windowRatio) {
      result.height = options.pageHeight * environmentMargin;
      result.width = result.height * imageRatio;
      result.orientation = 'h';
    }
    else {
      result.width = options.pageWidth * environmentMargin;
      result.height = result.width / imageRatio;
      result.orientation = 'v';
    }

    if (options.minScaling) {
      var minScale = getMinScale(options);

      if (result.width < options.panoramaWidth * minScale) {
        result.width = options.panoramaWidth * minScale;
        result.height = options.panoramaHeight * minScale;
        result.scaled = true;
      }
    }

    return result;
  };

  function getMinScale(options) {
    var that = this;

    var smallestSize = Math.min(options.panoramaWidth, options.panoramaHeight);

    _(options.areaDimensions).each(function(dimensions) {
      var width = dimensions.width / 100 * options.panoramaWidth;
      var height = dimensions.height / 100 * options.panoramaHeight;

      smallestSize = Math.min(smallestSize, Math.min(width, height));
    });

    return Math.min(1.5, MIN_SCALING_SIZE / Math.max(1, smallestSize));
  }
}());
