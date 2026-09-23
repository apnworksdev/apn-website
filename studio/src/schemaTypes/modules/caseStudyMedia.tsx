import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export default defineType({
  name: 'caseStudyMedia',
  title: 'Media',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'fit',
      title: 'Fit',
      description:
        'Inner keeps a fixed width. Outer grows or shrinks to fill leftover column height; width follows the aspect ratio.',
      type: 'string',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          {title: 'Inner', value: 'inner'},
          {title: 'Outer', value: 'outer'},
        ],
      },
      initialValue: 'inner',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'mediaArray',
      validation: (rule) => rule.required().max(1).min(1),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      fit: 'fit',
      mediaType: 'media.0._type',
      asset: 'media.0.asset',
    },
    prepare({fit, mediaType, asset}) {
      return {
        title: 'Media',
        subtitle: fit === 'outer' ? 'Outer' : 'Inner',
        media: mediaType === 'image' && asset ? asset : undefined,
      }
    },
  },
})
