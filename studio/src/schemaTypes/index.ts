import blockContent from './objects/blockContent'
import mediaArray from './objects/mediaArray'
import textBlock from './objects/textBlock'
import textLinks from './objects/textLinks'
import project from './documents/project'
import homepage from './singletons/homepage'
import hero from './modules/hero'
import tableOfWorks from './modules/tableOfWorks'
import textModule from './modules/text'
import contactModule from './modules/contact'
import dataBox from './modules/dataBox'
import featuredProject from './modules/featuredProject'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Documents
  project,
  
  // Singletons
  homepage,

  // Modules
  hero,
  tableOfWorks,
  textModule,
  contactModule,
  dataBox,
  featuredProject,

  // Objects
  blockContent,
  mediaArray,
  textBlock,
  textLinks,
]
