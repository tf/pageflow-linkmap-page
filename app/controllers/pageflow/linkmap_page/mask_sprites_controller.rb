module Pageflow
  module LinkmapPage
    class MaskSpritesController < Pageflow::ApplicationController
      respond_to :json

      before_action :authenticate_user!

      def create
        image_file = ImageFile.find(params[:image_file_id])
        authorize!(:update, image_file)

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
