import {defineArrayMember, defineField, defineType} from 'sanity'
import { SplitVerticalIcon } from '@sanity/icons'

/**
 * Data Box module schema
 * An array of data boxes with title, textLinks, and size selector
 */
export default defineType({
  name: 'dataBox',
  title: 'Data Box',
  type: 'object',
  icon: SplitVerticalIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Text',
              type: 'textLinks',
            }),
            defineField({
              name: 'columns',
              title: 'Columns',
              type: 'number',
              options: {
                list: [
                  {title: '1', value: 1},
                  {title: '2', value: 2},
                  {title: '3', value: 3},
                  {title: '4', value: 4},
                  {title: '5', value: 5},
                ],
              },
              initialValue: 1,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              columns: 'columns',
            },
            prepare({title, columns}) {
              return {
                title: title || 'Untitled',
                subtitle: `${columns} column${columns !== 1 ? 's' : ''}`,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({items}) {
      const titles = items?.map((item: {title?: string}) => item?.title || 'Untitled').filter(Boolean) || []
      const count = items?.length || 0
      return {
        title: 'Data Box',
        subtitle: titles.length > 0 ? titles.join(', ') : `${count} item${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
