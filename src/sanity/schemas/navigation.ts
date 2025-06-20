import {defineField, defineType} from 'sanity'
import {MenuIcon} from '@sanity/icons'

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
              name: 'submenu',
              title: 'Sub-Menu',
              type: 'array',
              description: 'Add items to create a dropdown menu.',
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
                      name: 'link',
                      title: 'Link to Category',
                      type: 'reference',
                      to: [{type: 'category'}],
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'text',
                      subtitle: 'link.name',
                    },
                    prepare({title, subtitle}) {
                      return {
                        title: title,
                        subtitle: `-> ${subtitle || 'No category selected'}`,
                      }
                    },
                  }
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: 'text',
              link: 'link.name',
              submenu: 'submenu',
            },
            prepare({title, link, submenu}) {
              const hasSubmenu = submenu && submenu.length > 0;
              let subtitle = '';
              if (link && hasSubmenu) {
                subtitle = `Links to "${link}" | Sub-menu: ${submenu.length} items`;
              } else if (link) {
                subtitle = `Links to: "${link}"`;
              } else if (hasSubmenu) {
                subtitle = `Sub-menu: ${submenu.length} items`;
              } else {
                subtitle = 'No link or sub-menu';
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