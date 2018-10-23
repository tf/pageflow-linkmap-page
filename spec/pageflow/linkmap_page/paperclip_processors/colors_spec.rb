require 'spec_helper'

module Pageflow
  module LinkmapPage
    module PaperclipProcessors
      describe Colors::ConvertOutput do
        describe '.parse_unique_colors' do
          it 'parses hex colors from output' do
            output = <<-OUTPUT.unindent
              # ImageMagick pixel enumeration: 3,1,255,srgba
              0,0: (246,91,87,1)  #F65B57  srgba(246,91,87,1)
              1,0: (105,167,123,1)  #69A77B  srgba(105,167,123,1)
              2,0: (0,0,0,0)  #00000000  none
            OUTPUT

            result = Colors::ConvertOutput.parse_unique_colors(output)

            expect(result).to eq(%w(69a77b f65b57))
          end
        end

        describe '.parse_trim' do
          it 'parses trimmed dimensions' do
            output = <<-OUTPUT.unindent
              file.png PNG 724x665 1920x1080+606+210 8-bit sRGB 0.010u 0:00.00
            OUTPUT

            result = Colors::ConvertOutput.parse_trim(output)

            expect(result).to eq(left: 606, top: 210, width: 724, height: 665)
          end

          it 'handles empty image output correctly' do
            output = <<-OUTPUT.unindent
              file.png PNG 1x1 1920x1080-1-1 8-bit sRGB 0.010u 0:00.00
            OUTPUT

            result = Colors::ConvertOutput.parse_trim(output)

            expect(result).to eq(left: 0, top: 0, width: 0, height: 0)
          end
        end
      end
    end
  end
end
