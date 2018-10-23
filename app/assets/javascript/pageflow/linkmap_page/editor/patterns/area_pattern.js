pageflow.linkmapPage.areaPattern = {
  applyOffset: function(canvas, left, top, width, height) {
    var el = $(canvas)

    var deltaX = left % 14;
    var deltaY = top % 14;

    el.css({
      left: -deltaX + 'px',
      top: -deltaY + 'px',
      width: width + deltaX + 'px',
      height: height + deltaY + 'px'
    }).show();

    canvas.width = el.width();
    canvas.height = el.height();
  },

  use: function(context) {
    if (!this.patternSource) {
      var rectSize = 7;

      var canvas = document.createElement('canvas');
      this.patternSource = canvas;

      canvas.width = rectSize * 2;
      canvas.height = rectSize * 2;

      var c = canvas.getContext('2d');

      c.fillStyle = '#000';
      c.fillRect(0, 0, rectSize, rectSize);
      c.fillRect(rectSize, rectSize, rectSize, rectSize);

      c.fillStyle = '#fff';
      c.fillRect(rectSize, 0, rectSize, rectSize);
      c.fillRect(0, rectSize, rectSize, rectSize);
    }

    context.fillStyle = context.createPattern(this.patternSource, 'repeat');
  }
};