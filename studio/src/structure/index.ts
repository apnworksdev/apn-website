import type {StructureResolver} from 'sanity/structure'

/**
 * Studio Structure Configuration
 * Customizes the left sidebar menu in Sanity Studio
 * Learn more: https://www.sanity.io/docs/structure
 */

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Projects Section
      S.listItem()
        .title('Projects')
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .filter('_type == "project"')
        ),

      S.divider(),

      // All other document types
      ...S.documentTypeListItems().filter(
        (listItem) => !['project'].includes(listItem.getId() as string)
      ),
    ])
