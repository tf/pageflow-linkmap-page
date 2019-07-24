module Pageflow
  module LinkmapPage
    module EntryExportImport
      module FileTypeImporters
        class MaskedImageFileImporter
          def self.import_file(file_data)
            MaskedImageFile.create!(file_data.except('id',
                                                     'state',
                                                     'source_image_file_id',
                                                     'color_map_file_id',
                                                     'processing_progress',
                                                     'updated_at'))
          end

          def self.update_association_ids(file_data, file_mappings)
            masked_image_file = Pageflow::EntryExportImport::ImportUtils.find_file_by_exported_id(
              file_mappings,
              'Pageflow::LinkmapPage::MaskedImageFile',
              file_data['id']
            )

            source_image_file = Pageflow::EntryExportImport::ImportUtils.find_file_by_exported_id(
              file_mappings,
              'Pageflow::ImageFile',
              file_data['source_image_file_id']
            )

            color_map_file = Pageflow::EntryExportImport::ImportUtils.find_file_by_exported_id(
              file_mappings,
              'Pageflow::LinkmapPage::ColorMapFile',
              file_data['color_map_file_id']
            )

            masked_image_file.update!(
              source_image_file_id: source_image_file.id,
              color_map_file_id: color_map_file.id
            )
          end
        end
      end
    end
  end
end