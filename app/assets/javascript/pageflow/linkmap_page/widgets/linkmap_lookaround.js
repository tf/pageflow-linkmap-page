(function($) {
  $.widget('pageflow.linkmapLookaround', {
    speedUp : 10,
    drag : false,

    _create: function() {
      this.disabled = false;
      this.marginScrolling = !this.options.marginScrollingDisabled;

      var scroller = this.scroller = this.options.scroller;
      var that = this;

      this.scrollStrategyX = new pageflow.linkmapPage.TargetSpeedStrategy({
        scrollerPosition: function() {
          return scroller.positionX();
        },

        scrollerMax: function() {
          return scroller.maxX();
        }
      }, 'x');

      this.scrollStrategyY = new pageflow.linkmapPage.TargetSpeedStrategy({
        scrollerPosition: function() {
          return scroller.positionY();
        },

        scrollerMax: function() {
          return scroller.maxY();
        }
      }, 'y');

      this.element.on('mousedown touchstart', function (event) {
        that.drag = true;

        $(window).one('mouseup touchend', function() {
          that.drag = false;
          that.initialBeta = null;
          that.initialGamma = null;
        });
      });

      this.element.on('mousedown', function (event) {
        // prevent dragging
        event.originalEvent.preventDefault();
      });

      this.element.on('mouseenter', function() {
        that.scrollStrategyX.reset();
        that.scrollStrategyY.reset();
      });

      this.element.on('mouseleave', function() {
        that.scrollStrategyX.reset();
        that.scrollStrategyY.reset();
      });

      $(window).on('orientationchange', function( event ) {
        that.drag = false;
        that.initialBeta = null;
        that.initialGamma = null;
      });

      if (!pageflow.browser.has('mobile platform')) {
        this.element.on('mousemove', function(e) {
          var containerWidth = that.element.width();
          var containerHeight = that.element.height();

          that.scrollStrategyX.updateMouse(e.pageX / containerWidth);
          that.scrollStrategyY.updateMouse(e.pageY / containerHeight);
        });
      }
    },

    enable: function() {
      this.disabled = false;
    },

    disable: function() {
      this.disabled = true;
    },

    activate: function() {
      this.startInterval();

      if (pageflow.browser.has('mobile platform')) {
        this.startGyro();
      }
    },

    deactivate: function() {
      this.stopInterval();

      if (pageflow.browser.has('mobile platform')) {
        this.stopGyro();
      }
    },

    startInterval: function() {
      if (!this.interval) {
        this.interval = setInterval(_.bind(this.onTick, this), 25);
      }
    },

    stopInterval: function() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    },

    onTick: function() {
      if (!this.drag && this.marginScrolling && !this.disabled) {
        this.scroller.scrollBy(this.scrollStrategyX.getNextScrollDelta(),
                               this.scrollStrategyY.getNextScrollDelta());
      }
    },

    update: function(marginScrollingDisabled) {
      this.marginScrolling = !marginScrollingDisabled;
    },

    startGyro: function() {
      var that = this;
      var limit = 8;

      gyro.startTracking(function(o) {
        if (!that.initialBeta) {
          that.initialBeta = o.beta;
        }

        if (!that.initialGamma) {
          that.initialGamma = o.gamma;
        }

        if (!this.drag) {
          var deltaGamma = o.gamma - that.initialGamma;
          var deltaBeta = o.beta - that.initialBeta;

          if ($(window).height() >= $(window).width()) {
            that.scrollStrategyX.updateGyro(deltaGamma);
            that.scrollStrategyY.updateGyro(-deltaBeta);
          }
          else {
            that.scrollStrategyX.updateGyro(-deltaBeta);
            that.scrollStrategyY.updateGyro(deltaGamma);
          }
        }
      });
    },

    stopGyro: function() {
      gyro.stopTracking();
    }
  });
}(jQuery));
