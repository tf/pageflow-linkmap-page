(function($) {
  $.widget('pageflow.linkmapAreaIndicators', {
    _create: function() {
      this.touchIndicator = this.element.find('.touch_indicator');
      this.externalLinkLoadingIndicator = this.element.find('.external_link_loading_indicator');
    },

    displayForSelectedArea: function(area, event) {
      if (!area.hasClass('dynamic_marker') &&
          !area.hasClass('text_only_area')) {
        this._animateTouchIndicator(event);
      }
    },

    displayForClickedArea: function(area, event) {
      if (!area.hasClass('dynamic_marker') &&
          area.hasClass('external_site_area') &&
          area.hasClass('target_self')) {
        this._displayExternalLinkLoadingIndicator(event);
      }
    },

    reset: function() {
      this.externalLinkLoadingIndicator.hide();
    },

    _animateTouchIndicator: function(event) {
      this._updatePosition(this.touchIndicator, event);
      this._animate(this.touchIndicator);
    },

    _displayExternalLinkLoadingIndicator: function(event) {
      this._updatePosition(this.externalLinkLoadingIndicator, event);
      this.externalLinkLoadingIndicator.show();
    },

    _animate: function(element) {
      element.hide();

      setTimeout(function() {
        element.show();
      }, 500);

      setTimeout(function() {
        element.hide();
      }, 1200);
    },

    _updatePosition: function(element, event) {
      if (event) {
        this._updatePositionByEvent(element, event);
      }
      else {
        this._center(element);
      }
    },

    _updatePositionByEvent: function(element, event) {
      var touch = event.touches ? event.touches[0] : event;
      var parentClientRect = this.options.pageElement[0].getBoundingClientRect();

      element.css({
        left: touch.clientX - parentClientRect.left,
        top: touch.clientY - parentClientRect.top
      });
    },

    _center: function(element) {
      element.css({
        left: '50%',
        top: '40%'
      });
    }
  });
}(jQuery));