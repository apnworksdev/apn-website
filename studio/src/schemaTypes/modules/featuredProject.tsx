import {defineField, defineType} from 'sanity'

/**
 * Featured Project module schema
 * Displays a featured project with text and media
 */
export default defineType({
  name: 'featuredProject',
  title: 'Featured Project',
  type: 'object',
  fields: [
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
      type: 'textLinks',
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
