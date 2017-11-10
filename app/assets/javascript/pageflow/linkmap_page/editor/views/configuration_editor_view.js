pageflow.linkmapPage.ConfigurationEditorView = pageflow.ConfigurationEditorView.extend({
  configure: function() {
    this.tab('general', function() {
      this.input('title', pageflow.TextInputView, {required: true});
    });

    this.tab('files', function() {
      this.input('background_type', pageflow.SelectInputView, {
        values: ['image', 'video', 'hover_video'],
        ensureValueDefined: true
      });

      this.input('panorama_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: true,
        visibleBinding: 'background_type',
        visible: function(backgroundType) {
          return _(['image', 'hover_video']).contains(backgroundType);
        }
      });

      this.input('panorama_video_id', pageflow.FileInputView, {
        collection: pageflow.videoFiles,
        positioning: true,
        visibleBinding: 'background_type',
        visibleBindingValue: 'video'
      });

      this.input('panorama_image_id', pageflow.FileInputView, {
        attributeTranslationKeyPrefixes: ['pageflow.linkmap_page.page_attributes.video_type'],
        collection: pageflow.imageFiles,
        positioning: false,
        visibleBinding: 'background_type',
        visibleBindingValue: 'video'
      });

      this.input('hover_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false,
        visibleBinding: 'background_type',
        visible: function(backgroundType) {
          return _(['image', 'video']).contains(backgroundType);
        }
      });

      this.input('panorama_video_id', pageflow.FileInputView, {
        attributeTranslationKeyPrefixes: ['pageflow.linkmap_page.page_attributes.hover_video_type'],
        collection: pageflow.videoFiles,
        positioning: false,
        visibleBinding: 'background_type',
        visibleBindingValue: 'hover_video'
      });

      this.input('hover_image_id', pageflow.FileInputView, {
        attributeTranslationKeyPrefixes: ['pageflow.linkmap_page.page_attributes.hover_video_type'],
        collection: pageflow.imageFiles,
        positioning: false,
        visibleBinding: 'background_type',
        visibleBindingValue: 'hover_video'
      });

      this.input('linkmap_color_map_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false,
        visibleBinding: 'background_type',
        visible: function(backgroundType) {
          return _(['image', 'video']).contains(backgroundType);
        }
      });

      this.input('visited_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false
      });

      this.input('thumbnail_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false
      });
    });

    this.tab('areas', function() {
      this.view(pageflow.linkmapPage.ScaledOnPhoneHintView, {
        model: this.model.page
      });

      this.view(pageflow.linkmapPage.AreasListView, {
        model: this.model
      });

      this.input('limit_scrolling', pageflow.CheckBoxInputView);
      this.input('add_environment', pageflow.CheckBoxInputView);
      this.input('margin_scrolling_disabled', pageflow.CheckBoxInputView);

      this.input('mobile_panorama_navigation', pageflow.SelectInputView, {
        values: ['free', 'pan_zoom']
      });

      this.input('mobile_info_box_title', pageflow.TextInputView, {
        visibleBinding: 'mobile_panorama_navigation',
        visible: function(navigation) {
          return navigation === 'pan_zoom';
        }
      });
      this.input('mobile_info_box_description', pageflow.TextAreaInputView, {
        size: 'short',
        disableLinks: true,
        visibleBinding: 'mobile_panorama_navigation',
        visible: function(navigation) {
          return navigation === 'pan_zoom';
        }
      });
    });

    this.tab('options', function() {
      this.group('options', {canPauseAtmo: true});
    });
  }
});
