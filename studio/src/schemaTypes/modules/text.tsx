import {defineField, defineType} from 'sanity'
import { TextIcon } from '@sanity/icons'

export default defineType({
  name: 'textModule',
  title: 'Text',
  type: 'object',
  icon: TextIcon,
  fields: [
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
          {title: '1 Column', value: 1},
          {title: '2 Columns', value: 2},
          {title: '3 Columns', value: 3},
        ],
      },
      initialValue: 1,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Justify', value: 'justify'},
          {title: 'Center', value: 'center'},
        ],
        layout: 'radio',
      },
      initialValue: 'justify',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      columns: 'columns',
      alignment: 'alignment',
    },
    prepare({columns, alignment}) {
      return {
        title: 'Text',
        subtitle: `${columns} column${columns !== 1 ? 's' : ''} • ${alignment}`,
      }
    },
  },
})
