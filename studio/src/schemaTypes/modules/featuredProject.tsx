import {defineField, defineType} from 'sanity'
import { StarIcon } from '@sanity/icons'

/**
 * Featured Project module schema
 * Displays a featured project with text and media
 */
export default defineType({
  name: 'featuredProject',
  title: 'Featured Project',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'showDesignedBy',
      title: 'Show Designed By',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'project',
      title: 'Project',
      type: 'reference',
      to: [{type: 'project'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'blockContent',
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'mediaArray',
      validation: (rule) => rule.max(1),
    }),
  ],
  preview: {
    select: {
      projectTitle: 'project.title',
      media: 'media',
    },
    prepare({projectTitle, media}) {
      return {
        title: projectTitle || 'Featured Project',
        subtitle: media && media.length > 0 ? 'With media' : 'No media',
      }
    },
  },
})
