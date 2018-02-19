(function($) {
  $.widget('pageflow.linkmapPanorama', {
    scrollHoverMargin : 0.2,
    environmentMargin : 0.2,
    lastMouseMoveEvent: null,

    _create: function() {
      var that = this,
          pageElement = this.options.page;

      this.addEnvironment = this.options.addEnvironment;
      this.panorama = this.options.panorama();
      this.limitScrolling = this.options.limitScrolling;
      this.minScaling = this.options.minScaling;
      this.scroller = this.options.scroller;

      this.activeAreas = pageElement.find(this.options.activeAreasSelector);
      this.panoramaWrapper = pageElement.find('.panorama_wrapper');
      this.innerScrollerElement = pageElement.find('.linkmap');
      this.overlayBox = pageElement.find('.description_overlay');
      this.overlayInnerBox = pageElement.find('.description_overlay_wrapper');
      this.overlayTitle = pageElement.find('.description_overlay .link_title');
      this.overlayDescription = pageElement.find('.description_overlay .link_description');

      this.touchIndicator = pageElement.find('.touch_indicator');
      this.externalLinkLoadingIndicator = pageElement.find('.external_link_loading_indicator');
      this.globalIndicators = this.touchIndicator.add(this.externalLinkLoadingIndicator);

      this.startScrollPosition = _.clone(this.options.startScrollPosition);

      this.currentScrollPosition = null;

      this.refresh();

      this.scroller.onScrollEnd(function() {
        if (!that.options.disabled) {
          that.updateScrollPosition();
        }
      });

      this._on(window, {
        resize: function () {
          that.centerToPoint(null, 0);
        }
      });

      this._on({
        mousemove: function(e) {
          that.lastMouseMoveEvent = e;
          that.calcAreaOpacity(that.activeAreas, e.pageX, e.pageY);
        }
      });

      this._on(pageElement, {
        'linkmapareaenter .hover_area': function(event) {
          var area = $(event.currentTarget);
          area.addClass('hover');

          positionOverlay(area);
        },

        'linkmaparealeave .hover_area': function(event) {
          var area = $(event.currentTarget);
          area.removeClass('hover');
        },

        'click': resetIndicatorsAndOverlays,
        'linkmapbackgroundclick': resetIndicatorsAndOverlays
      });

      this._on($('body'), {
        'linkmaparealeave .hover_area': resetOverlays
      });

      this._on(pageElement, {
        'dragstart .hover_area': resetOverlays,
        'resizestart .hover_area': resetOverlays
      });

      function resetIndicatorsAndOverlays() {
        resetOverlays();
        that.activeAreas.removeClass('hover hover_mobile');
        that.globalIndicators.hide();
      }

      function resetOverlays() {
        that.overlayBox.removeClass('active');
      }

      that.activeAreas.each(function() {
        var area = $(this);

        that._on(area, {linkmapareaclick: onAreaClick});

        function onAreaClick(event) {
          if (pageflow.browser.has('mobile platform')) {
            if (area.hasClass('hover_mobile')) {
              that.activeAreas.removeClass('active');
              area.addClass('active');
            }
            else {
              that.activeAreas.removeClass('hover hover_mobile');
              area.addClass('hover hover_mobile');

              positionOverlay($(event.currentTarget));

              if (!area.hasClass('dynamic_marker')) {
                displayTouchIndicator(event.originalEvent);
              }

              return false;
            }
          }
          else {
            that.activeAreas.removeClass('active');
            area.addClass('active');
          }

          if (!area.hasClass('dynamic_marker') &&
              area.hasClass('external_site_area') &&
              area.hasClass('target_self')) {
            displayExternalLinkLoadingIndicator(event.originalEvent);
          }
        }
      });

      var positionOverlay = function(area) {
        if (area.is('.editing')) {
          return;
        }

        var linkTitle = area.find('.link_title').html();
        var linkDescription = area.find('.link_description').html();

        if (linkTitle || linkDescription) {
          that.overlayTitle.html(linkTitle);
          that.overlayDescription.html(linkDescription);

          that.overlayBox.addClass('active');

          if(that.panorama.width() - (area.position().left + area.outerWidth()) < that.overlayBox.outerWidth()) {
            var overlayAlignmentDirection = "left";
            that.overlayBox.addClass('left_aligned');
          }
          else {
            var spaceLeftOfArea = area.offset().left;
            var spaceRightOfArea = $(pageElement).width() - area.offset().left - area.outerWidth();

            if(spaceLeftOfArea < spaceRightOfArea || spaceLeftOfArea < that.overlayBox.outerWidth()) {
              var overlayAlignmentDirection = "right";
              that.overlayBox.removeClass('left_aligned');
            }
            else {
              var overlayAlignmentDirection = "left";
              that.overlayBox.addClass('left_aligned');
            }
          }

          if(overlayAlignmentDirection == "right") {
            that.overlayBox.removeClass('left_aligned');
            that.overlayBox.css({
              'left': area.position().left + area.width(),
              'top': area.position().top,
              'margin-top': area.height() / 2
            });
          }
          if(overlayAlignmentDirection == "left") {
            that.overlayBox.addClass('left_aligned');
            that.overlayBox.css({
              'left': area.position().left - that.overlayBox.outerWidth(),
              'top': area.position().top,
              'margin-top': area.height() / 2
            });
          }

          var spaceToBottom = that.panorama.height() - area.position().top;
          var spaceToViewportBottom = $(pageElement).height() - area.offset().top - area.height() / 2;
          var spaceToViewportTop = $(pageElement).height() - 50;
          var minMargin = 40;

          if(that.overlayBox.outerHeight() > spaceToBottom) {
            that.overlayInnerBox.css('top', (spaceToBottom - that.overlayInnerBox.outerHeight() - minMargin - area.height() / 2) + 'px');
          }
          else {
            that.overlayInnerBox.css('top', '0px');
          }
          var additionalMargin = 10;

          if(spaceToViewportBottom < that.overlayBox.outerHeight() && that.overlayBox.outerHeight() + additionalMargin < spaceToViewportTop) {
            additionalMargin = spaceToViewportBottom - that.overlayBox.outerHeight() - additionalMargin;
            that.overlayInnerBox.css('top', additionalMargin + 'px');
          }
          else {
            that.overlayInnerBox.css('top', '0px');
          }
        }
      };

      var displayExternalLinkLoadingIndicator = function(event) {
        positionGlobalIndicator(that.externalLinkLoadingIndicator, event);
        that.externalLinkLoadingIndicator.show();
      };

      var displayTouchIndicator = function(event) {
        positionGlobalIndicator(that.touchIndicator, event);
        animateTouchIndicator();
      };

      var animateTouchIndicator = function() {
        that.touchIndicator.hide();

        setTimeout(function() {
          that.touchIndicator.show();
        }, 500);
      };

      var positionGlobalIndicator = function(indicator, event) {
        var parentClientRect = that.panoramaWrapper[0].getBoundingClientRect();
        var touch = event.touches ? event.touches[0] : event;

        indicator.css({
          left: touch.clientX - parentClientRect.left,
          top: touch.clientY - parentClientRect.top
        });
      };

      this.refresh();
    },

    _setOptions: function(options) {
      var changed = (this.options.disabled !== options.disabled);
      this._super(options);

      if (changed) {
        if (this.options.disabled) {
          this.panoramaWrapper.css({
            left: 0,
            top: 0
          });
        }
        else {
          this.refresh();
        }
      }
    },

    calcAreaOpacity: function(activeAreas, mX, mY) {
      if (pageflow.browser.has('mobile platform')) {
        return;
      }

      var pageElement = this.options.page;
      var distanceLimit = pageElement.width() > pageElement.height() ? pageElement.height() : pageElement.width();
      var minOpacity = 0.4;
      activeAreas.each(function() {
        var distance = calculateDistance($(this), mX, mY);

        if(distance <= distanceLimit) {
          var opacity = 1 + minOpacity - Math.sqrt(distance / distanceLimit);
          $(this).find('.linkmap_marker.no_transition').css('opacity', opacity);
        }
        else {
          $(this).find('.linkmap_marker.no_transition').css('opacity', minOpacity);
        }


      });

      function calculateDistance(elem, mouseX, mouseY) {
        return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left+(elem.width()/2)), 2) + Math.pow(mouseY - (elem.offset().top+(elem.height()/2)), 2)));
      }
    },

    highlightAreas: function() {
      if (this.options.disabled) {
        return;
      }

      var element = this.element;
      element.find('.linkmap_marker').addClass('teasing');

      setTimeout(function() {
        element.find('.linkmap_marker').removeClass('teasing');
      }, 1000);

      setTimeout(function() {
        element.find('.linkmap_marker').addClass('no_transition');
      }, 2000);
    },

    resetAreaHighlighting: function() {
      if (this.options.disabled) {
        return;
      }

      var element = this.element;

      element.find('.linkmap_marker').removeClass('no_transition teasing');
      element.find('.linkmap_marker').css('opacity', pageflow.browser.has('mobile platform') ? '0.8' : '0.4');
    },

    getScrollArea: function(activeAreas) {
      var panorama = this.panorama;
      var pageElement = this.options.page;
      var startScrollPosition = this.startScrollPosition;
      var scrollArea;

      if (activeAreas.length && this.limitScrolling) {
        scrollArea = {
          top: this.startScrollPosition.y * panorama.height(),
          left: this.startScrollPosition.x * panorama.width(),
          bottom: this.startScrollPosition.y * panorama.height(),
          right: this.startScrollPosition.x * panorama.width(),
        };

        activeAreas.each(function() {
          var el = $(this);

          scrollArea.top = scrollArea.top > el.position().top ? el.position().top : scrollArea.top;
          scrollArea.left = scrollArea.left > el.position().left ? el.position().left : scrollArea.left;
          scrollArea.bottom = scrollArea.bottom < el.position().top + el.height() ? el.position().top + el.height() : scrollArea.bottom;
          scrollArea.right = scrollArea.right < el.position().left + el.width() ? el.position().left + el.width() : scrollArea.right;
        });

        scrollArea.top = Math.max(0, scrollArea.top - pageElement.height() * this.scrollHoverMargin);
        scrollArea.left = Math.max(0, scrollArea.left - pageElement.width() * this.scrollHoverMargin);
        scrollArea.bottom = Math.min(panorama.height(), scrollArea.bottom + pageElement.height() * this.scrollHoverMargin);
        scrollArea.right = Math.min(panorama.width(), scrollArea.right + pageElement.width() * this.scrollHoverMargin);
      }
      else {
        scrollArea = {
          top: panorama.position().top,
          left: panorama.position().left,
          bottom: (panorama.position().top + panorama.height()),
          right: (panorama.position().left + panorama.width()),
        };
      }

      return scrollArea;
    },

    update: function(addEnvironment, limitScrolling, startScrollPosition, minScaling) {
      this.addEnvironment = addEnvironment;
      this.limitScrolling = limitScrolling;
      this.startScrollPosition = _.clone(startScrollPosition);
      this.minScaling = minScaling;

      this.refresh();
    },

    refresh: function() {
      if (this.options.disabled) {
        return;
      }

      this.keepingScrollPosition(function() {
        var pageElement = this.options.page;

        this.panorama = this.options.panorama();

        this.panoramaSize = this.getPanoramaSize({
          pageWidth: pageElement.width(),
          pageHeight: pageElement.height(),

          minScaling: this.minScaling
        });

        this.panorama.width(this.panoramaSize.width);
        this.panorama.height(this.panoramaSize.height);

        pageElement.toggleClass('linkmap_panorama_h', this.panoramaSize.orientation === 'h');
        pageElement.toggleClass('linkmap_panorama_v', this.panoramaSize.orientation === 'v');

        this.activeAreas = pageElement.find(this.options.activeAreasSelector);
        this.scrollArea = this.getScrollArea(this.activeAreas);

        this.innerScrollerElement.addClass('measuring');

        this.innerScrollerElement.width(this.scrollArea.right - this.scrollArea.left);
        this.innerScrollerElement.height(this.scrollArea.bottom - this.scrollArea.top);

        var centerX = Math.max(0, (pageElement.width() - (this.scrollArea.right - this.scrollArea.left)) / 2);
        var centerY = Math.max(0, (pageElement.height() - (this.scrollArea.bottom - this.scrollArea.top)) / 2);

        var translateX = this.scrollArea.left - centerX;
        var translateY = this.scrollArea.top - centerY;

        var maxTranslateX = this.panoramaSize.width - pageElement.width();
        var maxTranslateY = this.panoramaSize.height - pageElement.height();

        this.panoramaWrapper.css({
          left: -Math.min(maxTranslateX, Math.max(0, translateX)) +'px',
          top: -Math.min(maxTranslateY, Math.max(0, translateY)) + 'px'
        });

        this.innerScrollerElement.removeClass('measuring');
        this.scroller.refresh();

        this.activeAreas.addClass('enabled');
      });
    },

    getPanoramaSize: function(options) {
      return pageflow.linkmapPage.getPanoramaSize({
        pageWidth: options.pageWidth,
        pageHeight: options.pageHeight,

        panoramaWidth: this.panorama.attr('data-width'),
        panoramaHeight: this.panorama.attr('data-height'),

        areaDimensions: this.activeAreas.map(function() {
          var el = $(this);
          return {
            width: el.attr('data-width'),
            height: el.attr('data-height')
          };
        }).get(),

        minScaling: options.minScaling,
        addEnvironment: this.addEnvironment
      });
    },

    resetScrollPosition: function() {
      if (this.options.disabled) {
        return;
      }

      this.centerToPoint(this.panoramaToScroller(this.startScrollPosition), 0);
    },

    centerToPoint: function(point, time) {
      point = point || this.currentScrollPosition;

      var absoluteX = this.scroller.maxX() * point.x;
      var absoluteY = this.scroller.maxY() * point.y;

      this.scroller.scrollTo(absoluteX, absoluteY, time);

      this.currentScrollPosition = this.currentScrollPosition || point;
    },

    keepingScrollPosition: function(fn) {
      var panoramaPosition;

      if (this.currentScrollPosition) {
        panoramaPosition = this.scrollerToPanorama(this.currentScrollPosition);
      }
      else {
        panoramaPosition = this.startScrollPosition;
      }

      fn.call(this);

      this.centerToPoint(this.panoramaToScroller(panoramaPosition));
    },

    scrollerToPanorama: function(point) {
      var scrollAreaWidth = (this.scrollArea.right - this.scrollArea.left);
      var scrollAreaHeight = (this.scrollArea.bottom - this.scrollArea.top);

      return {
        x: this.panoramaSize.width === 0 ?
          0 :
          (this.scrollArea.left + point.x * scrollAreaWidth) / this.panoramaSize.width,
        y: this.panoramaSize.height === 0?
          0 :
          (this.scrollArea.top + point.y * scrollAreaHeight) / this.panoramaSize.height
      };
    },

    panoramaToScroller: function(point) {
      var scrollAreaWidth = (this.scrollArea.right - this.scrollArea.left);
      var scrollAreaHeight = (this.scrollArea.bottom - this.scrollArea.top);

      return {
        x: scrollAreaWidth === 0 ?
          0 :
          (point.x * this.panoramaSize.width - this.scrollArea.left) / scrollAreaWidth ,
        y: scrollAreaHeight === 0 ?
          0 :
          (point.y * this.panoramaSize.height - this.scrollArea.top) / scrollAreaHeight
      };
    },

    updateScrollPosition: function() {
      var that = this;

      setTimeout(function() {
        that.currentScrollPosition.x = that.scroller.maxX() !== 0 ? that.scroller.positionX() / that.scroller.maxX() : 0;
        that.currentScrollPosition.y = that.scroller.maxY() !== 0 ? that.scroller.positionY() / that.scroller.maxY() : 0;
      }, 10);

      if (this.lastMouseMoveEvent) {
        this.calcAreaOpacity(this.activeAreas, this.lastMouseMoveEvent.pageX, this.lastMouseMoveEvent.pageY);
      }
    }
  });
}(jQuery));
