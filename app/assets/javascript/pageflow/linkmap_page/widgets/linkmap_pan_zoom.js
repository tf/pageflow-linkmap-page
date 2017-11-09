(function($) {
  $.widget('pageflow.linkmapPanZoom', {
    _create: function() {
      this.pageElement = this.options.page;
      this.panoramaWrapper = this.options.panoramaWrapper;

      this.scroller = this.options.scroller;
      this.safeAreaWrapper = this.options.safeAreaWrapper;
      this.innerScrollerElement = this.options.innerScrollerElement;

      this.update(this.options);
    },

    update: function(options) {
      this.initialPosition = options.initialPosition;
      this.refresh();
    },

    refresh: function() {
      if (this.options.disabled) {
        return;
      }

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
      if (this.options.disabled) {
        return;
      }

      if (index >= 0) {
        this.currentArea = this.options.areas().eq(index);
      }
      else {
        this.currentArea = null;
      }

      this.refresh();
    },

    transitionBottomMargin: function(options) {
      var fromBottomMargin = this._bottomMarginFor(options.from);
      var toBottomMargin = this._bottomMarginFor(options.to);

      this._setBottomMargin(
        fromBottomMargin * (1 - options.progress) + toBottomMargin * options.progress
      );
    },

    setBottomMarginFor: function(options) {
      this._setBottomMargin(this._bottomMarginFor(options));
    },

    _setBottomMargin: function(height) {
      transform(this.safeAreaWrapper, {
        translateY: height
      });
    },

    _bottomMarginFor: function(options) {
      var area = options.areaIndex >= 0 && this.options.areas().eq(options.areaIndex);
      var dimensions = area && this._getScaledAreaDimensions(area);
      return dimensions && dimensions.bottom < options.hiddenHeight ? -options.hiddenHeight : 0;
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
      var d = this._getScaledAreaDimensions(area);

      return {
        scale: d.scale,

        translateX: Math.min(0,
                             Math.max(this.pageWidth - this.panoramaSize.width * d.scale,
                                      Math.round((this.pageWidth - d.width) / 2 - d.left))),
        translateY: Math.min(0,
                             Math.max(this.pageHeight - this.panoramaSize.height * d.scale,
                                      Math.round((this.pageHeight - d.height) / 2 - d.top)))
      };
    },

    _getScaledAreaDimensions: function(area) {
      var areaWidth = area.width();
      var areaHeight = area.height();
      var areaPosition = area.position();

      var scale = Math.min(2,
                           this.pageWidth / areaWidth,
                           this.pageHeight / areaHeight);

      var result = {
        scale: scale,

        width: areaWidth * scale,
        height: areaHeight * scale,

        left: areaPosition.left / this.currentScale * scale,
        top: areaPosition.top / this.currentScale * scale
      };

      result.bottom = this.panoramaSize.height * scale - result.top - result.height;

      return result;
    },

    _getInitialTransform: function() {
      return {
        scale: 1,
        translateX: Math.min(0, (this.pageWidth - this.panoramaSize.width) * this.initialPosition.x),
        translateY: Math.min(0, (this.pageHeight - this.panoramaSize.height) * this.initialPosition.y)
      };
    }
  });

  function transform(element, options) {
    element.css('transform',
                'translate3d(' + (options.translateX || 0) + 'px, ' + (options.translateY || 0) + 'px, 0) scale(' + (options.scale || 1) +')');
  }
}(jQuery));
