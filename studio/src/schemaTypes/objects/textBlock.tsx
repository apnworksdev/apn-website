import {defineField, defineType} from 'sanity'

/**
 * A wrapper object for blockContent to allow arrays of blockContent
 */
export default defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({content}) {
      const firstBlock = content?.[0];
      const text = firstBlock?.children?.[0]?.text || 'Empty text block';
      return {
        title: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
      };
    },
  },
})
