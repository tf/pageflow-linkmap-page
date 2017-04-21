pageflow.linkmapPage.NewAreaFileSelectionHandler = function(options) {
  var page = pageflow.pages.get(options.id);

  this.call = function(file) {
    page.configuration.linkmapAreas().addAudioFile(file.id);
    return false;
  };

  this.getReferer = function() {
    return '/pages/' + options.id + '/areas';
  };
};
