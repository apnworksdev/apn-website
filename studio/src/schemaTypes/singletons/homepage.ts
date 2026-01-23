import {defineArrayMember, defineField, defineType} from 'sanity'
import hero from '../modules/hero'
import tableOfWorks from '../modules/tableOfWorks'
import textModule from '../modules/text'
import contactModule from '../modules/contact'
import dataBox from '../modules/dataBox'
import featuredProject from '../modules/featuredProject'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    {
      name: 'modules',
      title: 'Modules',
      default: true,
    },
    {
      name: 'info',
      title: 'Info',
      default: false,
    },
  ],
  fields: [
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [
        defineArrayMember(hero),
        defineArrayMember(tableOfWorks),
        defineArrayMember(textModule),
        defineArrayMember(contactModule),
        defineArrayMember(dataBox),
        defineArrayMember(featuredProject),
      ],
      group: 'modules',
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'blockContent',
      group: 'info',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title || 'Homepage',
      }
    },
  },
})
