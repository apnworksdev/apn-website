import {defineField, defineType} from 'sanity'
import {InlineIcon} from '@sanity/icons'

export default defineType({
  name: 'caseStudyTextMedia',
  title: 'Text with inline media',
  type: 'object',
  icon: InlineIcon,
  fields: [
    defineField({
      name: 'media',
      title: 'Media',
      type: 'mediaArray',
      validation: (rule) => rule.required().max(1).min(1),
    }),
    defineField({
      name: 'mediaPosition',
      title: 'Media position',
      type: 'string',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          {title: 'Left of text', value: 'left'},
          {title: 'Right of text', value: 'right'},
        ],
      },
      initialValue: 'left',
      validation: (rule) => rule.required(),
    }),
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
          .slice(0, 40) || 'Text + media'
      return {title: snippet, subtitle: 'Text with inline media'}
    },
  },
})
