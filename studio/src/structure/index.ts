import type {StructureResolver} from 'sanity/structure'
import {HomeIcon, FolderIcon} from '@sanity/icons'

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

      S.divider(),

      // All other document types
      ...S.documentTypeListItems().filter(
        (listItem) => !['project', 'homepage'].includes(listItem.getId() as string)
      ),
    ])
