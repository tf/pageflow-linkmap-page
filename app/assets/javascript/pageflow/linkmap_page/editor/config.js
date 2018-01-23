pageflow.editor.fileTypes.register('pageflow_linkmap_page_color_map_files', {
  model: pageflow.linkmapPage.ColorMapFile,

  matchUpload: function(upload) {
    return false;
  }
});

pageflow.editor.fileTypes.register('pageflow_linkmap_page_masked_image_files', {
  model: pageflow.linkmapPage.MaskedImageFile,

  matchUpload: function(upload) {
    return false;
  }
});

pageflow.editor.pageTypes.register('linkmap_page', {
  configurationEditorView: pageflow.linkmapPage.ConfigurationEditorView,

  embeddedViews: {
    '.scroller': {
      view: pageflow.linkmapPage.PanoramaEmbeddedView,
      options: {
        disableMarginScrollingPropertyName: 'areas_editable'
      }
    },

    '.panorama_image': {
      view: pageflow.BackgroundImageEmbeddedView,
      options: {
        propertyName: 'panorama_image_id',
        dataSizeAttributes : true
      }
    },

    '.panorama_video': {
      view: pageflow.LazyVideoEmbeddedView,
      options: {
        propertyName: 'panorama_video_id',
        dataSizeAttributes: true
      }
    },

    '.linkmap_areas': {
      view: pageflow.linkmapPage.AreasEmbeddedView
    },

    '.fixed_background': {
      view: pageflow.BackgroundImageEmbeddedView,
      options: {propertyName: 'fixed_background_image_id'}
    }
  },

  pageLinks: function(configuration) {
    return configuration.linkmapPageLinks();
  }
});

pageflow.editor.registerPageConfigurationMixin(pageflow.linkmapPage.pageConfigurationMixin);

pageflow.editor.registerFileSelectionHandler('linkmapPage.area', pageflow.linkmapPage.AreaFileSelectionHandler);
pageflow.editor.registerFileSelectionHandler('linkmapPage.newArea', pageflow.linkmapPage.NewAreaFileSelectionHandler);

pageflow.editor.registerSideBarRouting({
  router: pageflow.linkmapPage.SideBarRouter,
  controller: pageflow.linkmapPage.SideBarController
});
