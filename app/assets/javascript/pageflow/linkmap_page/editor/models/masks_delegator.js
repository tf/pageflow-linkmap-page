pageflow.linkmapPage.MasksDelegator = pageflow.Object.extend({
  initialize: function() {
    this._masks = pageflow.linkmapPage.Masks.empty;
  },

  updateDelegate: function(masks) {
    this._masks = masks;
    this.trigger('update');
  }
});

_(['findByPermaId', 'atPoint', 'each', 'draw', 'isEmpty']).each(function(method) {
  pageflow.linkmapPage.MasksDelegator.prototype[method] = function() {
    return this._masks[method].apply(this._masks, arguments);
  };
});
