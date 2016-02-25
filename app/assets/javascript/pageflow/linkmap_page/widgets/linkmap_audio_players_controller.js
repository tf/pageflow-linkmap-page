(function($) {
  $.widget('pageflow.linkmapAudioPlayersController', {
    _create: function() {
      var player = this.options.player;
      var element = this.element;

      this.delegatePlayerEvent('play', 'playing');
      this.delegatePlayerEvent('pause ended', 'notPlaying');
      this.delegatePlayerEvent('timeupdate', 'updateProgress');

      player.on('play', function(options) {
        var playerElements = element.find('[data-target-type="audio_file"]');

        playerElements.each(function() {
          var playerElement = $(this);

          if (playerElement.data('audioFile') !== options.audioFileId) {
            playerElement.linkmapAudioPlayerControls('cancelLoading');
          }
        });
      });

      this.element.on('linkmapaudioplayercontrolsplay', function(event, options) {
        player.play(options.audioFileId);
      });

      this.element.on('linkmapaudioplayercontrolspause', function(event, options) {
        player.pause();
      });

      this.element.on('linkmapaudioplayercontrolsseek', function(event, options) {
        player.seek(player.duration() * options.positionInPercent);
      });
    },

    delegatePlayerEvent: function (event, method) {
      var element = this.element;
      var player = this.options.player;

      player.on(event, function(options) {
        var selector = '[data-audio-file="' + options.audioFileId + '"]';
        var playerElement = element.find(selector);

        playerElement.linkmapAudioPlayerControls(method, player);
      });
    }
  });
}(jQuery));