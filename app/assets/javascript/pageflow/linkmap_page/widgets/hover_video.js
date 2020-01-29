(function($) {
  $.widget('pageflow.linkmapHoverVideo', {
    activate: function() {
      var video = this.options.video;

      if (!this.hoverVideoParent) {
        this.hoverVideoParent = video.parent();
        video.appendTo(this.element);
      }
    },

    deactivate: function() {
      var video = this.options.video;

      if (this.hoverVideoParent) {
        video.prependTo(this.hoverVideoParent);
        this.hoverVideoParent = null;

        video.css({
          left: 'auto',
          top: 'auto',
          width: 'auto',
          height: 'auto'
        });
      }
    },

    schedulePlay: function(options) {
      if (this.currentArea !== options.area) {
        clearTimeout(this.playTimeout);

        this.currentArea = options.area;
        this.playTimeout = setTimeout(_.bind(function() {
          this.play(options);
        }, this), 500);
      }
    },

    play: function(options) {
      var video = this.options.video;
      var position = {
        left: options.area.prop('offsetLeft'),
        top: options.area.prop('offsetTop')
      };

      video
        .width(options.baseImage.width())
        .height(options.baseImage.height());

      this.element
        .css({
          left: position.left + 'px',
          top: position.top + 'px'
        })
        .width(options.area.width())
        .height(options.area.height());

      this.element.linkmapAreaClip(position);

      var videoPlayer = video.data('videoPlayer');
      videoPlayer.play();

      this.element.addClass('playing');
    },

    pause: function() {
      clearTimeout(this.playTimeout);
      this.currentArea = null;

      var videoPlayer = this.options.video.data('videoPlayer');

      setTimeout(function() {
        videoPlayer.currentTime(0);
        videoPlayer.pause();
      }, 300);

      this.element.removeClass('playing');
    },

    unmute: function () {
      var videoPlayer = this.options.video.data('videoPlayer');
      videoPlayer.muted(false);
    }
  });
}(jQuery));