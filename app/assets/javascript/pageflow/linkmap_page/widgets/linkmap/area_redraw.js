$.fn.linkmapAreaRedraw = function(options) {
  this.each(function() {
    var area = $(this);
    var position = area.position();

    var mask = options.masks && options.masks.findByPermaId(area.attr('data-mask-id'));
    area.data('mask', mask || null);

    var canvas = area.find(options.target)[0];
    var context = canvas.getContext('2d');

    if (options.image) {
      canvas.width = options.width;
      canvas.height = options.height;

      if (mask) {
        mask.draw(context, options.width);
        context.globalCompositeOperation = 'source-in';
      }

      if (options.image) {
        options.image.draw(canvas);
      }
    }
    else {
      context.clearRect(0, 0, options.width, options.height);
    }
  });
};
