(function($) {
  $.widget('pageflow.linkmapAudioPlayerControls', {
    _create: function() {
      var widget = this;
      var that = this;

      this.wrapper = $('<div />')
        .addClass('linkmap_audio_player_controls')
        .appendTo(this.element.find('.linkmap_marker'));

      this.playButton = $('<div />')
        .addClass('play')
        .appendTo(this.wrapper)
      ;

      this.pauseButton = $('<div />')
        .addClass('pause')
        .appendTo(this.wrapper)
      ;

      this.progressElement = $('<div />')
        .addClass('progress')
        .appendTo(this.wrapper)
      ;

      this.progressElement.html('<div class="audio_inline_progress"><div class="progress_inner"><div class="left_circle"><div class="circle_inner"><div class="circle_innerst"></div></div></div><div class="right_circle"><div class="circle_inner"><div class="circle_innerst"></div></div></div><div class="audio_inline_loading_spinner"><div class="circle_inner"><div class="circle_innerst"></div></div></div></div></div>');

      this.currentTimeElement = $('<div />')
        .addClass('current_time')
        .appendTo(this.wrapper)
      ;

      this.durationElement = $('<div />')
        .addClass('duration')
        .appendTo(this.wrapper)
      ;

      this.playButton.on('click', function(e) {
        widget.element.addClass('loading');
        widget._trigger('play', null, {
          audioFileId: widget.element.data('audioFile')
        });
        e.preventDefault();
        e.stopPropagation();
      });

      this.pauseButton.on('click', function(e) {
        widget._trigger('pause', null, {
          audioFileId: widget.element.data('audioFile')
        });

        e.preventDefault();
        e.stopPropagation();
      });

      this.element.on('click', function() {
        if (!widget.element.hasClass('dynamic_marker')) {
          widget._trigger('play', null, {
            audioFileId: widget.element.data('audioFile')
          });
        }
      });

      this.progressElement.on('click', function(e) {

        var elementCenter = {
          x: $(this).offset().left + $(this).width() / 2,
          y: $(this).offset().top + $(this).height() / 2,
        };

        var angleDeg = Math.atan2(e.pageY - elementCenter.y, e.pageX - elementCenter.x) * 180 / Math.PI;
        var circlePercentage = (angleDeg + 90) / 360;

        circlePercentage = circlePercentage < 0 ? 1 + circlePercentage : circlePercentage;

        widget._trigger('seek', null, {
          positionInPercent: circlePercentage,
          audioFileId: widget.element.data('audioFile')
        });

        e.stopPropagation();
      });
    },

    drawCircle: function(percentage) {
      var rightCircle = this.element.find('.right_circle .circle_inner');
      var leftCircle = this.element.find('.left_circle .circle_inner');
      var rightCircleInner = this.element.find('.right_circle .circle_innerst');
      var leftCircleInner = this.element.find('.left_circle .circle_innerst');



      var rotationRight = Math.min(percentage/100 * 360, 180);
      var rotationLeft = Math.max(percentage/100 * 360 - 180, 0);
      var rotation;

      rotation = rotationRight;
      rightCircle.attr("style", "-webkit-transform: rotate(" + rotation + "deg); -moz-transform: rotate(" + rotation + "deg); -ms-transform: rotate(" + rotation + "deg); -o-transform: rotate(" + rotation + "deg); transform: rotate(" + rotation + "deg)");
      rightCircleInner.attr("style", "-webkit-transform: rotate(" + -rotation + "deg); -moz-transform: rotate(" + -rotation + "deg); -ms-transform: rotate(" + -rotation + "deg); -o-transform: rotate(" + -rotation + "deg); transform: rotate(" + -rotation + "deg)");

      rotation = rotationLeft;
      leftCircle.attr("style", "-webkit-transform: rotate(" + rotation + "deg); -moz-transform: rotate(" + rotation + "deg); -ms-transform: rotate(" + rotation + "deg); -o-transform: rotate(" + rotation + "deg); transform: rotate(" + rotation + "deg)");
      leftCircleInner.attr("style", "-webkit-transform: rotate(" + -rotation + "deg); -moz-transform: rotate(" + -rotation + "deg); -ms-transform: rotate(" + -rotation + "deg); -o-transform: rotate(" + -rotation + "deg); transform: rotate(" + -rotation + "deg)");
    },

    playing: function() {
      this.element.addClass('loading');
    },

    notPlaying: function() {
      this.element.removeClass('playing loading');
    },

    cancelLoading: function() {
      this.element.removeClass('loading');
    },

    updateProgress: function(player) {
      this.element.removeClass('loading');
      this.element.addClass('playing');

      this.currentTimeElement.text(player.formatTime(player.position()));
      this.durationElement.text(player.formatTime(player.duration()));

      var percent = player.duration() > 0 ? player.position() / player.duration() * 100 : 0;
      this.drawCircle(percent);
    },

    refresh: function() {
    }
  });
}(jQuery));