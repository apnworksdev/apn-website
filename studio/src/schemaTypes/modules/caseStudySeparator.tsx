import {defineField, defineType} from 'sanity'
import {ThLargeIcon} from '@sanity/icons'

export default defineType({
  name: 'caseStudySeparator',
  title: 'Separator',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'media',
      title: 'Media',
      description: 'Full-width row between content blocks. 1 to 4 items.',
      type: 'mediaArray',
      validation: (rule) => rule.required().min(1).max(4),
    }),
  ],
  preview: {
    select: {
      media: 'media',
      asset: 'media.0.asset',
      mediaType: 'media.0._type',
    },
    prepare({media, asset, mediaType}) {
      const count = media?.length ?? 0
      return {
        title: 'Separator',
        subtitle: `${count} media`,
        media: mediaType === 'image' && asset ? asset : undefined,
      }
    },
  },
})
