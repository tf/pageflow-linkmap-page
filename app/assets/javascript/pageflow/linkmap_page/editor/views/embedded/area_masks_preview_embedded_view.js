pageflow.linkmapPage.AreaMasksPreviewEmbeddedView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/linkmap_page/editor/templates/embedded/area_masks_preview',

  className: 'linkmap_area_masks_preview',

  ui: {
    allAreasCanvas: 'canvas.all',
    currentAreaCanvas: 'canvas.current'
  },

  modelEvents: {
    'linkmap:select_area_position': 'enterSelectionMode'
  },

  events: {
    'mousemove': function(event) {
      this.update(event);
      return false;
    },

    'click': 'handleClick',

    'mousedown': 'handleMouseDown'
  },

  onRender: function() {
    this.$el.hide();
  },

  enterSelectionMode: function(options) {
    var view = this;

    if (this.selection) {
      this.selection.deferred.reject();
    }

    this.selection = options.selection;

    this.selection.deferred.always(function() {
      view.$el.hide();
    });

    this.$el.show();

    this.update();
    this.updateCursor();
    this.redrawAllAreas();
    this.redraw();
  },

  handleMouseDown: function(event) {
    var view = this;

    if (this.currentColorMapComponent || this.selection.type === 'colorMapComponent') {
      return;
    }

    var dragStartOffset = this.dragStartOffset = {
      x: event.offsetX,
      y: event.offsetY
    };

    this.$el.one('mouseup', function(mouseUpEvent) {
      var left = Math.min(mouseUpEvent.offsetX, dragStartOffset.x);
      var top = Math.min(mouseUpEvent.offsetY, dragStartOffset.y);
      var width = Math.abs(mouseUpEvent.offsetX - dragStartOffset.x);
      var height = Math.abs(mouseUpEvent.offsetY - dragStartOffset.y);

      if (width < 10) {
        width = 50;
      }

      if (height < 10) {
        height = 50;
      }

      view.selection.deferred.resolve({
        left: left / view.$el.width() * 100,
        top: top / view.$el.height() * 100,
        width: width / view.$el.width() * 100,
        height: height / view.$el.height() * 100
      });

      view.dragStartOffset = null;
      view.update(mouseUpEvent);
    });
  },

  isDragging: function() {
    return !!this.dragStartOffset;
  },

  handleClick: function(event) {
    var colorMapComponent = this.colorMapComponentFromPoint(event);

    if (colorMapComponent) {
      this.selection.deferred.resolve(colorMapComponent.areaAttributes());
    }
    else {
      this.selection.deferred.reject();
    }
  },

  update: function(event) {
    if (this.dragStartOffset) {
      this.drawSelection(this.dragStartOffset.x,
                         this.dragStartOffset.y,
                         event.offsetX - this.dragStartOffset.x,
                         event.offsetY - this.dragStartOffset.y);
      return;
    }

    var colorMapComponent = event && this.colorMapComponentFromPoint(event);

    if (colorMapComponent && this.colorMapComponentIsUsed(colorMapComponent)) {
      colorMapComponent = null;
    }

    if (this.currentColorMapComponent !== colorMapComponent) {
      this.currentColorMapComponent = colorMapComponent;

      this.updateCursor();
      this.redraw();
    }
  },

  colorMapComponentFromPoint: function(event) {
    return this.options.colorMap.componentFromPoint(event.offsetX / this.$el.width() * 100,
                                                    event.offsetY / this.$el.height() * 100);
  },

  updateCursor: function() {
    if (this.currentColorMapComponent) {
      this.$el.css('cursor', 'pointer');
    }
    else if (this.selection.type !== 'colorMapComponent') {
      this.$el.css('cursor', 'crosshair');
    }
    else {
      this.$el.css('cursor', 'default');
    }
  },

  redrawAllAreas: function() {
    var canvas = this.ui.allAreasCanvas[0];

    canvas.width = this.$el.width();
    canvas.height = this.$el.height();

    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.globalAlpha = 0.5;

    _(this.options.colorMap.components()).each(function(colorMapComponent) {
      if (!this.colorMapComponentIsUsed(colorMapComponent)) {
        colorMapComponent.draw(context, canvas.width);
      }
    }, this);
  },

  colorMapComponentIsUsed: function(colorMapComponent) {
    return this.options.areas.any(function(area) {
      return colorMapComponent.permaId === area.get('mask_perma_id');
    }, this);
  },

  redraw: function() {
    var canvas = this.ui.currentAreaCanvas[0];

    canvas.width = this.$el.width();
    canvas.height = this.$el.height();

    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (this.currentColorMapComponent) {
      this.currentColorMapComponent.draw(context, canvas.width);

      context.globalCompositeOperation = 'source-in';
      this.usePattern(context);
      context.globalAlpha = 0.2;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  },

  drawSelection: function(x, y, width, height) {
    var canvas = this.ui.currentAreaCanvas[0];

    canvas.width = this.$el.width();
    canvas.height = this.$el.height();

    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    this.usePattern(context);
    context.globalAlpha = 0.6;
    context.fillRect(x, y, width, height);
  },

  usePattern: function(context) {
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
});
