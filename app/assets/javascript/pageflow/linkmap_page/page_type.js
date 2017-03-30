pageflow.pageType.register('linkmap_page', _.extend({
  scrollerOptions: {
    freeScroll: true,
    scrollX: true,
    noMouseWheelScrollX: true
  },

  noHideTextOnSwipe: true,

  enhance: function(pageElement, configuration) {
    this.setupPanoramaBackground(pageElement, configuration);
    this.setupHoverImages(pageElement, configuration);
    this.setupVideoPlayer(pageElement);

    this.content = pageElement.find('.scroller');
    this.panorama = pageElement.find('.panorama');

    this.content.linkmapPanorama({
      page: pageElement,
      panorama: function() {
        return pageElement.find('.panorama.active');
      },
      scroller: this.scroller,
      activeAreasSelector: '.linkmap_areas > *',
      limitScrolling: configuration.limit_scrolling,
      addEnvironment: configuration.add_environment,
      marginScrollingDisabled: configuration.margin_scrolling_disabled,
      startScrollPosition: this.getPanoramaStartScrollPosition(configuration)
    });

    this.content.linkmapLookaround({
      scroller: this.scroller,
      marginScrollingDisabled: configuration.margin_scrolling_disabled
    });

    pageElement.find('.linkmap_page').linkmapScrollIndicators({
      scroller: this.scroller
    });

    pageElement.find('.hover_video').linkmapHoverVideo({
      video: pageElement.find('.panorama_video')
    });

    this.linkmapAreas = pageElement.find('.linkmap_areas');
    this.linkmapAreas.linkmap({
      hoverImageUrl: this.linkmapAreas.data('hoverImageUrl'),
      visitedImageUrl: this.linkmapAreas.data('visitedImageUrl'),
      maskImageUrl: this.linkmapAreas.data('maskImageUrl'),

      baseImage: function() {
        return pageElement.find('.panorama.active');
      },

      hoverVideo: pageElement.find('.hover_video').linkmapHoverVideo('instance'),
      hoverVideoEnabled: configuration.background_type === 'hover_video'
    });

    this.setupPageLinkAreas(pageElement);
    this.setupAudioFileAreas(pageElement, configuration);
  },

  getPanoramaStartScrollPosition: function(configuration) {
    function getRatio(attributeName) {
      if (attributeName in configuration) {
        return configuration[attributeName] / 100;
      }
      else {
        return 0.5;
      }
    }

    if (configuration.background_type === 'video') {
      return {
        x: getRatio('panorama_video_x'),
        y: getRatio('panorama_video_y')
      };
    }
    else {
      return {
        x: getRatio('panorama_image_x'),
        y: getRatio('panorama_image_y')
      };
    }
  },

  setupPanoramaBackground: function(pageElement, configuration) {
    pageElement.find('.panorama_image')
      .toggleClass('active', !this.isBackgroundVideoEnabled(configuration));

    pageElement.find('.panorama_video')
      .toggleClass('active', this.isBackgroundVideoEnabled(configuration));
  },

  setupHoverImages: function(pageElement, configuration) {
    pageElement.find('.hover_image')
      .toggle(!this.isHoverVideoEnabled(configuration));
  },

  setupVideoPlayer: function(pageElement) {
    var wrapper = pageElement.find('.panorama_video');
    var template = wrapper.find('[data-template=video]');

    wrapper
      .attr('data-width', template.data('videoWidth'))
      .attr('data-height', template.data('videoHeight'));

    this.videoPlayer = new pageflow.VideoPlayer.Lazy(template, {
      volumeFading: true,

      width: '100%',
      height: '100%'
    });

    wrapper.data('videoPlayer', this.videoPlayer);
  },

  setupPageLinkAreas: function(pageElement) {
    pageElement.on('linkmapareaclick', '[data-target-type="page"]', function(e) {
      var area = $(this);

      pageflow.slides.goToByPermaId(area.data('targetId'), {
        transition: area.data('pageTransition')
      });
    });
  },

  setupAudioFileAreas: function(pageElement, configuration) {
    this.multiPlayer = pageflow.audio.createMultiPlayer({
      playFromBeginning: true,
      fadeDuration: 1000,
      hooks: pageflow.atmo.createMediaPlayerHooks(configuration)
    });

    pageElement.linkmapAudioPlayersController({
      player: this.multiPlayer
    });

    pageElement.find('[data-target-type="audio_file"]').linkmapAudioPlayerControls();
  },

  resize: function(pageElement, configuration) {
    this.content.linkmapPanorama('refresh');
    this.linkmapAreas.linkmap('refresh');
  },

  prepare: function(pageElement, configuration) {
    if (this.isVideoEnabled(configuration)) {
      return this.videoPlayer.ensureCreated();
    }
  },

  unprepare: function(pageElement, configuration) {
    if (this.isVideoEnabled(configuration)) {
      return this.videoPlayer.scheduleDispose();
    }
  },

  linkedPages: function(pageElement, configuration) {
    return _(configuration.linkmap_areas)
      .select(function(area) {
        return area.target_type === 'page';
      })
      .map(function(area) {
        return area.target_id;
      });
  },

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  activating: function(pageElement, configuration) {
    if (this.isVideoEnabled(configuration)) {
      this.playVideo(configuration);
    }

    this.content.linkmapPanorama('refresh');
    this.linkmapAreas.linkmap('refresh');

    this.content.linkmapLookaround('activate');
    this.content.linkmapPanorama('resetScrollPosition');

    this.content.linkmapPanorama('resetAreaHighlighting');
  },

  activated: function(pageElement, configuration) {
    this.content.linkmapPanorama('highlightAreas');
  },

  deactivating: function(pageElement, configuration) {
    this.multiPlayer.pause();

    this.content.linkmapLookaround('deactivate');
  },

  deactivated: function(pageElement, configuration) {
    if (this.isVideoEnabled(configuration)) {
      this.pauseVideo(configuration);
    }
  },

  update: function(pageElement, configuration) {
    this.setupPanoramaBackground(pageElement, configuration.attributes);
    this.updateCommonPageCssClasses(pageElement, configuration);

    this.linkmapAreas.linkmap('updateHoverVideoEnabled', configuration.get('background_type') === 'hover_video');

    this.afterEmbeddedViewsUpdate(function() {
      var minScaling = false;

      this.linkmapAreas.linkmap('option',
                                'hoverImageUrl',
                                configuration.getImageFileUrl('hover_image_id', {
                                  styleGroup: 'panorama'
                                }));
      this.linkmapAreas.linkmap('option',
                                'visitedImageUrl',
                                configuration.getImageFileUrl('visited_image_id', {
                                  styleGroup: 'panorama'
                                }));
      this.linkmapAreas.linkmap('option',
                                'maskImageUrl',
                                configuration.getImageFileUrl('mask_image_id', {
                                  styleGroup: 'panorama'
                                }));

      this.content.linkmapPanorama('update',
                                   configuration.get('add_environment'),
                                   configuration.get('limit_scrolling'),
                                   this.getPanoramaStartScrollPosition(configuration.attributes),
                                   minScaling);

      this.content.linkmapLookaround('update',
                                     configuration.get('margin_scrolling_disabled'));
      this.setupHoverImages(pageElement, configuration.attributes);
      this.updateVideoPlayState(configuration);

      this.linkmapAreas.linkmap('refresh');
      this.scroller.refresh();
    });
  },

  updateVideoPlayState: function(configuration) {
    if (configuration.hasChanged('background_type')) {
      if (this.isVideoEnabled(configuration.attributes)) {
        this.playVideo(configuration.attributes);
      }
      else {
        this.pauseVideo(configuration.attributes);
      }
    }
  },

  afterEmbeddedViewsUpdate: function(fn) {
    setTimeout(_.bind(fn, this), 10);
  },

  isVideoEnabled: function(configuration) {
    return !pageflow.browser.has('mobile platform') &&
      (configuration.background_type === 'video' || configuration.background_type === 'hover_video');
  },

  isBackgroundVideoEnabled: function(configuration) {
    return !pageflow.browser.has('mobile platform') &&
      configuration.background_type === 'video';
  },

  isHoverVideoEnabled: function(configuration) {
    return !pageflow.browser.has('mobile platform') &&
      configuration.background_type === 'hover_video';
  },

  playVideo: function(configuration) {
    var that = this;

    this.videoPlayer.ensureCreated();

    this.prebufferingPromise = this.videoPlayer.prebuffer().then(function() {
      if (configuration.background_type === 'video') {
        that.videoPlayer.playAndFadeIn(1000);
      }
    });
  },

  pauseVideo: function(configuration) {
    this.videoPlayer.fadeOutAndPause(1000);
    this.videoPlayer.scheduleDispose();
  }
}, pageflow.commonPageCssClasses));
