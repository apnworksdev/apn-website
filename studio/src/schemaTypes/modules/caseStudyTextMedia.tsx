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
      title: 'Media within text',
      description: 'Optional. Floats inside the text.',
      type: 'caseStudyMediaArray',
      validation: (rule) => rule.max(1),
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
      hidden: ({parent}) => !parent?.media?.length,
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {media?: unknown[]} | undefined
          if (!parent?.media?.length) return true
          return value === 'left' || value === 'right' ? true : 'Choose a side'
        }),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'outsideMedia',
      title: 'Media outside text',
      description: 'Optional. Sits in the margin beside the content block, outside the text.',
      type: 'caseStudyMediaArray',
      validation: (rule) => rule.max(1),
    }),
    defineField({
      name: 'outsidePosition',
      title: 'Outside media position',
      description: 'Which side of the content block.',
      type: 'string',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          {title: 'Left of block', value: 'left'},
          {title: 'Right of block', value: 'right'},
        ],
      },
      initialValue: 'left',
      hidden: ({parent}) => !parent?.outsideMedia?.length,
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {outsideMedia?: unknown[]} | undefined
          if (!parent?.outsideMedia?.length) return true
          return value === 'left' || value === 'right' ? true : 'Choose a side'
        }),
    }),
  ],
  preview: {
    select: {
      text: 'text',
      asset: 'media.0.asset',
      mediaType: 'media.0._type',
      outside: 'outsideMedia',
    },
    prepare({text, asset, mediaType, outside}) {
      const block = text?.[0]
      const snippet =
        block?.children
          ?.map((child: {text?: string}) => child.text)
          .join('')
          .slice(0, 40) || 'Text + media'
      const hasInline = Boolean(asset)
      const hasOutside = Array.isArray(outside) && outside.length > 0
      let subtitle = 'Text'
      if (hasInline && hasOutside) subtitle = 'Text with inline and outside media'
      else if (hasInline) subtitle = 'Text with inline media'
      else if (hasOutside) subtitle = 'Text with outside media'
      return {
        title: snippet,
        subtitle,
        media: mediaType === 'image' && asset ? asset : undefined,
      }
    },
  },
})
