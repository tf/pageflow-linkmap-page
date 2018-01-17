class CreateMaskedImageFiles < ActiveRecord::Migration
  def change
    create_table :pageflow_linkmap_page_masked_image_files do |t|
      t.belongs_to :entry, index: true
      t.string     :state
      t.string     :rights
      t.integer    :parent_file_id
      t.string     :parent_file_model_type

      t.belongs_to :source_image_file
      t.belongs_to :color_map_file
      t.string     :attachment_file_name
      t.integer    :processing_progress, default: 0, null: false

      t.timestamps

      t.index([:parent_file_id, :parent_file_model_type],
              name: 'index_masked_image_files_on_parent_id_and_parent_model_type')
    end
  end
end
