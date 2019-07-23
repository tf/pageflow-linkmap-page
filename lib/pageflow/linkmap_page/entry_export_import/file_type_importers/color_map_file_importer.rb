module Pageflow
  module LinkmapPage
    module EntryExportImport
      module FileTypeImporters
        class ColorMapFileImporter
          def self.import_file(file_data)
            ColorMapFile.create!(file_data.except('id',
                                                  'state',
                                                  'processing_progress',
                                                  'source_image_file_id',
                                                  'updated_at'))
          end

          def self.update_association_ids(file_data, file_mappings)
            color_map_file =  Pageflow::EntryExportImport::ImportUtils.find_file_by_exported_id(
              file_mappings,
              'Pageflow::LinkmapPage::ColorMapFile',
              file_data['id']
            )

            source_image_file = Pageflow::EntryExportImport::ImportUtils.find_file_by_exported_id(
              file_mappings,
              'Pageflow::ImageFile',
              file_data['source_image_file_id']
            )

            if source_image_file
              color_map_file.update!(source_image_file_id: source_image_file.id)
            end
          end
        end
      end
    end
  end
end
