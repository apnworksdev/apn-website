import {defineField, defineType} from 'sanity'
import { EyeOpenIcon } from '@sanity/icons'

/**
 * Hero module schema
 * A reusable hero section that can be added to pages
 */
export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: EyeOpenIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
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
    defineField({
      name: 'text',
      title: 'Text',
      type: 'blockContent',
    }),
    defineField({
      name: 'disclaimer',
      title: 'Disclaimer',
      type: 'blockContent',
    }),
  ],
  preview: {
    prepare() {
      return { 
        title: 'Apn',
      }
    },
  },
})
