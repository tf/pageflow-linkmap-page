namespace :pageflow_linkmap_page do
  desc 'Migrate to server generated files'
  task migrate_to_masked_image_files: :environment do
    Pageflow::LinkmapPage::MaskedImageFilesMigrator.run
  end
end

module Pageflow
  module LinkmapPage
    module MaskedImageFilesMigrator
      extend self

      def run
        Resque.inline = true
        total = pages_with_mask_image.count

        pages_with_mask_image.find_each.with_index do |page, index|
          puts "== Migrating page #{page.id} (#{index}/#{total})"
          color_map_file = create_files(page)

          if color_map_file
            puts '-- Migrating mask perma ids...'
            migrate_mask_perma_ids(page, color_map_file)
          end

          page.save!
        end
      end

      private

      def create_files(page)
        color_map_image_file =
          ImageFile.find_by_id(page.configuration['linkmap_color_map_image_id'])

        if color_map_image_file
          revision = page.chapter.storyline.revision

          puts "-- Color map file for image file #{color_map_image_file.id}"

          color_map_file = color_map_file_for(color_map_image_file, revision)
          page.configuration['linkmap_color_map_file_id'] = color_map_file.id

          hover_image_file = ImageFile.find_by_id(page.configuration['hover_image_id'])

          if hover_image_file
            puts "-- Masked image file for hover image file #{hover_image_file.id}"

            masked_image_file = masked_image_file_for(hover_image_file, color_map_file, revision)
            page.configuration['linkmap_masked_hover_image_id'] = masked_image_file.id
          end

          visited_image_file = ImageFile.find_by_id(page.configuration['visited_image_id'])

          if visited_image_file
            puts "-- Masked image file for visited image file #{visited_image_file.id}"

            masked_image_file = masked_image_file_for(visited_image_file, color_map_file, revision)
            page.configuration['linkmap_masked_visited_image_id'] = masked_image_file.id
          end

          color_map_file
        end
      end

      def color_map_file_for(image_file, revision)
        color_map_file = ColorMapFile.find_or_create_by(source_image_file_id: image_file.id) do |c|
          c.entry_id = revision.entry_id
        end

        unless color_map_file.processed?
          puts '   Processing...'

          color_map_file.process!
          color_map_file.reload
        end

        revision.file_usages.find_or_create_by(file: color_map_file)
        color_map_file
      end

      def masked_image_file_for(image_file, color_map_file, revision)
        masked_image_file = MaskedImageFile.find_or_create_by(source_image_file: image_file,
                                                              color_map_file: color_map_file) do |m|
          m.entry_id = revision.entry_id
        end

        unless masked_image_file.processed?
          puts '   Processing...'

          masked_image_file.process!
          masked_image_file.reload
        end

        revision.file_usages.find_or_create_by(file: masked_image_file)
        masked_image_file
      end

      def migrate_mask_perma_ids(page, color_map_file)
        areas = page.configuration['linkmap_areas'] || []

        page.configuration['linkmap_areas'] = areas.map do |area_attributes|
          mask_perma_id = area_attributes['mask_perma_id']

          if mask_perma_id && !area_attributes['color_map_component_id']
            sprite_id = page.configuration.fetch('linkmap_masks').fetch('id')
            colors =
              page
              .configuration
              .fetch('linkmap_masks')
              .fetch('c')
              .fetch('c')
              .map { |component| component['c'] }

            area_attributes.merge(color_map_component_id: convert_mask_perma_id(mask_perma_id,
                                                                                colors,
                                                                                color_map_file,
                                                                                sprite_id))
          else
            area_attributes
          end
        end
      end

      def convert_mask_perma_id(perma_id, colors, color_map_file, sprite_id)
        target_sprite_id, color_index = perma_id.split(':')

        if target_sprite_id.to_i == sprite_id
          "#{color_map_file.id}:#{nearest_color(color_map_file, *colors[color_index.to_i])}"
        end
      end

      def nearest_color(color_map_file, r, g, b)
        color_map_file.present_colors.min_by do |color|
          (color[0..1].to_i(16) - r).abs +
            (color[2..3].to_i(16) - g).abs +
            (color[4..5].to_i(16) - b).abs
        end
      end

      def pages_with_mask_image
        Page
          .where(template: 'linkmap_page')
          .where('configuration LIKE "%linkmap_color_map_image_id%"')
          .includes(chapter: {storyline: :revision})
      end
    end
  end
end
