import {defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'

export default defineType({
  name: 'caseStudyText',
  title: 'Text',
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
          .slice(0, 60) || 'Text'
      return {title: snippet, subtitle: 'Text'}
    },
  },
})
