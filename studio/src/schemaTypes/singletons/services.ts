import {defineArrayMember, defineField, defineType} from 'sanity'
import servicesText from '../modules/servicesText'
import servicesList from '../modules/servicesList'
import service from '../modules/service'
import servicesEnd from '../modules/servicesEnd'

export default defineType({
  name: 'services',
  title: 'Services',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
    }),
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [
        defineArrayMember(servicesText),
        defineArrayMember(servicesList),
        defineArrayMember(service),
        defineArrayMember(servicesEnd),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title || 'Services',
      }
    },
  },
})
