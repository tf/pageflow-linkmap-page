module Pageflow
  module LinkmapPage
    class GeneratedImageFile < ActiveRecord::Base
      self.abstract_class = true

      include Pageflow::ReusableFile

      belongs_to :source_image_file, class_name: 'Pageflow::ImageFile', optional: true

      GEOMETRY = '1920x1080^'.freeze

      state_machine initial: 'not_processed' do
        extend StateMachineJob::Macro

        state 'not_processed'
        state 'processing'
        state 'processed'

        event :process do
          transition 'not_processed' => 'processing'
          transition 'processing_failed' => 'processing'
        end

        job ProcessSourceImageFileJob do
          on_enter 'processing'
          result :pending, retry_after: 3.seconds
          result ok: 'processed'
          result error: 'processing_failed'
        end
      end

      # ReusableFile-overrides:
      def retryable?
        processing_failed?
      end

      def ready?
        processed?
      end

      def failed?
        processing_failed?
      end

      def retry!
        process!
      end

      def publish!
        process!
      end

      def prerequisite_files
        [source_image_file]
      end
    end
  end
end
