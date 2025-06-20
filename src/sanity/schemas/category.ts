import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A short description of the category',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'Brief tagline shown under the category title',
    }),
    defineField({
      name: 'headerImage',
      title: 'Header Image',
      type: 'image',
      description: 'Main image shown at the top of the category page',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'icon',
      title: 'Category Icon',
      type: 'image',
      description: 'Icon to represent this category in menus and lists',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      description: 'Description for search engines',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Category',
      type: 'boolean',
      description: 'Show this category in featured sections',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order to display categories (lower numbers show first)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'icon',
    },
  },
}) 