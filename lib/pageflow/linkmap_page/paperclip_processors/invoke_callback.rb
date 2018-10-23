module Pageflow
  module LinkmapPage
    module PaperclipProcessors
      class InvokeCallback < Paperclip::Processor
        def make
          attachment.instance.send(options[:callback], options[:style])
          file
        end
      end
    end
  end
end
