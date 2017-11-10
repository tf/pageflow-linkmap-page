(function($) {
  var margin = 40;

  $.widget('pageflow.linkmapScrollIndicators', {
    _create: function() {
      var element = this.element;
      var scroller = this.options.scroller;

      this.arrows = this.element.find('.linkmap-arrow');

      scroller.onScroll(toggle);
      scroller.onScrollEnd(toggle);
      toggle();

      if (this.options.disabled) {
        this.disable();
      }

      function toggle() {
        element.toggleClass('can_scroll_left', Math.ceil(scroller.positionX()) < - margin);
        element.toggleClass('can_scroll_right', Math.floor(scroller.positionX()) > scroller.maxX() + margin);
        element.toggleClass('can_scroll_up', Math.ceil(scroller.positionY()) < - margin);
        element.toggleClass('can_scroll_down', Math.floor(scroller.positionY()) > scroller.maxY() + margin);
      }
    },

    disable: function() {
      this.arrows.hide();
    },

    enable: function() {
      this.arrows.show();
    }
  });
}(jQuery));
