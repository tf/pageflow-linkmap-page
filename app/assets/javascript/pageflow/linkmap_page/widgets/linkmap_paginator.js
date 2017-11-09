/*global IScroll*/

(function($) {
  var DOTS_BAR_HEIGHT = 38;

  $.widget('pageflow.linkmapPaginator', {
    _create: function() {
      this.scrollerReady = $.Deferred();

      this.scrollerElement = this.element.find('.linkmap-paginator-scroller');
      this.scrollerInner = this.scrollerElement.children().first();
      this.container = this.element.find('.linkmap-paginator-pages');

      this._cloneFirstAndLastPageForCarousel();
      this._findPages();

      this.scroller = new IScroll(this.scrollerElement[0], {
        scrollY: false,
        scrollX: true,
        snap: this.pages.toArray(),
        momentum: false,
        bounce: false,
        probeType: 3,
        eventListenerTarget: this.options.scrollerEventListenerTarget[0],
        preventDefault: false
      });

      if (this.options.disabled) {
        this.scroller.disable();
      }

      this._translatePagesVerticallyWhileScrolling();
      this._setupCarousel();
      this._setupChangeCallbackTrigger();
      this._setupIndicatorDots();
    },

    update: function() {
      this._findPages();
      this.scroller.options.snap = this.pages.toArray();

      this._updateClonedPages();
      this._setupIndicatorDots();

      this.refresh();
    },

    refresh: function(options) {
      this._updatePageWidths();
      this._cachePageHeights();

      this.scroller.refresh();
    },

    initScrollPosition: function() {
      if (this.options.disabled) {
        return;
      }

      this.scrollerReady.resolve();
    },

    getCurrentHeight: function() {
      return this._heightFromPageHeight(this._getCurrentPageHeight());
    },

    _findPages: function() {
      this.pages = this.element.find('.linkmap-paginator-page');
    },

    _updatePageWidths: function() {
      var pageWidth = this.element.width();

      this.pages.css({width: pageWidth + 'px'});
      this.scrollerInner.css({width: (this.pages.length * pageWidth) + 'px'});
    },

    _cachePageHeights: function() {
      this.pageHeights = this.pages.map(function() {
        return $(this).outerHeight();
      }).get();
    },

    _translatePagesVerticallyWhileScrolling: function() {
      var changingCallback = this.options.changing;

      this.scroller.on('scroll', _.bind(function() {
        var direction = this.scroller.x > this.scroller.currentPage.x ? -1 : 1;

        var currentPageIndex = this.scroller.currentPage.pageX;
        var destinationPageIndex = currentPageIndex + direction;

        var currentPageHeight = this.pageHeights[currentPageIndex];
        var destinationPageHeight = this.pageHeights[destinationPageIndex];

        var pageWidth = this.scroller.pages[0][0].width;
        var progress = Math.min(1, Math.abs(this.scroller.currentPage.x - this.scroller.x) / pageWidth);

        translateY(this.container,
                   currentPageHeight * (1 - progress) + destinationPageHeight * progress);

        if (changingCallback) {
          changingCallback({
            currentPageIndex: this._pageIndexIgnoringClonedPages(currentPageIndex),
            destinationPageIndex: this._pageIndexIgnoringClonedPages(destinationPageIndex),

            currentHeight: this._heightFromPageHeight(currentPageHeight),
            destinationHeight: this._heightFromPageHeight(destinationPageHeight),

            progress: progress
          });
        }
      }, this));

      var update = _.bind(this._updateCurrentPageHeight, this);

      this.scroller.on('initPosition', update);
      this.scroller.on('scrollEnd', update);
      this.scroller.on('refresh', update);
    },

    updateHeight: function update() {
      this._cachePageHeights();
      this._updateCurrentPageHeight();
    },

    _updateCurrentPageHeight: function update() {
      translateY(this.container, this._getCurrentPageHeight());
    },

    _getCurrentPageHeight: function() {
      var currentPageIndex = this.scroller.currentPage.pageX;
      return this.pageHeights[currentPageIndex];
    },

    _heightFromPageHeight: function(pageHeight) {
      return pageHeight + DOTS_BAR_HEIGHT;
    },

    _cloneFirstAndLastPageForCarousel: function() {
      var pages = this.element.find('.linkmap-paginator-page');
      var container = this.element.find('.linkmap-paginator-pages');

      pages.first().clone().appendTo(container);
      pages.last().clone().prependTo(container);
    },

    _updateClonedPages: function() {
      this.pages.first().html(this.pages.eq(-2).html());
      this.pages.last().html(this.pages.eq(1).html());
    },

    _setupCarousel: function() {
      var scroller = this.scroller;

      scroller.on('scrollEnd', _.bind(function() {
        var currentPageIndex = scroller.currentPage.pageX;

        if (currentPageIndex === 0) {
          scroller.goToPage(this.pages.length - 2, 0, 0);
        }
        else if (currentPageIndex == this.pages.length - 1) {
          scroller.goToPage(1, 0, 0);
        }
      }, this));

      this.scrollerReady.then(function() {
        scroller.goToPage(1, 0, 0);
        scroller._execEvent('initPosition');
      });
    },

    _setupChangeCallbackTrigger: function() {
      var changeCallback = this.options.change;

      if (changeCallback) {
        this.scroller.on('scrollEnd', _.bind(function() {
          var currentPageIndex = this.scroller.currentPage.pageX;
          changeCallback(this._pageIndexIgnoringClonedPages(currentPageIndex));
        }, this));
      }
    },

    hideDots: function() {
      this.dotsContainer.addClass('faded');
    },

    showDots: function() {
      this.dotsContainer.removeClass('faded');
    },

    _setupIndicatorDots: function() {
      var scroller = this.scroller;
      var container = this.dotsContainer = this.dotsContainer ||
        $('<div class="linkmap-paginator-dots" />').appendTo(this.element);

      container.children().remove();

      _.times(this.pages.length - 2, function() {
        container.append('<div class="linkmap-paginator-dot" />');
      });

      var dots = container.children();

      scroller.on('scrollEnd', update);
      scroller.on('initPosition', update);

      function update() {
        dots.removeClass('active');
        dots.eq(scroller.currentPage.pageX - 1).addClass('active');
      }
    },

    _pageIndexIgnoringClonedPages: function(index) {
      return (index - 1) % (this.pages.length - 2);
    },
  });

  function translateY(element, y) {
    element.css('transform', 'translate3d(0, -' + y + 'px, 0)');
  }
}(jQuery));