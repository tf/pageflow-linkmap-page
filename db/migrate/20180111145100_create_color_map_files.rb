class CreateColorMapFiles < ActiveRecord::Migration
  def change
    create_table :pageflow_linkmap_page_color_map_files do |t|
      t.belongs_to :entry, index: true
      t.string     :state
      t.string     :rights
      t.integer    :parent_file_id
      t.string     :parent_file_model_type

      t.string  :attachment_file_name
      t.text    :attachment_colors
      t.integer :attachment_width
      t.integer :attachment_height
      t.integer :processing_progress, default: 0, null: false

      t.belongs_to :source_image_file

      t.timestamps

      t.index([:parent_file_id, :parent_file_model_type],
              name: 'index_color_map_files_on_parent_id_and_parent_model_type')
    end
  end
end
