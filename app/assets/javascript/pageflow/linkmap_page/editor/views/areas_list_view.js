pageflow.linkmapPage.AreasListView = Backbone.Marionette.View.extend({
  className: 'linkmap_page_areas_list',

  render: function() {
    this.appendSubview(new pageflow.ListView({
      label: I18n.t('pageflow.linkmap_page.editor.views.areas_list.label'),
      collection: this.model.linkmapAreas(),
      highlight: true,

      onEdit: function(model) {
        pageflow.editor.navigate(model.editPath(), {trigger: true});
      },

      itemDescription: function(area) {
        return area.label();
      },

      itemTypeName: function(area) {
        return {
          'audio_file': 'audio',
          'page': 'internal_links_list',
          'external_site': 'external_links',
          'text_only': 'text_only'
        }[area.get('target_type')];
      },

      itemTypeDescription: function(area) {
        return I18n.t('pageflow.linkmap_page.editor.area_types.' + area.get('target_type'));
      },

      itemIsInvalid: function(area) {
        return !area.target() && area.get('target_type') !== 'text_only';
      },
    }));

    this.appendSubview(new pageflow.DropDownButtonView({
      sortable: true,
      label: I18n.t('pageflow.linkmap_page.editor.views.areas_list.add'),
      items: pageflow.linkmapPage.areaTypesFor(this.model)
    }));

    return this;
  }
});