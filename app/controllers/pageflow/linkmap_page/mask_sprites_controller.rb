module Pageflow
  module LinkmapPage
    class MaskSpritesController < ActionController::Base
      respond_to :json

      def create
        image_file = ImageFile.find(params[:image_file_id])

        mask_sprite = MaskSprite
          .create_with(permitted_params)
          .find_or_create_by!(image_file_id: image_file.id)

        respond_with(mask_sprite, location: image_file_mask_sprite_url(image_file, mask_sprite))
      end

      private

      def permitted_params
        params.require(:mask_sprite).permit(:attachment)
      end
    end
  end
end
