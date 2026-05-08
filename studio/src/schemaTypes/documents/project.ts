import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    {
      name: 'main',
      title: 'Main',
      default: true,
    },
    {
      name: 'data',
      title: 'Data',
      default: false,
    },
    {
      name: 'content',
      title: 'Content',
      default: false,
    },
  ],
  fields: [
    // Main
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
      group: 'main',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'main',
      options: {
        list: [
          {title: 'Live', value: 'live'},
          {title: 'In Progress', value: 'in-progress'},
          {title: 'Modified by Client', value: 'modified-by-client'},
        ],
      },
      initialValue: 'live',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'mediaArray',
      validation: (rule) => rule.max(1),
      group: 'main',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'main',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 2,
      group: 'main',
    }),

    // Data
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      group: 'data',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      group: 'data',
    }),
    defineField({
      name: 'designedBy',
      title: 'Designed by',
      type: 'string',
      group: 'data',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'data',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'string',
      group: 'data',
    }),
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      type: 'string',
      group: 'data',
    }),
    defineField({
      name: 'typeface',
      title: 'Typeface',
      type: 'string',
      group: 'data',
    }),
    defineField({
      name: 'animationBy',
      title: 'Animation By',
      type: 'string',
      group: 'data',
    }),
    defineField({
      name: 'customCredits',
      title: 'Custom Credits',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'credit',
              title: 'Credit',
              type: 'string',
            }),
            defineField({
              name: 'text',
              title: 'Text',
              type: 'textLinks',
            }),
          ],
        }),
      ],
      group: 'data',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'textLinks',
      group: 'data'
    }),

    // Content
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      group: 'content',
      initialValue: 'regular',
      options: {
        layout: 'radio',
        list: [
          {title: 'Regular', value: 'regular'},
          {title: 'Extended', value: 'extended'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'regularMedia',
      title: 'Media',
      type: 'mediaArray',
      group: 'content',
      hidden: ({document}) => document?.projectType !== 'regular',
    }),
    defineField({
      name: 'extendedMedia',
      title: 'Extended Media',
      type: 'mediaArray',
      group: 'content',
      hidden: ({document}) => document?.projectType !== 'extended',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
