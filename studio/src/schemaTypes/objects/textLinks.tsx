import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Reusable media array schema that supports both images (with alt text) and video files.
 * Can be used in any document schema that needs media content.
 * 
 * Usage:
 * {
 *    name: 'text',
 *    title: 'Text',
 *    type: 'textLinks',
 * }
 */
export default defineType({
  name: 'textLinks',
  title: 'Text + Links',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [],
      lists: [],
      marks: {
        decorators: [],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
  ],
})
