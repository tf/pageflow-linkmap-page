require 'chunky_png'

RSpec::Matchers.define :have_color do |expected_color|
  expected_color =
    if expected_color == :transparent
      ChunkyPNG::Color.parse('#00000000')
    else
      ChunkyPNG::Color.parse(expected_color)
    end

  match do |attachment|
    actual_color(attachment) == expected_color
  end

  failure_message do |attachment|
    "expected image to have pixel with color #{ChunkyPNG::Color.to_hex(expected_color)} " \
      "at #{@position}, but found #{ChunkyPNG::Color.to_hex(actual_color(attachment))}."
  end

  chain :at do |position|
    @position = position
  end

  def actual_color(attachment)
    @actual_color ||= Pageflow::LinkmapPage::PaperclipTempfile.for(attachment) do |path|
      image = ChunkyPNG::Image.from_file(path)

      x = @position.fetch(:left) { image.width - 1 - @position[:right] }
      y = @position.fetch(:top) { image.height - 1 - @position[:bottom] }

      ChunkyPNG::Color.parse(image[x, y])
    end
  end
end
