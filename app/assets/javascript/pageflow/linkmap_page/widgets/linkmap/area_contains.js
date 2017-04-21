$.fn.linkmapAreaContains = function(position) {
  var area = $(this);
  var mask = area.data('mask');

  if (mask) {
    return mask.contains(position.leftInPercent / 100, position.topInPercent / 100);
  }
  else {
    var areaPosition = area.position();
    var areaWidth = area.width();
    var areaHeight = area.height();

    return position.leftInPixel >= areaPosition.left &&
      position.leftInPixel < areaPosition.left + areaWidth &&
      position.topInPixel >= areaPosition.top &&
      position.topInPixel < areaPosition.top + areaHeight;
  }
};
