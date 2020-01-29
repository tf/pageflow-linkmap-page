(function($) {
  var markerMargin = 32;
  var smallSizeBreakpoint = 190;

  $.widget('pageflow.linkmap', {
    _create: function() {
      this.colorMapPromise = $.when(pageflow.linkmapPage.ColorMap.empty);

      this.refresh();

      if (this.options.hoverVideoEnabled) {
        this.options.hoverVideo.activate();
      }

      this._on({
        'mousemove .hover_area': function(event) {
          var hoverArea = $(event.currentTarget);

          if (this.options.hoverVideoEnabled) {
            this.options.hoverVideo.schedulePlay({
              area: hoverArea,
              baseImage: this.options.baseImage()
            });
          }
        },

        'mouseleave .hover_area': function() {
          if (this.options.hoverVideoEnabled) {
            this.options.hoverVideo.pause();
          }
        },

        'click': function(event) {
          var area = this.areaAt(this.positionFromEvent(event));

          if (area.length && area.hasClass('hover_area')){
            this.options.hoverVideo.unmute();
          }

          if (area.length && area.hasClass('enabled')) {
            area.first().trigger($.Event('linkmapareaclick', {originalEvent: event}));
          }
          else {
            this._trigger('backgroundclick');
          }

          return false;
        },

        'mousemove': function(event) {
          this.updateHoverStates(event);
        },

        'mouseleave': function(event) {
          this.updateHoverStates(event);
        }
      });
    },

    areaAt: function(position) {
      return this.element.find('.hover_area').filter(function() {
        return $(this).linkmapAreaContains(position);
      }).first();
    },

    updateHoverStates: function(event) {
      var position = this.positionFromEvent(event);

      this.element.find('.hover_area').each(function() {
        var area = $(this);
        var hovered = area.linkmapAreaContains(position);

        if (area.hasClass('pointer_inside') && !hovered) {
          area.trigger('linkmaparealeave');
        }
      });

      this.element.find('.hover_area').each(function() {
        var area = $(this);
        var hovered = area.linkmapAreaContains(position);

        if (area.hasClass('enabled')) {
          if (!area.hasClass('pointer_inside') && hovered) {
            area.trigger('linkmapareaenter');
          }

          area.toggleClass('pointer_inside', hovered);
        }

        area.css('cursor',
                 hovered &&
                 area.attr('data-target-type') !== 'text_only' ?
                 'pointer' : 'default');
      });
    },

    positionFromEvent: function(event) {
      // Older versions of Firefox do not support event.offsetX, which
      // would be exactly what we need here.

      var clientRect = this.element[0].getBoundingClientRect();
      var scale = this.options.parentScale();

      var left = (event.clientX - clientRect.left) / scale;
      var top = (event.clientY - clientRect.top) / scale;

      return {
        leftInPixel: left,
        topInPixel: top,
        leftInPercent: left / this.element.width() * 100,
        topInPercent: top / this.element.height() * 100
      };
    },

    updateHoverVideoEnabled: function(value) {
      if (value) {
        this.options.hoverVideo.activate();
      }
      else {
        this.options.hoverVideo.deactivate();
      }

      this.options.hoverVideoEnabled = value;
    },

    refresh: function() {
      var areaBackgroundImages = this.element.find('.background_image, .linkmap_area_outlines-canvas_wrapper');
      var hoverAreas = this.element.find('.hover_area');

      this.resizeToBaseImage(areaBackgroundImages);

      this.loadColorMap().then(function(colorMap) {
        hoverAreas.linkmapAreaSetMask({
          colorMap: colorMap
        });
      });

      hoverAreas.linkmapAreaClip();
      hoverAreas.linkmapAreaFormat();
      hoverAreas.linkmapAreaVisited();
    },

    loadColorMap: function() {
      var widget = this;

      if (this.lastColorMapFileId !== this.options.colorMapFileId) {
        this.lastColorMapFileId = this.options.colorMapFileId;
        this.colorMapPromise = pageflow.linkmapPage.ColorMap.load(this.options.colorMapFileId);

        this.colorMapPromise.then(function(colorMap) {
          widget._trigger('updatecolormap', null, {colorMap: colorMap});
        });
      }

      return this.colorMapPromise;
    },

    resizeToBaseImage: function(target) {
      var baseImage = this.options.baseImage();

      target
        .width(baseImage.width())
        .height(baseImage.height());
    }
  });

  $.fn.linkmapAreaClip = function(optionalPosition) {
    this.each(function() {
      var hoverArea = $(this);
      var clippedElement = hoverArea.find('.panorama_video, .background_image, .linkmap_area_outlines-canvas_wrapper');
      var position = optionalPosition || {
        left: hoverArea.prop('offsetLeft'),
        top: hoverArea.prop('offsetTop')
      };

      clippedElement.css({
        left: -position.left + 'px',
        top: -position.top + 'px'
      });
    });
  };

  $.fn.linkmapAreaFormat = function() {
    this.each(function() {
      var hoverArea = $(this);
      var linkmapMarker = hoverArea.find('.linkmap_marker');

      hoverArea.toggleClass('portrait', hoverArea.width() <= hoverArea.height());
      hoverArea.toggleClass('landscape', hoverArea.width() > hoverArea.height());
      hoverArea.toggleClass('small', hoverArea.width() <= smallSizeBreakpoint ||
                            hoverArea.height() <= smallSizeBreakpoint);

      if (hoverArea.width() <= hoverArea.height()) {
        linkmapMarker.css({
          'width': hoverArea.width() - markerMargin,
          'height': hoverArea.width() - markerMargin,
        });
      }
      else {
        linkmapMarker.css({
          'width': hoverArea.height() - markerMargin,
          'height': hoverArea.height() - markerMargin,
        });
      }
    });
  };

  $.fn.linkmapAreaVisited = function() {
    this.each(function() {
      var hoverArea = $(this);
      var visited =
        hoverArea.data('targetType') === 'page' &&
        pageflow.linkmapPage.visitedPages.indexOf(hoverArea.data('targetId')) >= 0;

      hoverArea.toggleClass('visited', visited);
    });
  };
}(jQuery));