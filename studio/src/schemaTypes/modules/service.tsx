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
      name: 'exampleProject',
      title: 'Project',
      type: 'reference',
      to: [{type: 'project'}],
      fieldset: 'example',
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
      name: 'phases',
      title: 'Phases',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      intro: 'intro',
      clients: 'clients',
      projectTitle: 'exampleProject.title',
      media: 'capitular',
    },
    prepare({intro, clients, projectTitle, media}) {
      const block = intro?.[0]
      const snippet =
        block?.children
          ?.map((child: {text?: string}) => child.text)
          .join('')
          .slice(0, 60) || 'Service'
      const current = clients?.find((client: {current?: boolean; name?: string}) => client?.current)
      const subtitle = [projectTitle, current?.name ? `Current: ${current.name}` : undefined]
        .filter(Boolean)
        .join(' · ')
      return {
        title: snippet,
        subtitle: subtitle || 'Service',
        media,
      }
    },
  },
})
