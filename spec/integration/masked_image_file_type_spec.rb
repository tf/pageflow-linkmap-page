require 'spec_helper'

module Pageflow
  module LinkmapPage
    Pageflow::Support::Lint.file_type(:masked_image_file,
                                      create_file_type: -> { LinkmapPage.masked_image_file_type },
                                      create_file: -> { create(:masked_image_file) })

    Pageflow::Support::Lint.file_type(:color_map_file,
                                      create_file_type: -> { LinkmapPage.color_map_file_type },
                                      create_file: -> { create(:color_map_file) })
  end
end
