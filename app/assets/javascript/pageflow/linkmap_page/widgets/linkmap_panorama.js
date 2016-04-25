(function($) {
  $.widget('pageflow.linkmapPanorama', {
    scrollHoverMargin : 0.2,
    environmentMargin : 0.2,
    minScaling: true,
    minScalingSize: 80,
    lastMouseMoveEvent: null,

    _create: function() {
      var that = this,
          pageElement = this.options.page;

      this.addEnvironment = this.options.addEnvironment;
      this.panorama = this.options.panorama();
      this.limitScrolling = this.options.limitScrolling;
      this.scroller = this.options.scroller;

      this.activeAreas = pageElement.find(this.options.activeAreasSelector);
      this.panoramaWrapper = pageElement.find('.panorama_wrapper');
      this.innerScrollerElement = pageElement.find('.linkmap');
      this.overlayBox = pageElement.find('.description_overlay');
      this.overlayInnerBox = pageElement.find('.description_overlay_wrapper');
      this.overlayTitle = pageElement.find('.description_overlay .link_title');
      this.overlayDescription = pageElement.find('.description_overlay .link_description');

      this.startScrollPosition = _.clone(this.options.startScrollPosition);

      this.currentScrollPosition = null;

      this.refresh();

      this.scroller.onScrollEnd(function() {
        that.updateScrollPosition();
      });

      $(window).on('resize', function () {
        that.centerToPoint(null, 0);
      });

      this.element.on('mousemove', function(e) {
        that.lastMouseMoveEvent = e;
        that.calcAreaOpacity(that.activeAreas, e.pageX, e.pageY);
      });

      pageElement.on('mouseenter', '.hover_area', function() {
        positionOverlay($(this));
      });

      pageElement.on('click', function() {
        that.overlayBox.removeClass('active');
        that.activeAreas.removeClass('hover');
      });

      $('body').on('mouseleave', '.hover_area', function() {
        that.overlayBox.removeClass('active');
      });

      pageElement.on('dragstart resizestart', '.hover_area', function() {
        that.overlayBox.removeClass('active');
      });

      that.activeAreas.each(function() {
        $(this).on('click touchstart', function(e) {
          if (pageflow.browser.has('mobile platform')) {
            if($(this).hasClass('hover')) {
              that.activeAreas.removeClass('active');
              $(this).addClass('active');
              return;
            }
            that.activeAreas.removeClass('hover');
            $(this).addClass('hover');
            positionOverlay($(this));
            return false;
          }
          else {
            that.activeAreas.removeClass('active');
            $(this).addClass('active');
          }
        })
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
            var spaceRightOfArea = $(window).width() - area.offset().left - area.outerWidth();

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
          var spaceToViewportBottom = $(window).height() - area.offset().top - area.height() / 2;
          var spaceToViewportTop = $(window).height() - 50;
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
      }

      this.refresh();
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

    getMinScale: function(activeAreas) {
      var smallestScale;
      var that = this;
      var minimumSize = this.minScalingSize;
      var smallestSize = Math.min(this.panorama.attr('data-width'), this.panorama.attr('data-height'));

      if(this.minScaling) {

        for (var i = 0; i < activeAreas.length; i++) {
          var el = $(activeAreas[i]);

          if(el.attr('data-height') / 100 *  that.panorama.attr('data-height') < smallestSize) {
            smallestSize = el.attr('data-height') / 100 *  that.panorama.attr('data-height');
          }
          if(el.attr('data-width') / 100 *  that.panorama.attr('data-width')  < smallestSize) {
            smallestSize = el.attr('data-width') / 100 *  that.panorama.attr('data-width');
          }
          smallestScale = minimumSize / smallestSize;
        }
      } else {
        smallestScale = 0;
      }

      return smallestScale;
    },

    update: function(addEnvironment, limitScrolling, startScrollPosition, minScaling) {
      this.addEnvironment = addEnvironment;
      this.limitScrolling = limitScrolling;
      this.startScrollPosition = _.clone(startScrollPosition);
      this.minScaling = minScaling;

      this.refresh();
    },

    refresh: function() {
      this.keepingScrollPosition(function() {
        var pageElement = this.options.page;

        this.panorama = this.options.panorama();

        this.panoramaSize = this.getPanoramaSize(pageElement);
        this.panorama.width(this.panoramaSize.width);
        this.panorama.height(this.panoramaSize.height);

        pageElement.toggleClass('linkmap_panorama_h', this.panoramaSize.orientation === 'h');
        pageElement.toggleClass('linkmap_panorama_v', this.panoramaSize.orientation === 'v');

        this.activeAreas = pageElement.find(this.options.activeAreasSelector);
        this.scrollArea = this.getScrollArea(this.activeAreas);

        this.innerScrollerElement.addClass('measuring');

        this.innerScrollerElement.width(this.scrollArea.right - this.scrollArea.left);
        this.innerScrollerElement.height(this.scrollArea.bottom - this.scrollArea.top);

        var maxTranslateX = this.panoramaSize.width - pageElement.width();
        var maxTranslateY = this.panoramaSize.height - pageElement.height();

        this.panoramaWrapper.css({
          left: -Math.min(maxTranslateX, this.scrollArea.left) +'px',
          top: -Math.min(maxTranslateY, this.scrollArea.top) + 'px'
        });

        this.innerScrollerElement.removeClass('measuring');
        this.scroller.refresh();

        var leftToCenterInnerScroller = (pageElement.width() - (this.scrollArea.right - this.scrollArea.left)) / 2;
        var topToCenterInnerScroller = (pageElement.height() - (this.scrollArea.bottom - this.scrollArea.top)) / 2;

        this.innerScrollerElement.css('left', (this.scroller.maxX() == 0 && this.panoramaSize.width > this.scrollArea.right - this.scrollArea.left ? Math.min(leftToCenterInnerScroller, this.scrollArea.left) : 0) + "px");
        this.innerScrollerElement.css('top', (this.scroller.maxY() == 0 && this.panoramaSize.height > pageElement.height() ? Math.min(topToCenterInnerScroller, this.scrollArea.top) : 0) + "px");
      });
    },

    getPanoramaSize: function(pageElement) {
      var result = {};
      var windowRatio = pageElement.width() / pageElement.height();
      var environmentMargin = this.addEnvironment ? (1 + this.environmentMargin) : 1;
      var smallestScale = this.getMinScale(this.activeAreas);
      var imageRatio;

      if (this.panorama.attr('data-height') > 0) {
        imageRatio = this.panorama.attr('data-width') / this.panorama.attr('data-height');
      }
      else {
        imageRatio = 1;
      }

      if(imageRatio > windowRatio) {
        result.height = pageElement.height() * environmentMargin;
        result.width = result.height * imageRatio;
        result.orientation = 'h';
      }
      else {
        result.width = pageElement.width() * environmentMargin;
        result.height = result.width / imageRatio;
        result.orientation = 'v';
      }

      if (result.width < this.panorama.attr('data-width') * smallestScale) {
        result.width = this.panorama.attr('data-width') * smallestScale;
        result.height = this.panorama.attr('data-height') * smallestScale;
      }

      return result;
    },

    resetScrollPosition: function() {
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
