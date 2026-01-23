import {defineArrayMember, defineField, defineType} from 'sanity'
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
      type: 'array',
      of: [defineArrayMember({type: 'textBlock'})],
      validation: (rule) => rule.required().max(3),
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
