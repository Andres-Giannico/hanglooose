import {defineField, defineType} from 'sanity'
import {MenuIcon, LinkIcon} from '@sanity/icons'

export default defineType({
  name: 'navigationMenu',
  title: 'Navigation Menu',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Menu Title',
      type: 'string',
      description: 'A descriptive name for the menu (e.g., "Main Navigation").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Menu Items',
      type: 'array',
      description: 'Add, remove, and reorder navigation items.',
      of: [
        defineField({
          name: 'menuItem',
          title: 'Menu Item',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Top-level Link Text',
              type: 'string',
              description: 'The text for the main navigation item (e.g., "Watersports").',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Top-level Link (Optional)',
              type: 'reference',
              description: 'Leave empty if this is just a container for a sub-menu.',
              to: [{type: 'category'}],
            }),
            defineField({
              name: 'submenuType',
              title: 'Submenu Type',
              type: 'string',
              options: {
                list: [
                  {title: 'No submenu', value: 'none'},
                  {title: 'Products Submenu', value: 'products'},
                  {title: 'Categories Submenu', value: 'categories'},
                  {title: 'Custom Links', value: 'custom'}
                ],
                layout: 'radio'
              },
              initialValue: 'none',
            }),
            defineField({
              name: 'submenuColumns',
              title: 'Number of Columns',
              type: 'number',
              description: 'For wider submenus, you can display items in multiple columns',
              options: {
                list: [
                  {title: '1 Column', value: 1},
                  {title: '2 Columns', value: 2},
                  {title: '3 Columns', value: 3}
                ]
              },
              initialValue: 1,
              hidden: ({parent}) => parent.submenuType === 'none',
            }),
            defineField({
              name: 'featuredImage',
              title: 'Featured Image',
              type: 'image',
              description: 'Optional image to display in the submenu',
              options: {
                hotspot: true
              },
              hidden: ({parent}) => parent.submenuType === 'none',
            }),
            defineField({
              name: 'submenu',
              title: 'Custom Submenu Items',
              type: 'array',
              description: 'Add items to create a dropdown menu.',
              hidden: ({parent}) => parent.submenuType !== 'custom',
              of: [
                {
                  name: 'subMenuItem',
                  title: 'Sub-Menu Item',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'text',
                      title: 'Link Text',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'linkType',
                      title: 'Link Type',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Category', value: 'category'},
                          {title: 'Product', value: 'product'},
                          {title: 'External URL', value: 'external'},
                          {title: 'Internal Page', value: 'internal'}
                        ]
                      },
                      initialValue: 'category',
                    }),
                    defineField({
                      name: 'categoryLink',
                      title: 'Link to Category',
                      type: 'reference',
                      to: [{type: 'category'}],
                      hidden: ({parent}) => parent.linkType !== 'category',
                    }),
                    defineField({
                      name: 'productLink',
                      title: 'Link to Product',
                      type: 'reference',
                      to: [{type: 'product'}],
                      hidden: ({parent}) => parent.linkType !== 'product',
                    }),
                    defineField({
                      name: 'externalUrl',
                      title: 'External URL',
                      type: 'url',
                      hidden: ({parent}) => parent.linkType !== 'external',
                    }),
                    defineField({
                      name: 'internalPage',
                      title: 'Internal Page',
                      type: 'string',
                      description: 'Path to internal page (e.g., "/about" or "/contact")',
                      hidden: ({parent}) => parent.linkType !== 'internal',
                    }),
                    defineField({
                      name: 'icon',
                      title: 'Icon',
                      type: 'string',
                      description: 'Optional icon name (e.g., "boat", "water", "atv")',
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'text',
                      linkType: 'linkType',
                      categoryName: 'categoryLink.title',
                      productName: 'productLink.name',
                      url: 'externalUrl',
                      page: 'internalPage'
                    },
                    prepare({title, linkType, categoryName, productName, url, page}) {
                      let subtitle = '';
                      if (linkType === 'category') {
                        subtitle = `Category: ${categoryName || 'Not selected'}`;
                      } else if (linkType === 'product') {
                        subtitle = `Product: ${productName || 'Not selected'}`;
                      } else if (linkType === 'external') {
                        subtitle = url || 'No URL';
                      } else if (linkType === 'internal') {
                        subtitle = page || 'No path';
                      }
                      
                      return {
                        title: title,
                        subtitle: subtitle,
                        media: LinkIcon
                      }
                    },
                  }
                },
              ],
            }),
            defineField({
              name: 'productsFilter',
              title: 'Products Filter',
              type: 'object',
              description: 'Filter products to show in submenu',
              hidden: ({parent}) => parent.submenuType !== 'products',
              fields: [
                defineField({
                  name: 'category',
                  title: 'From Category',
                  type: 'reference',
                  to: [{type: 'category'}],
                }),
                defineField({
                  name: 'limit',
                  title: 'Maximum Products',
                  type: 'number',
                  initialValue: 6
                }),
              ]
            }),
          ],
          preview: {
            select: {
              title: 'text',
              link: 'link.title',
              submenuType: 'submenuType',
              submenu: 'submenu',
            },
            prepare({title, link, submenuType, submenu}) {
              let subtitle = '';
              if (link) {
                subtitle = `Links to "${link}" | `;
              }
              
              if (submenuType === 'none') {
                subtitle += 'No submenu';
              } else if (submenuType === 'products') {
                subtitle += 'Products submenu';
              } else if (submenuType === 'categories') {
                subtitle += 'Categories submenu';
              } else if (submenuType === 'custom') {
                subtitle += `Custom submenu (${(submenu || []).length} items)`;
              }
              
              return {
                title: title,
                subtitle: subtitle,
              };
            },
          },
        }),
      ],
    }),
  ],
}) 