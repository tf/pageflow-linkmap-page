module Pageflow
  module LinkmapPage
    class MaskSprite < ActiveRecord::Base
      belongs_to :image_file

      has_attached_file :attachment, Pageflow.config.paperclip_s3_default_options

      do_not_validate_attachment_file_type :attachment

      def as_json(*)
        super(only: [:id])
      end
    end
  end
end
