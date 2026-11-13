import {defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'

export default defineType({
  name: 'servicesEnd',
  title: 'End',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      text: 'text',
    },
    prepare({text}) {
      const block = text?.[0]
      const snippet =
        block?.children
          ?.map((child: {text?: string}) => child.text)
          .join('')
          .slice(0, 60) || 'End'
      return {title: snippet, subtitle: 'End'}
    },
  },
})
