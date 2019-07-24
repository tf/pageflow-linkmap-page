# Deletes orphaned color map files, along with their usages
# and the associated masked image files along with their usages
class DeleteOrphanedGeneratedImageFiles < ActiveRecord::Migration[5.2]
  def up
    Pageflow::LinkmapPage::ColorMapFile.find_each do |color_map_file|
      color_map_file.destroy unless color_map_file.source_image_file.present?
    end
  end
end
