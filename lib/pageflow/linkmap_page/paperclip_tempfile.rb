module Pageflow
  module LinkmapPage
    module PaperclipTempfile
      module_function

      def for(attachment)
        tempfile = Paperclip.io_adapters.for(attachment)

        begin
          yield(tempfile.path)
        ensure
          tempfile.close
          tempfile.unlink
        end
      end
    end
  end
end
