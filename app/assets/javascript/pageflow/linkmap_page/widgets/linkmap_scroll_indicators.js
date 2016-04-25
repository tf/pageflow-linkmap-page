(function($) {
  var margin = 40;

  $.widget('pageflow.linkmapScrollIndicators', {
    _create: function() {
      var element = this.element;
      var scroller = this.options.scroller;

      scroller.onScroll(toggle);
      scroller.onScrollEnd(toggle);
      toggle();

      function toggle() {
        element.toggleClass('can_scroll_left', Math.ceil(scroller.positionX()) < - margin);
        element.toggleClass('can_scroll_right', Math.floor(scroller.positionX()) > scroller.maxX() + margin);
        element.toggleClass('can_scroll_up', Math.ceil(scroller.positionY()) < - margin);
        element.toggleClass('can_scroll_down', Math.floor(scroller.positionY()) > scroller.maxY() + margin);
      }
    }
  });
}(jQuery));
