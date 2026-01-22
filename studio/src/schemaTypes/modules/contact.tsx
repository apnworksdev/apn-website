import {defineArrayMember, defineField, defineType} from 'sanity'
import { InboxIcon } from '@sanity/icons'

/**
 * Contact module schema
 * Displays an array of contact items with title and link
 */
export default defineType({
  name: 'contactModule',
  title: 'Contact',
  type: 'object',
  icon: InboxIcon,
  fields: [
    defineField({
      name: 'contacts',
      title: 'Contacts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'string',
              validation: (rule) =>
                rule
                  .required()
                  .custom((value) => {
                    if (!value) return true
                    // Allow http/https URLs
                    if (value.startsWith('http://') || value.startsWith('https://')) {
                      try {
                        new URL(value)
                        return true
                      } catch {
                        return 'Invalid URL format'
                      }
                    }
                    // Allow mailto: links
                    if (value.startsWith('mailto:')) {
                      return true
                    }
                    // Allow relative URLs starting with /
                    if (value.startsWith('/')) {
                      return true
                    }
                    return 'URL must start with http://, https://, mailto:, or /'
                  }),
            }),
            defineField({
              name: 'text',
              title: 'Link Text',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              url: 'url',
              text: 'text',
            },
            prepare({title, url, text}) {
              return {
                title: title || 'Untitled',
                subtitle: text || url,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      contacts: 'contacts',
    },
    prepare({contacts}) {
      const titles = contacts?.map((contact: {title?: string}) => contact?.title || 'Untitled').filter(Boolean) || []
      const count = contacts?.length || 0
      return {
        title: 'Contact',
        subtitle: titles.length > 0 ? titles.join(', ') : `${count} contact${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
