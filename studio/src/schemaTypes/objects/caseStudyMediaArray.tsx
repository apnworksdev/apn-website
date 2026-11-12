import {defineArrayMember, defineField, defineType} from 'sanity'

const appearanceFields = [
  defineField({
    name: 'grayscale',
    title: 'Grayscale',
    type: 'boolean',
    initialValue: false,
  }),
  defineField({
    name: 'border',
    title: 'Border',
    type: 'boolean',
    initialValue: false,
  }),
]

/**
 * Case study media. Same as mediaArray, with per-item grayscale and border options.
 */
export default defineType({
  name: 'caseStudyMediaArray',
  title: 'Case Study Media Array',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        }),
        ...appearanceFields,
      ],
    }),
    defineArrayMember({
      type: 'file',
      title: 'Video',
      options: {
        accept: 'video/*',
      },
      fields: [
        defineField({
          name: 'poster',
          title: 'Poster Image',
          type: 'image',
          description: 'Image shown before the video plays',
          options: {
            hotspot: true,
          },
        }),
        ...appearanceFields,
      ],
    }),
  ],
})
