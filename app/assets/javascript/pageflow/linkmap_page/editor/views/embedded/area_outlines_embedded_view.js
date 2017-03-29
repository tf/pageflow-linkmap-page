pageflow.linkmapPage.AreaOutlinesEmbeddedView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/linkmap_page/editor/templates/embedded/area_outlines',

  className: 'linkmap_area_outlines',

  ui: {
    allAreasCanvas: 'canvas.all',
    highlightedAreaCanvas: 'canvas.highlighted'
  },

  onRender: function() {
    this.listenTo(this.options.masks, 'update', this.redrawAll);
    this.listenTo(this.options.areas, 'change:highlighted', this.redrawHighlighted);
    this.listenTo(this.options.areas, 'change:dimensions change:editing add remove', this.redraw);
    this.listenTo(pageflow.app, 'resize', this.redraw);

    this.listenTo(this.model.page, 'change:areas_outlined', function() {
      this.$el.toggle(!!this.model.page.get('areas_outlined'));
    });

    this.$el.toggle(!!this.model.page.get('areas_outlined'));
  },

  maskFromPoint: function(event) {
    return this.options.masks.atPoint(event.offsetX / this.$el.width(),
                                      event.offsetY / this.$el.height());
  },

  redraw: function() {
    this.redrawAll();
    this.redrawHighlighted();
  },

  redrawAll: function() {
    var canvas = this.ui.allAreasCanvas[0];

    canvas.width = this.$el.width();
    canvas.height = this.$el.height();

    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    this.options.areas.each(function(area) {
      if (!area.get('editing')) {
        this.drawArea(context, area);
      }
    }, this);

    if (this.options.areas.length) {
      context.globalCompositeOperation = 'source-in';

      this.usePattern(context);

      context.globalAlpha = 0.2;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  },

  redrawHighlighted: function() {
    var canvas = this.ui.highlightedAreaCanvas[0];

    canvas.width = this.$el.width();
    canvas.height = this.$el.height();

    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    var highlightedArea = this.options.areas.detect(function(area) {
      return area.get('highlighted');
    });

    if (highlightedArea && !highlightedArea.get('editing')) {
      this.drawArea(context, highlightedArea);

      context.globalCompositeOperation = 'source-in';
      this.usePattern(context);

      context.globalAlpha = 0.4;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  },

  drawArea: function(context, area) {
    var canvas = context.canvas;
    var mask = this.options.masks.findByPermaId(area.get('mask_perma_id'));

    if (mask) {
      mask.draw(context, 0, 0, canvas.width);
    }
    else {
      context.fillRect(area.get('left') * canvas.width / 100,
                       area.get('top') * canvas.height / 100,
                       area.get('width') * canvas.width / 100,
                       area.get('height') * canvas.height / 100);
    }
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