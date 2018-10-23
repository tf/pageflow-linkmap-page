class DropMaskSprites < ActiveRecord::Migration[4.2]
  def up
    drop_table :pageflow_linkmap_page_mask_sprites
  end

  def down; end
end
