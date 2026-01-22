import {defineArrayMember, defineField, defineType} from 'sanity'
import { OlistIcon } from '@sanity/icons'

/**
 * Table of Works module schema
 * Displays a list/table of selected projects
 */
export default defineType({
  name: 'tableOfWorks',
  title: 'Table of Works',
  type: 'object',
  icon: OlistIcon,
  fields: [
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'project'}],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      projectCount: 'projects',
    },
    prepare({title, projectCount}) {
      const count = projectCount?.length || 0
      return {
        title: title || 'Table of Works',
        subtitle: `${count} project${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
