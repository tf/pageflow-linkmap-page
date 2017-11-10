pageflow.pageType.register('linkmap_page', _.extend({
  scrollerOptions: {
    freeScroll: true,
    scrollX: true,
    noMouseWheelScrollX: true
  },

  noHideTextOnSwipe: true,

  enhance: function(pageElement, configuration) {
    var that = this;

    this.setupPanoramaBackground(pageElement, configuration);
    this.setupHoverImages(pageElement, configuration);
    this.setupVideoPlayer(pageElement);

    this.content = pageElement.find('.scroller');
    this.panorama = pageElement.find('.panorama');

    this.content.linkmapPanorama({
      disabled: true,

      page: pageElement,
      panorama: function() {
        return pageElement.find('.panorama.active');
      },
      scroller: this.scroller,
      activeAreasSelector: '.linkmap_areas > .hover_area',
      limitScrolling: configuration.limit_scrolling,
      minScaling: pageflow.browser.has('mobile platform'),
      addEnvironment: configuration.add_environment,
      marginScrollingDisabled: configuration.margin_scrolling_disabled,
      startScrollPosition: this.getPanoramaStartScrollPosition(configuration)
    });

    this.content.linkmapPanZoom({
      disabled: false,

      page: pageElement,
      safeAreaWrapper: pageElement.find('.pan_zoom_safe_area_wrapper'),
      panoramaWrapper: pageElement.find('.panorama_wrapper'),
      panorama: function() {
        return pageElement.find('.panorama.active');
      },
      areas: function() {
        return pageElement.find('.hover_area');
      },
      scroller: this.scroller,
      innerScrollerElement: pageElement.find('.linkmap'),
      initialPosition: this.getPanoramaStartScrollPosition(configuration)
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
      maskSpriteUrlTemplate: this.linkmapAreas.data('maskSpriteUrlTemplate'),
      masksData: configuration.linkmap_masks,

      baseImage: function() {
        return pageElement.find('.panorama.active');
      },

      parentScale: function() {
        return that.content.linkmapPanZoom('getCurrentScale');
      },

      hoverVideo: pageElement.find('.hover_video').linkmapHoverVideo('instance'),
      hoverVideoEnabled: configuration.background_type === 'hover_video'
    });

    this.mobileInfoBox = pageElement.find('.linkmap-paginator');
    this.mobileInfoBox.linkmapPaginator({
      disabled: false,

      scrollerEventListenerTarget: this.content,

      change: function(currentPageIndex) {
        that.content.linkmapPanZoom('setBottomMarginFor', {
          areaIndex: currentPageIndex - 1,
          hiddenHeight: that.mobileInfoBox.linkmapPaginator('getCurrentHeight')
        });

        that.content.linkmapPanZoom('goToAreaByIndex', currentPageIndex - 1);

        if (currentPageIndex > 0) {
          that.scrollIndicator.disable();
          that.mobileInfoBox.linkmapPaginator('showDots');
        }
        else {
          that.scrollIndicator.enable();
          that.mobileInfoBox.linkmapPaginator('hideDots');
        }
      },

      changing: function(options) {
        that.content.linkmapPanZoom('transitionBottomMargin', {
          from: {
            areaIndex: options.currentPageIndex - 1,
            hiddenHeight: options.currentHeight
          },
          to: {
            areaIndex: options.destinationPageIndex - 1,
            hiddenHeight: options.destinationHeight
          },
          progress: options.progress
        });
      }
    });

    pageElement.data('invertIndicator', false);

    this.setupPageLinkAreas(pageElement);
    this.setupExternalLinkAreas(pageElement);
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

  setupExternalLinkAreas: function(pageElement) {
    pageElement.on('linkmapareaclick', '[data-target-type="external_site"]', function(e) {
      var area = $(this);

      if (area.attr('target')) {
        window.open(area.attr('href'), area.attr('target'));
      }
      else {
        window.location.href = area.attr('href');
      }
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
    this.content.linkmapPanZoom('refresh');
    this.linkmapAreas.linkmap('refresh');
    this.mobileInfoBox.linkmapPaginator('refresh');
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
    this.content.linkmapPanZoom('refresh');
    this.linkmapAreas.linkmap('refresh');
    this.mobileInfoBox.linkmapPaginator('refresh');

    this.content.linkmapLookaround('activate');
    this.content.linkmapPanorama('resetScrollPosition');
    this.mobileInfoBox.linkmapPaginator('initScrollPosition');

    this.content.linkmapPanorama('resetAreaHighlighting');
  },

  activated: function(pageElement, configuration) {
    this.scrollIndicator.disable();
    this.content.linkmapPanorama('highlightAreas');
  },

  deactivating: function(pageElement, configuration) {
    this.multiPlayer.pause();

    this.content.linkmapLookaround('deactivate');
  },

  deactivated: function(pageElement, configuration) {
    this.mobileInfoBox.linkmapPaginator('showDots');

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
                                'masksData',
                                configuration.get('linkmap_masks'));

      this.content.linkmapPanorama('update',
                                   configuration.get('add_environment'),
                                   configuration.get('limit_scrolling'),
                                   this.getPanoramaStartScrollPosition(configuration.attributes),
                                   minScaling);

      this.content.linkmapPanZoom('update', {
        initialPosition: this.getPanoramaStartScrollPosition(configuration.attributes)
      });

      this.updateScaledOnPhoneFlags(configuration.page,
                                    this.content.linkmapPanorama('instance'));

      this.content.linkmapLookaround('update',
                                     configuration.get('margin_scrolling_disabled'));
      this.setupHoverImages(pageElement, configuration.attributes);
      this.updateVideoPlayState(configuration);

      this.linkmapAreas.linkmap('refresh');
      this.scroller.refresh();
    });
  },

  updateScaledOnPhoneFlags: function(page, panorama) {
    page.set('scaled_on_portrait_phone',
             panorama.getPanoramaSize({
               pageWidth: 360,
               pageHeight: 640,
               minScaling: true
             }).scaled);

    page.set('scaled_on_landscape_phone',
             panorama.getPanoramaSize({
               pageWidth: 640,
               pageHeight: 360,
               minScaling: true
             }).scaled);
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
