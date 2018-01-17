json.call(color_map_file, :width, :height, :sprite_url)

json.components do
  color_map_file.present_colors.inject(0) do |sprite_offset, color|
    bounding_box = color_map_file.bounding_box_for_color(color)

    json.set!(color) do
      json.color(color)
      json.sprite_offset(sprite_offset)
      json.top(bounding_box[:top])
      json.left(bounding_box[:left])
      json.width(bounding_box[:width])
      json.height(bounding_box[:height])
    end

    sprite_offset + bounding_box[:width]
  end
end
