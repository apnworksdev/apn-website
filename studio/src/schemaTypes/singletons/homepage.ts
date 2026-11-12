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
      name: 'stamps',
      title: 'Stamps',
      default: false,
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
      name: 'favicon',
      title: 'Favicon',
      description: 'Icon shown in the browser tab. SVG, PNG, or ICO.',
      type: 'file',
      options: {
        accept: 'image/svg+xml,image/png,image/x-icon,image/vnd.microsoft.icon,image/webp',
      },
      group: 'info',
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'blockContent',
      group: 'info',
    }),
    defineField({
      name: 'stamps',
      title: 'Stamps',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'stamp',
          title: 'Stamp',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: [
                  {title: 'Small', value: 'small'},
                  {title: 'Medium', value: 'medium'},
                  {title: 'Large', value: 'large'},
                ],
                layout: 'radio',
              },
              initialValue: 'medium',
            }),
            defineField({
              name: 'top',
              title: 'Top (%)',
              type: 'number',
              initialValue: 0,
            }),
            defineField({
              name: 'side',
              title: 'Side',
              type: 'string',
              options: {
                list: [
                  {title: 'Left', value: 'left'},
                  {title: 'Right', value: 'right'},
                ],
                layout: 'radio',
              },
              initialValue: 'left',
            }),
            defineField({
              name: 'sideOffset',
              title: 'Side Offset (%)',
              type: 'number',
              initialValue: 0,
            }),
          ],
          preview: {
            select: {
              media: 'image',
              size: 'size',
              side: 'side',
            },
            prepare({size, side, media}) {
              const sizeLabel = size === 'small' ? 'Small' : size === 'large' ? 'Large' : 'Medium'
              const sideLabel = side === 'right' ? 'Right' : 'Left'
              return {title: `${sizeLabel} · ${sideLabel}`, media}
            },
          },
        }),
      ],
      group: 'stamps',
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
