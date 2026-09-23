import {defineField, defineType} from 'sanity'
import {ThLargeIcon} from '@sanity/icons'

export default defineType({
  name: 'caseStudyMediaGrid',
  title: 'Media grid',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [
          {title: '2', value: 2},
          {title: '3', value: 3},
          {title: '4', value: 4},
        ],
      },
      initialValue: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'mediaArray',
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      columns: 'columns',
      media: 'media',
    },
    prepare({columns, media}) {
      const count = media?.length ?? 0
      return {
        title: `Media grid (${count})`,
        subtitle: `${columns || 2} columns`,
      }
    },
  },
})
