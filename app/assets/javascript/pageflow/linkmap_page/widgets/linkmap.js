(function($) {
  var markerMargin = 32;
  var smallSizeBreakpoint = 190;

  $.widget('pageflow.linkmap', {
    _create: function() {
      var widget = this;

      this.lastImageUrls = {};
      this.imagePromises = {};

      this.refresh();

      if (widget.options.hoverVideoEnabled) {
        widget.options.hoverVideo.activate();
      }

      this.element.on('mousemove', '.hover_area', function() {
        var hoverArea = $(this);

        if (widget.options.hoverVideoEnabled) {
          widget.options.hoverVideo.schedulePlay({
            area: hoverArea,
            baseImage: widget.options.baseImage()
          });
        }
      });

      this.element.on('mouseleave', '.hover_area', function() {
        if (widget.options.hoverVideoEnabled) {
          widget.options.hoverVideo.pause();
        }
      });

      this.element.on('click', function(event) {
        var area = widget.areaAt(widget.positionFromEvent(event));

        if (area.length) {
          area.first().trigger($.Event('linkmapareaclick', {originalEvent: event}));
        }
        else {
          widget._trigger('backgroundclick');
        }

        return false;
      });

      this.element.on('mousemove mouseleave', function(event) {
        widget.updateHoverStates(event);
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

        if (area.hasClass('hover') && !hovered) {
          area.trigger('linkmaparealeave');
        }
      });

      this.element.find('.hover_area').each(function() {
        var area = $(this);
        var hovered = area.linkmapAreaContains(position);

        if (!area.hasClass('hover') && hovered) {
          area.trigger('linkmapareaenter');
        }

        area.css('cursor',
                 hovered &&
                 area.attr('data-target-type') !== 'text_only' ?
                 'pointer' : 'default');

        area.toggleClass('hover', hovered);
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
      var hoverAreas = this.element.find('.hover_area');
      var widget = this;

      $.when(
        this.loadImage('hover'),
        this.loadImage('visited'),
        this.loadMasks()
      ).then(function(hoverImage, visitedImage, masks) {
        var baseImage = widget.options.baseImage();
        var width = baseImage.width();
        var height = baseImage.height();

        hoverAreas.linkmapAreaRedraw({
          target: '.hover_image',
          image: hoverImage,
          width: width,
          height: height,
          masks: masks
        });

        hoverAreas.linkmapAreaRedraw({
          target: '.visited_image',
          image: visitedImage,
          width: width,
          height: height,
          masks: masks
        });
      });

      hoverAreas.linkmapAreaClip();
      hoverAreas.linkmapAreaFormat();
      hoverAreas.linkmapAreaVisited();
    },

    loadImage: function(name) {
      var url = this.options[name + 'ImageUrl'];

      if (this.lastImageUrls[name] !== url) {
        this.lastImageUrls[name] = url;
        this.imagePromises[name] = url && pageflow.linkmapPage.RemoteImage.load(url);
      }

      return this.imagePromises[name];
    },

    loadMasks: function() {
      var widget = this;
      var maskImageId = this.options.masksData && this.options.masksData.id;

      if (this.lastMaskImageId !== maskImageId) {
        this.lastMaskImageId = maskImageId;

        this.masksPromise = this.options.masksData ?
          pageflow.linkmapPage.Masks.deserialize(this.options.masksData,
                                                 this.options.maskSpriteUrlTemplate) :
          $.when(pageflow.linkmapPage.Masks.empty);

        this.masksPromise.then(function(masks) {
          widget._trigger('updatemasks', null, {masks: masks});
        });
      }

      return this.masksPromise;
    }
  });

  $.fn.linkmapAreaClip = function(optionalPosition) {
    this.each(function() {
      var hoverArea = $(this);
      var clippedElement = hoverArea.find('.panorama_video, .hover_image, .visited_image');
      var position = optionalPosition || hoverArea.position();

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