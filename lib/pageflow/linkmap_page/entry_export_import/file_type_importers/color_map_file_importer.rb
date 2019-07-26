module Pageflow
  module LinkmapPage
    module EntryExportImport
      module FileTypeImporters
        class ColorMapFileImporter
          def self.import_file(file_data, file_mappings)
            update_association_ids(file_data, file_mappings)
            ColorMapFile.create!(file_data.except('id',
                                                    'state',
                                                    'processing_progress',
                                                    'updated_at'))
          end

          def self.update_association_ids(file_data, file_mappings)
            return unless file_data['source_image_file_id'].present?
            source_image_file_id = Pageflow::EntryExportImport::ImportUtils.file_id_for_exported_id(
              file_mappings,
              'Pageflow::ImageFile',
              file_data['source_image_file_id']
            )

            file_data['source_image_file_id'] = source_image_file_id
          end

          def self.publish_files(entry)
            entry_color_map_files = entry.draft.find_files(Pageflow::LinkmapPage::ColorMapFile)
            if entry.published?
              entry_color_map_files += entry.published_revision
                                            .find_files(Pageflow::LinkmapPage::ColorMapFile)
            end
            entry_color_map_files.uniq(&:id).each do |color_map_file|
              color_map_file.publish!
            end
          end
        end
      end
    end
  end
end
