module Pageflow
  module LinkmapPage
    class ProcessSourceImageFileJob
      @queue = :resizing

      extend StateMachineJob

      def self.perform_with_result(file, _options)
        file.attachment = file.source_image_file.attachment
        file.save!
        :ok
      end
    end
  end
end
