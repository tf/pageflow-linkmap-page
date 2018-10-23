pageflow.linkmapPage.Mask = function Mask(options) {
  this.contains = function(xInPercent, yInPercent) {
    var component = options.colorMap.componentFromPoint(xInPercent, yInPercent);
    return !!component && component.permaId == options.colorMapComponentPermaId;
  };
};
