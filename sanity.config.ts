'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {CogIcon, MenuIcon} from '@sanity/icons'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schemaTypes} from './src/sanity/schemaTypes/index'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton for Site Settings
            S.listItem()
              .title('Site Settings')
              .icon(CogIcon)
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            // Singleton for Navigation Menu
            S.listItem()
              .title('Navigation Menu')
              .icon(MenuIcon)
              .child(
                S.document()
                  .schemaType('navigationMenu')
                  .documentId('main-menu')
              ),
            // Divider
            S.divider(),
            // Document lists
            S.documentTypeListItem('product').title('Products'),
            S.documentTypeListItem('category').title('Categories'),
          ]),
    }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
  fieldsets: [
    {
      name: 'booking',
      title: 'Booking Widget',
      options: { collapsible: true, collapsed: true },
    },
  ],
})
