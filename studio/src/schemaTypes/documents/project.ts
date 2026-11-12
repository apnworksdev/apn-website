import {defineArrayMember, defineField, defineType} from 'sanity'
import caseStudyContentBlock from '../modules/caseStudyContentBlock'
import caseStudySeparator from '../modules/caseStudySeparator'

const isCaseStudyLayout = ({document}: {document?: {layout?: string}}) =>
  document?.layout === 'caseStudy'

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
      name: 'listOnly',
      title: 'No inner page',
      description: 'Show this project in the table of works without a link or a project page.',
      type: 'boolean',
      initialValue: false,
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
          {title: 'Former', value: 'modified-by-client'},
          {title: 'Archived', value: 'archived'},
          {title: 'Offline', value: 'offline'},
          {title: 'Proposal', value: 'proposal'},
          {title: 'Private', value: 'private'},
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
    defineField({
      name: 'layout',
      title: 'Page layout',
      type: 'string',
      group: 'main',
      initialValue: 'standard',
      options: {
        layout: 'radio',
        list: [
          {title: 'Standard', value: 'standard'},
          {title: 'Case study', value: 'caseStudy'},
        ],
      },
      validation: (Rule) => Rule.required(),
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
      title: 'Website link',
      description:
        'Shown under credits. Write e.g. “Visit the website bettergiftshop.com” and link the URL text.',
      type: 'textLinks',
      group: 'data',
    }),

    // Content
    defineField({
      name: 'regularMedia',
      title: 'Media',
      type: 'mediaArray',
      group: 'content',
      hidden: isCaseStudyLayout,
    }),
    defineField({
      name: 'modules',
      title: 'Modules',
      description:
        'Add in reading order. Content blocks fill two columns; separators are a full-width row of 1–4 media.',
      type: 'array',
      group: 'content',
      hidden: ({document}) => document?.layout !== 'caseStudy',
      of: [
        defineArrayMember({type: caseStudyContentBlock.name}),
        defineArrayMember({type: caseStudySeparator.name}),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      listOnly: 'listOnly',
    },
    prepare({title, listOnly}) {
      return {
        title,
        subtitle: listOnly ? 'No inner page' : undefined,
      }
    },
  },
})
