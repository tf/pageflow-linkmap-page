require 'spec_helper'

module Pageflow
  module LinkmapPage
    describe Progress do
      it 'reports percentage values after each step' do
        reported_values = []
        progress = Progress.new(steps: 4) do |percent|
          reported_values << percent
        end

        4.times { progress.step }

        expect(reported_values).to eq([25, 50, 75, 100])
      end

      it 'supports dividing a step into sub steps' do
        reported_values = []
        progress = Progress.new(steps: 2) do |percent|
          reported_values << percent
        end

        progress.divide(steps: 4) do |p|
          4.times { p.step }
        end
        progress.divide(steps: 2) do |p|
          2.times { p.step }
        end

        expect(reported_values).to eq([12.5, 25, 37.5, 50, 75, 100])
      end

      it 'supports mixing normal and divided steps' do
        reported_values = []
        progress = Progress.new(steps: 3) do |percent|
          reported_values << percent.round(1)
        end

        progress.step
        progress.divide(steps: 2) do |p|
          2.times { p.step }
        end
        progress.step

        expect(reported_values).to eq([33.3, 50, 66.7, 100])
      end

      it 'calling step to often is ignored' do
        reported_values = []
        progress = Progress.new(steps: 2) do |percent|
          reported_values << percent
        end

        progress.step
        progress.step
        progress.step

        expect(reported_values).to eq([50, 100])
      end

      it 'calling divide when no step is left is ignored' do
        reported_values = []
        progress = Progress.new(steps: 2) do |percent|
          reported_values << percent
        end

        progress.step
        progress.step
        progress.divide(steps: 2) do |p|
          p.step
          p.step
        end

        expect(reported_values).to eq([50, 100])
      end

      it 'ignores calls to step if total steps is 0' do
        reported_values = []
        progress = Progress.new(steps: 0) do |percent|
          reported_values << percent
        end

        progress.step
        progress.step
        progress.step

        expect(reported_values).to eq([])
      end
    end
  end
end
