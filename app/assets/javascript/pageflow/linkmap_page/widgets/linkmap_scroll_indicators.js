(function($) {
  $.widget('pageflow.linkmapScrollIndicators', {
    _create: function() {
      var element = this.element;
      var scroller = this.options.scroller;

      scroller.onScroll(toggle);
      scroller.onScrollEnd(toggle);
      toggle();

      function toggle() {
        element.toggleClass('can_scroll_left', Math.ceil(scroller.positionX()) < 0);
        element.toggleClass('can_scroll_right', Math.floor(scroller.positionX()) > scroller.maxX());
      }
    }
  });
}(jQuery))
