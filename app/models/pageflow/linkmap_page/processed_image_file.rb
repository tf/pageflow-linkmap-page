module Pageflow
  module LinkmapPage
    class ProcessedImageFile < ActiveRecord::Base
      self.abstract_class = true

      include Pageflow::UploadedFile

      belongs_to :source_image_file, class_name: 'Pageflow::ImageFile'

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
          result ok: 'processed'
          result error: 'processing_failed'
        end
      end

      def url
        ''
      end

      def original_url
        ''
      end

      def retry!
        process!
      end

      def publish!
        process!
      end

      def retryable?
        processing_failed?
      end

      def ready?
        processed?
      end

      def basename
        'unused'
      end
    end
  end
end
