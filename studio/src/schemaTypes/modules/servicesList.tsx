import {defineArrayMember, defineField, defineType} from 'sanity'
import {OlistIcon} from '@sanity/icons'

export default defineType({
  name: 'servicesList',
  title: 'Services',
  type: 'object',
  icon: OlistIcon,
  fields: [
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'serviceItem',
          title: 'Service',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Text',
              type: 'blockContent',
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare({title}) {
              return {title: title || 'Untitled service'}
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      services: 'services',
    },
    prepare({services}) {
      const titles =
        services
          ?.map((item: {title?: string}) => item?.title)
          .filter(Boolean) || []
      const count = services?.length || 0
      return {
        title: 'Services',
        subtitle:
          titles.length > 0
            ? titles.join(', ')
            : `${count} service${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
