import {StructureBuilder} from 'sanity/desk'
import {CogIcon, HomeIcon, TagIcon, UsersIcon, MenuIcon} from '@sanity/icons'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Singleton - Home Settings
      S.listItem()
        .title('Home Page Settings')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('homeSettings')
            .documentId('homeSettings')
        ),

      // Singleton - Site Settings
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      
      // Singleton - Main Menu
      S.listItem()
        .title('Main Menu')
        .icon(MenuIcon)
        .child(
          S.document()
            .schemaType('navigationMenu')
            .documentId('main-menu')
        ),

      // Products
      S.documentTypeListItem('product').title('Products').icon(TagIcon),
      
      // Categories
      S.documentTypeListItem('category').title('Categories'),

      // Footer Data
      S.listItem()
        .title('Footer Data')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('defaultFooterData')
            .documentId('defaultFooterData')
        ),

      // The rest of the documents
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['siteSettings', 'homeSettings', 'navigationMenu', 'defaultFooterData'].includes(
            listItem.getId() as string
          )
      ),
    ])
