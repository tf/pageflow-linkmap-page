pageflow.linkmapPage.AreaItemEmbeddedView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/linkmap_page/editor/templates/embedded/area_item',

  className: 'hover_area',

  ui: {
    hoverImage: '.hover_image',
    visitedImage: '.visited_image'
  },

  events: {
    'linkmapareaclick': function() {
      if (this.$el.is('.editable .hover_area')) {
        this.model.select();
        pageflow.editor.navigate(this.model.editPath(), {trigger: true});
        return false;
      }

      if (this.model.get('target_type') === 'external_site') {
        alert(I18n.t('pageflow.linkmap_page.editor.views.embedded.area_item.external_link_disabled'));
        return false;
      }
    },

    'click .toggle_marker': function() {
      if (this.model.get('marker') === 'dynamic_marker') {
        this.model.set('marker', 'no_marker');
      }
      else {
        this.model.set('marker', 'dynamic_marker');
      }
    },

    'click .action_buttons': function() {
      return false;
    },

    'click .set_mask': function() {
      this.model.selectMask();
    },

    'click .unset_mask': function() {
      this.model.unsetMask();
    },

    'linkmapareaenter': function() {
      this.model.set('highlighted', true);
    },

    'linkmaparealeave': function() {
      this.model.set('highlighted', false);
    },

    'resize': function(event) {
      event.stopPropagation();
    }
  },

  modelEvents: {
    'change': 'update',

    'change:selected': 'updateDraggableAndResizable'
  },

  onRender: function() {
    this.setupImageViews();
    this.setupDraggableAndResizable();
    this.setupAudioPlayer();

    this.listenTo(this.options.colorMap, 'update', this.update);
    this.listenTo(this.options.pageConfiguration, 'change:background_type', this.update);

    this.update();
  },

  setupImageViews: function() {
    var view = this;
    var backgroundImageClassNamePrefix = function() {
      var colorMapComponent = view.getColorMapComponent();
      return colorMapComponent &&
        'pageflow_linkmap_page_masked_image_file_' + colorMapComponent.color;
    };

    var hoverImageView = new pageflow.BackgroundImageEmbeddedView({
      el: this.ui.hoverImage,
      model: this.options.pageConfiguration,
      propertyName: function() {
        return view.getColorMapComponent() ?
          'linkmap_masked_hover_image_id' :
          'hover_image_id';
      },
      backgroundImageClassNamePrefix: backgroundImageClassNamePrefix
    }).render();

    var visitedImageView = new pageflow.BackgroundImageEmbeddedView({
      el: this.ui.visitedImage,
      model: this.options.pageConfiguration,
      propertyName: function() {
        return view.getColorMapComponent() ?
          'linkmap_masked_visited_image_id' :
          'visited_image_id';
      },
      backgroundImageClassNamePrefix: backgroundImageClassNamePrefix
    }).render();

    this.listenTo(this.options.colorMap, 'update', function() {
      hoverImageView.update();
      visitedImageView.update();
    });
  },

  setupDraggableAndResizable: function() {
    var that = this;
    var scroller = this.options.container.$('.scroller');

    this.$el.resizable({
      handles: 'n, e, s, w, ne, se, sw, nw',

      start: function() {
        that.model.set('editing', true);
        scroller.scroller('disable');

      },

      resize: function(event, ui) {
        that.$el.linkmapAreaClip(ui.position);
      },

      stop: function(event, ui) {
        savePositionAndSize();
        scroller.scroller('enable');
        that.model.unset('editing');
      }
    });

    this.$el.draggable({
      iframeFix: true,

      start: function() {
        that.model.set('editing', true);
        scroller.scroller('disable');
      },

      drag: function(event, ui) {
        that.$el.linkmapAreaClip(ui.position);
      },

      stop: function(event, ui) {
        scroller.scroller('enable');
        savePositionAndSize();
        that.model.unset('editing');
      }
    }).css('position', 'absolute');

    this.updateDraggableAndResizable();

    function savePositionAndSize() {
      var element = that.$el;

      that.model.setDimensions(
        parseInt(element.css('left'), 10) / (element.parent().width() / 100),
        parseInt(element.css('top'), 10) / (element.parent().height() / 100),
        parseInt(element.css('width'), 10) / (element.parent().width() / 100),
        parseInt(element.css('height'), 10) / (element.parent().height() / 100)
      );
    }
  },

  updateDraggableAndResizable: function() {
    if (this.model.get('selected')) {
      this.$el.resizable('enable');
    }
    else {
      this.$el.resizable('disable');
    }

    if (this.model.get('selected') && !this.getColorMapComponent()) {
      this.$el.draggable('enable');
    }
    else {
      this.$el.draggable('disable');
    }
  },

  setupAudioPlayer: function() {
    this.$el.linkmapAudioPlayerControls();
  },

  update: function() {
    var audioFileId = this.model.get('target_id');
    var colorMapComponent = this.getColorMapComponent();

    this.$el.attr('data-mask-perma-id', colorMapComponent && colorMapComponent.permaId);
    this.$el.attr('data-audio-file', audioFileId ? audioFileId + '.' + this.cid : '');
    this.$el.attr('data-target-type', this.model.get('target_type'));
    this.$el.attr('data-target-id', this.model.get('target_id'));
    this.$el.attr('data-page-transition', this.model.get('page_transition'));

    this.$el.toggleClass('selected', !!this.model.get('selected'));
    this.$el.toggleClass('highlighted', !!this.model.get('highlighted'));
    this.$el.toggleClass('editing', !!this.model.get('editing'));
    this.$el.toggleClass('without_mask', !colorMapComponent);
    this.$el.toggleClass('with_mask', !!colorMapComponent);

    this.$el.attr('data-width', this.model.get('width'));
    this.$el.attr('data-height', this.model.get('height'));

    this.$el.css('left', this.model.get('left') + '%');
    this.$el.css('top', this.model.get('top') + '%');
    this.$el.css('width', this.model.get('width') + '%');
    this.$el.css('height', this.model.get('height') + '%');

    this.$el.toggleClass('portrait', this.$el.width() <= this.$el.height());
    this.$el.toggleClass('landscape', this.$el.width() > this.$el.height());

    _(['page', 'audio_file', 'external_site', 'text_only']).each(function(type) {
      this.$el.toggleClass(type + '_area', this.model.get('target_type') === type);
    }, this);

    var linkmapMarker = this.$el.find('.linkmap_marker');
    var margin = 32;

    if (this.$el.width() <= this.$el.height()) {
      linkmapMarker.css({
        'width': this.$el.width() - margin,
        'height': this.$el.width() - margin,
      });
    }
    else {
      linkmapMarker.css({
        'width': this.$el.height() - margin,
        'height': this.$el.height() - margin,
      });
    }

    var marker = this.model.get('marker');
    var element = this.$el;
    var that = this;

    var linkTitle = this.$el.find('.link_title');
    var linkDescription = this.$el.find('.link_description');

    linkTitle.html(this.model.get('link_title'));
    linkDescription.html(this.model.get('link_description'));

    _.forEach(pageflow.linkmapPage.markerOptions, function(option) {
      element.toggleClass(option, that.model.get('marker') === option);
    });

    element.toggleClass('inverted', !!this.model.get('inverted'));
  },

  getColorMapComponent: function() {
    return this.options.colorMap.componentByPermaId(
      this.model.get('mask_perma_id')
    );
  }
});