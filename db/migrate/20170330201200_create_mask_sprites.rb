class CreateMaskSprites < ActiveRecord::Migration[4.2]
  def change
    create_table   :pageflow_linkmap_page_mask_sprites do |t|
      t.belongs_to :image_file
      t.string     :attachment_file_name
      t.string     :attachment_content_type
      t.integer    :attachment_file_size, limit: 8
      t.datetime   :attachment_updated_at
      t.timestamps
    end
  end
end
