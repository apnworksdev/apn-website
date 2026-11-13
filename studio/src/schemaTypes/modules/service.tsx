import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'object',
  icon: DocumentIcon,
  fieldsets: [
    {name: 'example', title: 'Example'},
    {name: 'media', title: 'Media'},
  ],
  fields: [
    defineField({
      name: 'capitular',
      title: 'Capitular letter',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'blockContent',
    }),
    defineField({
      name: 'exampleMedia',
      title: 'Media',
      description: 'Image or video.',
      type: 'mediaArray',
      fieldset: 'example',
      validation: (rule) => rule.max(1),
    }),
    defineField({
      name: 'exampleCaption',
      title: 'Caption',
      type: 'string',
      fieldset: 'example',
    }),
    defineField({
      name: 'media',
      title: 'Media',
      description: 'Image or video.',
      type: 'mediaArray',
      fieldset: 'media',
      validation: (rule) => rule.max(1),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      fieldset: 'media',
    }),
    defineField({
      name: 'clients',
      title: 'Clients',
      description: 'Mark one client as current.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'client',
          title: 'Client',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'current',
              title: 'Current',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'name',
              current: 'current',
            },
            prepare({title, current}) {
              return {
                title: title || 'Untitled client',
                subtitle: current ? 'Current' : undefined,
              }
            },
          },
        }),
      ],
      validation: (rule) =>
        rule.custom((clients: {current?: boolean}[] | undefined) => {
          if (!clients?.length) return true
          const currentCount = clients.filter((client) => client?.current).length
          return currentCount > 1 ? 'Only one client can be current' : true
        }),
    }),
    defineField({
      name: 'phases',
      title: 'Phases',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      intro: 'intro',
      clients: 'clients',
      media: 'capitular',
    },
    prepare({intro, clients, media}) {
      const block = intro?.[0]
      const snippet =
        block?.children
          ?.map((child: {text?: string}) => child.text)
          .join('')
          .slice(0, 60) || 'Service'
      const current = clients?.find((client: {current?: boolean; name?: string}) => client?.current)
      return {
        title: snippet,
        subtitle: current?.name ? `Current: ${current.name}` : 'Service',
        media,
      }
    },
  },
})
