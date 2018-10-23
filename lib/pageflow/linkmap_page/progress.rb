module Pageflow
  module LinkmapPage
    class Progress
      def initialize(steps:, &block)
        @total_steps = steps
        @block = block
        @counter = 0
      end

      def step
        return if counter >= total_steps
        @counter += 1
        report(current_percent)
      end

      def divide(steps:)
        return if counter >= total_steps

        sub_progress = Progress.new(steps: steps) do |percent|
          if percent == 100
            step
          else
            report(current_percent + percent / total_steps)
          end
        end

        yield sub_progress
      end

      private

      attr_reader :block, :total_steps, :counter

      def current_percent
        100.0 / total_steps * counter
      end

      def report(percent)
        @block.call(percent)
      end
    end
  end
end
