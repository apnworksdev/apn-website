import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'
import caseStudyText from './caseStudyText'
import caseStudyMedia from './caseStudyMedia'
import caseStudyTextMedia from './caseStudyTextMedia'
import caseStudyMediaGrid from './caseStudyMediaGrid'

export default defineType({
  name: 'caseStudyContentBlock',
  title: 'Content block',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      description:
        'Add in reading order (left column first, then right). Desktop fills the left column, then the right. A text-only block, or text plus one inner image, can split across both columns.',
      type: 'array',
      of: [
        defineArrayMember({type: caseStudyText.name}),
        defineArrayMember({type: caseStudyMedia.name}),
        defineArrayMember({type: caseStudyTextMedia.name}),
        defineArrayMember({type: caseStudyMediaGrid.name}),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({items}) {
      const count = items?.length ?? 0
      return {
        title: 'Content block',
        subtitle: `${count} item${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
