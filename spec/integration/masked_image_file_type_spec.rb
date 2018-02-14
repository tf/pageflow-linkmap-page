require 'spec_helper'

require 'pageflow/lint'

module Pageflow
  module LinkmapPage
    Pageflow::Lint.file_type(:masked_image_file,
                             create_file_type: -> { LinkmapPage.masked_image_file_type },
                             create_file: -> { create(:masked_image_file) })

    Pageflow::Lint.file_type(:color_map_file,
                             create_file_type: -> { LinkmapPage.color_map_file_type },
                             create_file: -> { create(:color_map_file) })
  end
end
