import type {StructureResolver} from 'sanity/structure'
import {HomeIcon, FolderIcon, IceCreamIcon} from '@sanity/icons'

/**
 * Studio Structure Configuration
 * Customizes the left sidebar menu in Sanity Studio
 * Learn more: https://www.sanity.io/docs/structure
 */

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Projects
      S.listItem()
        .title('Projects')
        .icon(FolderIcon)
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .filter('_type == "project"')
        ),

      S.divider(),

      // Homepage
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
        ),

      // Featured Carousel
      S.listItem()
        .title('Featured Carousel')
        .icon(IceCreamIcon)
        .child(
          S.document()
            .schemaType('featuredCarousel')
            .documentId('featuredCarousel')
        ),

      S.divider(),

      // All other document types
      ...S.documentTypeListItems().filter(
        (listItem) => !['project', 'homepage', 'featuredCarousel'].includes(listItem.getId() as string)
      ),
    ])
