pageflow.linkmapPage.AreaOutlineEmbeddedView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/linkmap_page/editor/templates/embedded/area_outlines',

  className: 'linkmap_area_outlines',

  ui: {
    canvasWrapper: '.linkmap_area_outlines-canvas_wrapper',
    canvas: 'canvas',
  },

  onRender: function() {
    this.listenTo(this.model, 'change:background_type', this.redraw);
    this.listenTo(this.options.colorMap, 'update', this.redraw);
    this.listenTo(this.options.area, 'change:highlighted change:dimensions change:editing', this.redraw);
    this.listenTo(pageflow.app, 'resize', this.redraw);

    this.listenTo(this.model.page, 'change:areas_outlined', this.update);
    this.listenTo(pageflow.entry, 'change:emulation_mode', this.update);
    this.update();
  },

  update: function() {
    this.$el.toggle(!!this.model.page.get('areas_outlined') && !pageflow.entry.has('emulation_mode'));
    this.redraw();
  },

  redraw: function() {
    var area = this.options.area;
    var canvas = this.ui.canvas[0];

    var colorMapComponent = this.options.colorMap.componentByPermaId(area.get('mask_perma_id'));

    if (colorMapComponent) {
      var attributes = colorMapComponent.areaAttributes();

      this.ui.canvas.css({
        left: this.ui.canvasWrapper.width() * attributes.left / 100,
        top: this.ui.canvasWrapper.height() * attributes.top / 100
      });

      canvas.width = this.ui.canvasWrapper.width() * attributes.width / 100;
      canvas.height = this.ui.canvasWrapper.height() * attributes.height / 100;
    }
    else {
      this.ui.canvas.css({
        left: 0,
        top: 0
      });

      canvas.width = this.$el.width();
      canvas.height = this.$el.height();
    }

    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!area.get('editing')) {
      this.drawArea(context, area);

      context.globalCompositeOperation = 'source-in';
      pageflow.linkmapPage.areaPattern.use(context);

      if (area.get('highlighted')) {
        context.globalAlpha = 0.4;
      }
      else {
        context.globalAlpha = 0.2;
      }

      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  },

  drawArea: function(context, area) {
    var canvas = context.canvas;
    var colorMapComponent = this.options.colorMap.componentByPermaId(area.get('mask_perma_id'));

    if (colorMapComponent) {
      colorMapComponent.draw(context, canvas.width);
    }
    else {
      context.fillRect(0,
                       0,
                       canvas.width,
                       canvas.height);
    }
  }
});