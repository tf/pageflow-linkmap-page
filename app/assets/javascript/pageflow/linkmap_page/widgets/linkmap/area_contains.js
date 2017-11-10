$.fn.linkmapAreaContains = function(position) {
  var area = $(this);
  var mask = area.data('mask');

  if (mask) {
    return mask.contains(position.leftInPercent / 100, position.topInPercent / 100);
  }
  else {
    var areaLeft = parseFloat(area.css('left'));
    var areaTop = parseFloat(area.css('top'));
    var areaWidth = area.width();
    var areaHeight = area.height();

    return position.leftInPixel >= areaLeft &&
      position.leftInPixel < areaLeft + areaWidth &&
      position.topInPixel >= areaTop &&
      position.topInPixel < areaTop + areaHeight;
  }
};
