import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    {
      name: 'main',
      title: 'Main',
      default: false,
    },
    {
      name: 'data',
      title: 'Data',
      default: false,
    },
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
  ],
  fields: [
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
    defineField({
      name: 'media',
      title: 'Media',
      type: 'mediaArray',
      group: 'content',
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
