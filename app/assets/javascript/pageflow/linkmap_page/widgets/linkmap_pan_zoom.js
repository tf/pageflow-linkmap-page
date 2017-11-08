(function($) {
  $.widget('pageflow.linkmapPanZoom', {
    _create: function() {
      this.pageElement = this.options.page;
      this.panoramaWrapper = this.options.panoramaWrapper;

      this.scroller = this.options.scroller;
      this.innerScrollerElement = this.options.innerScrollerElement;

      this.update(this.options);
    },

    update: function(options) {
      this.initialPosition = options.initialPosition;
      this.refresh();
    },

    refresh: function() {
      this.pageWidth = this.pageElement.width();
      this.pageHeight = this.pageElement.height();

      this.panorama = this.options.panorama();

      this.panoramaSize = pageflow.linkmapPage.getPanoramaSize({
        pageWidth: this.pageWidth,
        pageHeight: this.pageHeight,

        panoramaWidth: this.panorama.attr('data-width'),
        panoramaHeight: this.panorama.attr('data-height')
      });

      this._ensureScrollerCanNotScroll();
      this._resizePanorama();
      this._transformPanoramaWrapper();
    },

    goToAreaByIndex: function(index) {
      if (index >= 0) {
        this.currentArea = this.options.areas().eq(index);
      }
      else {
        this.currentArea = null;
      }

      this.refresh();
    },

    _ensureScrollerCanNotScroll: function() {
      this.innerScrollerElement.width(this.pageWidth);
      this.innerScrollerElement.height(this.pageHeight);

      this.scroller.refresh();
    },

    _resizePanorama: function() {
      this.panorama.width(this.panoramaSize.width);
      this.panorama.height(this.panoramaSize.height);
    },

    _transformPanoramaWrapper: function() {
      var options = this.currentArea ?
        this._getTransformForArea(this.currentArea) :
        this._getInitialTransform();

      this.currentScale = options.scale;
      transform(this.panoramaWrapper, options);
    },

    _getTransformForArea: function(area) {
      var areaWidth = area.width();
      var areaHeight = area.height();
      var areaPosition = area.position();

      var scale = Math.min(2,
                           this.pageWidth / areaWidth,
                           this.pageHeight / areaHeight);

      var scaledAreaWidth = areaWidth * scale;
      var scaledAreaHeight = areaHeight * scale;

      var scaledAreaLeft = areaPosition.left / this.currentScale * scale;
      var scaledAreaTop = areaPosition.top / this.currentScale * scale;

      return {
        scale: scale,

        translateX: Math.min(0, Math.round((this.pageWidth - scaledAreaWidth) / 2 - scaledAreaLeft)),
        translateY: Math.min(0, Math.round((this.pageHeight - scaledAreaHeight) / 2 - scaledAreaTop))
      };
    },

    _getInitialTransform: function() {
      return {
        scale: 1,
        translateX: Math.max(0, (this.pageWidth - this.panoramaSize.width) * this.initialPosition.x),
        translateY: Math.max(0, (this.pageHeight - this.panoramaSize.height) * this.initialPosition.y)
      };
    }
  });

  function transform(element, options) {
    element.css('transform',
                'translate3d(' + options.translateX + 'px, ' + options.translateY + 'px, 0) scale(' + options.scale +')');
  }
}(jQuery));
