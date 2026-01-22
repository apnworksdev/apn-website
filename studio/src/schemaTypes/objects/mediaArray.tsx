import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Reusable media array schema that supports both images (with alt text) and video files.
 * Can be used in any document schema that needs media content.
 * 
 * Usage:
 * {
 *   name: 'media',
 *   title: 'Media',
 *   type: 'mediaArray'
 * }
 */
export default defineType({
  name: 'mediaArray',
  title: 'Media Array',
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
      ],
    }),
    defineArrayMember({
      type: 'file',
      title: 'Video',
      options: {
        accept: 'video/*',
      },
    }),
  ],
})
