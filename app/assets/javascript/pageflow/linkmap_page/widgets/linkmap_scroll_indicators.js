(function($) {
  // Only show scroll indicators if at least 20% of the panorama is
  // outside of the viewport.
  var minOverflowFraction = 1.2;

  // Ensure scroll indicators are already hidden when the scroller
  // decelerates while approaching the max scroll position.
  var margin = 40;

  $.widget('pageflow.linkmapScrollIndicators', {
    _create: function() {
      var scroller = this.options.scroller;

      this.arrows = this.element.find('.linkmap-arrow');

      scroller.onScroll(_.bind(this.refresh, this));
      scroller.onScrollEnd(_.bind(this.refresh, this));
      this.refresh();

      if (this.options.disabled) {
        this.disable();
      }
    },

    refresh: function() {
      var element = this.element;
      var scroller = this.options.scroller;
      var viewport = this.options.viewport;
      var innerScrollerElement = this.options.innerScrollerElement;

      var showH = innerScrollerElement.width() / viewport.width() > minOverflowFraction;
      var showV = innerScrollerElement.height() / viewport.height() > minOverflowFraction;

      element.toggleClass('can_scroll_left',
                          showH && Math.ceil(scroller.positionX()) < - margin);
      element.toggleClass('can_scroll_right',
                          showH && Math.floor(scroller.positionX()) > scroller.maxX() + margin);
      element.toggleClass('can_scroll_up',
                          showV && Math.ceil(scroller.positionY()) < - margin);
      element.toggleClass('can_scroll_down',
                          showV && Math.floor(scroller.positionY()) > scroller.maxY() + margin);
    },

    disable: function() {
      this.arrows.hide();
    },

    enable: function() {
      this.arrows.show();
    }
  });
}(jQuery));
