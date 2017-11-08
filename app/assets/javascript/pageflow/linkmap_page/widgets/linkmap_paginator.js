/*global IScroll*/

(function($) {
  $.widget('pageflow.linkmapPaginator', {
    _create: function() {
      this.scrollerReady = $.Deferred();

      this.scrollerElement = this.element.find('.paginator-scroller');
      this.scrollerInner = this.scrollerElement.children().first();
      this.container = this.element.find('.pager-pages');

      this._cloneFirstAndLastPageForCarousel();

      this.pages = this.element.find('.pager-page');

      this.scroller = new IScroll(this.scrollerElement[0], {
        scrollY: false,
        scrollX: true,
        snap: '.pager-page',
        momentum: false,
        bounce: false,
        probeType: 3,
        eventListenerTarget: this.options.scrollerEventListenerTarget[0]
      });

      this._translatePagesVerticallyWhileScrolling();
      this._setupCarousel();
      this._setupChangeCallbackTrigger();
      this._setupIndicatorDots();
    },

    refresh: function() {
      this._updatePageWidths();
      this._cachePageHeights();

      this.scroller.refresh();
      this.scrollerReady.resolve();
    },

    getCurrentPageHeight: function() {
      var currentPageIndex = this.scroller.currentPage.pageX;
      return this.pageHeights[currentPageIndex];
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
      var widget = this;
      var scroller = this.scroller;

      scroller.on('scroll', function() {
        var direction = scroller.x > scroller.currentPage.x ? -1 : 1;

        var currentPageIndex = scroller.currentPage.pageX;
        var destinationPageIndex = currentPageIndex + direction;

        var currentPageHeight = widget.pageHeights[currentPageIndex];
        var destinationPageHeight = widget.pageHeights[destinationPageIndex];

        var pageWidth = scroller.pages[0][0].width;
        var progress = Math.min(1, Math.abs(scroller.currentPage.x - scroller.x) / pageWidth);

        translateY(widget.container,
                   currentPageHeight * (1 - progress) + destinationPageHeight * progress);
      });

      scroller.on('initPosition', update);
      scroller.on('scrollEnd', update);
      scroller.on('refresh', update);

      function update() {
        translateY(widget.container, widget.getCurrentPageHeight());
      }
    },

    _cloneFirstAndLastPageForCarousel: function() {
      var pages = this.element.find('.pager-page');
      var container = this.element.find('.pager-pages');

      pages.first().clone().appendTo(container);
      pages.last().clone().prependTo(container);
    },

    _setupCarousel: function() {
      var scroller = this.scroller;
      var pages = this.pages;

      scroller.on('scrollEnd', function() {
        var currentPageIndex = scroller.currentPage.pageX;

        if (currentPageIndex === 0) {
          scroller.goToPage(pages.length - 2, 0, 0);
        }
        else if (currentPageIndex == pages.length - 1) {
          scroller.goToPage(1, 0, 0);
        }
      });

      this.scrollerReady.then(function() {
        scroller.goToPage(1, 0, 0);
        scroller._execEvent('initPosition');
      });
    },

    _setupChangeCallbackTrigger: function() {
      var changeCallback = this.options.change;
      var pages = this.pages;
      var scroller = this.scroller;

      if (changeCallback) {
        scroller.on('scrollEnd', function() {
          var currentPageIndex = scroller.currentPage.pageX;
          var currentPageIndexIgnoringClonedPages = (currentPageIndex - 1) % (pages.length - 2);

          changeCallback(currentPageIndexIgnoringClonedPages);
        });
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
      var container = this.dotsContainer = $('<div class="paginator-dots" />').appendTo(this.element);

      _.times(this.pages.length - 2, function() {
        container.append('<div class="paginator-dot" />');
      });

      var dots = container.children();

      scroller.on('scrollEnd', update);
      scroller.on('initPosition', update);

      function update() {
        dots.removeClass('active');
        dots.eq(scroller.currentPage.pageX - 1).addClass('active');
      }
    }
  });

  function translateY(element, y) {
    element.css('transform', 'translate3d(0, -' + y + 'px, 0)');
  }
}(jQuery));