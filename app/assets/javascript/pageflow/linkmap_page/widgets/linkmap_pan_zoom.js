(function($) {
  $.widget('pageflow.linkmapPanZoom', {
    _create: function() {
      this.pageElement = this.options.page;
      this.panoramaWrapper = this.options.panoramaWrapper;

      this.scroller = this.options.scroller;
      this.scrollerElement = this.options.scrollerElement;
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

    applyMarginBottomForAreaByIndex: function(sourceIndex, destinationIndex, sourceHeight, destinationHeight, progress) {
      var sourceArea = sourceIndex >= 0 && this.options.areas().eq(sourceIndex);
      var destinationArea = destinationIndex >= 0 && this.options.areas().eq(destinationIndex);

      var sourceDimensions = sourceArea && this._getScaledAreaDimensions(sourceArea);
      var destinationDimensions = destinationArea && this._getScaledAreaDimensions(destinationArea);

      var sourceTranslateY = sourceDimensions && sourceDimensions.bottom < sourceHeight ? -sourceHeight : 0;
      var destinationTranslateY = destinationDimensions && destinationDimensions.bottom < destinationHeight ? -destinationHeight : 0;

      transform(this.scrollerElement, {
        translateY: sourceTranslateY * (1 - progress) + destinationTranslateY * progress
      });
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
