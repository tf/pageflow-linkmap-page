Pageflow::LinkmapPage::Engine.routes.draw do
  resources :image_files, only: [] do
    resource :mask_sprite, only: [:show, :create]
  end
end
