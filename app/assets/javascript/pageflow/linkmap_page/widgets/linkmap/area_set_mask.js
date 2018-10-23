$.fn.linkmapAreaSetMask = function(options) {
  this.each(function() {
    var area = $(this);
    var colorMapComponent = options.colorMap.componentByPermaId(area.attr('data-mask-perma-id'));

    if (colorMapComponent) {
      area.data('mask', new pageflow.linkmapPage.Mask({
        colorMapComponentPermaId: colorMapComponent.permaId,
        colorMap: options.colorMap
      }));
    }
    else {
      area.data('mask', null);
    }
  });
};
