import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'featuredCarousel',
  title: 'Featured Carousel',
  type: 'document',
  fields: [
    defineField({
      name: 'modules',
      title: 'Content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          preview: {
            select: {
              projectTitle: 'project.title',
              label: 'label',
              firstMedia: 'media.0',
              firstMediaType: 'media.0._type',
              firstMediaAsset: 'media.0.asset',
            },
            prepare({ projectTitle, label, firstMedia, firstMediaType, firstMediaAsset }) {
              const textFromLabel =
                Array.isArray(label) && label[0]?.children
                  ? (label[0].children as { text?: string }[])
                      .map((c) => c.text)
                      .join('')
                      .trim()
                  : '';
              const title = projectTitle || textFromLabel || 'Item';
              const media =
                firstMediaType === 'image' && firstMediaAsset
                  ? firstMediaAsset
                  : undefined;
              return { title, media };
            },
          },
          fields: [
            defineField({
              name: 'project',
              title: 'Project',
              type: 'reference',
              to: [{type: 'project'}],
            }),
            defineField({
              name: 'label',
              title: 'Text',
              type: 'textLinks',
            }),
            defineField({
              name: 'media',
              title: 'Media',
              type: 'mediaArray',
              validation: (rule) => rule.max(1),
            }),
            defineField({
              name: 'rotation',
              title: 'Rotation',
              type: 'string',
              options: {
                list: [
                  {title: 'Default', value: 'default'},
                  {title: 'Rotate', value: 'rotate'},
                ],
              },
              initialValue: 'default',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title || 'Featured Carousel',
      }
    },
  },
})
