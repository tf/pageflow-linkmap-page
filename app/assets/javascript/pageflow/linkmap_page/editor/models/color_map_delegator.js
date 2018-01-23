pageflow.linkmapPage.ColorMapDelegator = pageflow.Object.extend({
  initialize: function() {
    this._colorMap = pageflow.linkmapPage.ColorMap.empty;
  },

  updateDelegate: function(colorMap) {
    this._colorMap = colorMap;
    this.trigger('update');
  }
});

_(['components', 'componentFromPoint', 'componentByPermaId']).each(function(method) {
  pageflow.linkmapPage.ColorMapDelegator.prototype[method] = function() {
    return this._colorMap[method].apply(this._colorMap, arguments);
  };
});
