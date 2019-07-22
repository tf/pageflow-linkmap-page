module Pageflow
  module LinkmapPage
    class ProcessSourceImageFileJob < ApplicationJob
      queue_as :resizing

      include StateMachineJob

      def perform_with_result(file, _options)
        return :error if file.prerequisite_files.any?(&:failed?)
        return :pending unless file.prerequisite_files.all?(&:ready?)

        file.attachment = file.source_image_file.attachment
        file.save!

        :ok
      end
    end
  end
end
