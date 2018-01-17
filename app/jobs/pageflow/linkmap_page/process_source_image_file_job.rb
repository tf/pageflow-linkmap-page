module Pageflow
  module LinkmapPage
    class ProcessSourceImageFileJob < ApplicationJob
      queue_as :resizing

      include StateMachineJob

      def perform_with_result(file, _options)
        file.attachment = file.source_image_file.attachment
        file.save!
        :ok
      end
    end
  end
end
