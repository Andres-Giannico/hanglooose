import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fieldsets: [
    {
      name: 'booking',
      title: 'Booking Widget',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    // --- Basic Info ---
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
    }),
    
    // --- Pricing ---
    defineField({
        name: 'price',
        title: 'Price',
        type: 'number',
        validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: 'priceSubtitle',
        title: 'Price Subtitle',
        description: 'e.g., "per group up to 4", "Half day"',
        type: 'string',
    }),
    
    // --- Media ---
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [{ 
        type: 'image',
        options: { hotspot: true },
      }],
      validation: (Rule) => Rule.required().min(1),
    }),
    
    // --- Descriptions ---
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'A short summary for product cards on the homepage.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
        name: 'highlights',
        title: 'Highlights',
        type: 'array',
        of: [{type: 'string'}],
        description: 'Key selling points, shown as a bulleted list.'
    }),
    defineField({
        name: 'fullDescription',
        title: 'Full Description',
        type: 'array', 
        of: [{type: 'block'}]
    }),

    // --- Included / Not Included ---
    defineField({
        name: 'includes',
        title: 'Includes',
        type: 'array',
        of: [{type: 'string'}]
    }),
    defineField({
        name: 'notIncludes',
        title: 'Not Includes',
        type: 'array',
        of: [{type: 'string'}]
    }),
    
    // --- Key Features ---
    defineField({
        name: 'features',
        title: 'Technical Features',
        type: 'array',
        description: 'For key-value pairs like Length, Capacity, Engine, Duration, etc.',
        of: [
            defineField({
                name: 'feature',
                title: 'Feature',
                type: 'object',
                fields: [
                    { name: 'key', title: 'Feature Name (e.g. Length, Duration)', type: 'string' },
                    { name: 'value', title: 'Feature Value (e.g. 5.70 m, 3 Hours)', type: 'string' }
                ]
            })
        ]
    }),
    defineField({
        name: 'freeCancellation',
        title: 'Free Cancellation Available',
        type: 'boolean',
        initialValue: true,
    }),
    defineField({
        name: 'reserveNowPayLater',
        title: 'Reserve Now & Pay Later Available',
        type: 'boolean',
        initialValue: true,
    }),
    defineField({
        name: 'instructorInfo',
        title: 'Instructor Information',
        type: 'string',
        description: 'e.g., "Spanish, English"'
    }),
    defineField({
        name: 'isPrivateGroup',
        title: 'Private Group Option',
        type: 'boolean',
        initialValue: false,
    }),

    // --- Important Info ---
    defineField({
        name: 'importantInformation',
        title: 'Important Information',
        description: 'e.g., "What to bring: Beachwear"',
        type: 'array',
        of: [{type: 'block'}]
    }),

    // --- Booking Widget ---
    defineField({
      name: 'bookingWidget',
      title: 'Booking Widget Settings',
      type: 'object',
      fieldset: 'booking',
      fields: [
        defineField({
          name: 'enableWidget',
          title: 'Enable Booking Widget',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'bookingProductId',
          title: 'Turbookings Product ID',
          type: 'number',
          description: 'The numeric ID of the product from the Turbobooking system.',
          hidden: ({ parent }) => !parent?.enableWidget,
        }),
        defineField({
          name: 'groupByBillingTerm',
          title: 'Group by Billing Term',
          type: 'boolean',
          initialValue: false,
          hidden: ({ parent }) => !parent?.enableWidget,
        }),
        defineField({
          name: 'displayBillingTerm',
          title: 'Display Billing Term',
          type: 'boolean',
          initialValue: false,
          hidden: ({ parent }) => !parent?.enableWidget,
        }),
        defineField({
          name: 'useLargeSlots',
          title: 'Use Large Slots',
          type: 'boolean',
          initialValue: false,
          hidden: ({ parent }) => !parent?.enableWidget,
        }),
        defineField({
          name: 'showQuantity',
          title: 'Show Quantity Selector',
          type: 'boolean',
          initialValue: true,
          hidden: ({ parent }) => !parent?.enableWidget,
        }),
        defineField({
            name: 'quantityLabel',
            title: '"Quantity" Label',
            type: 'string',
            placeholder: 'Quantity',
            hidden: ({ parent }) => !parent?.enableWidget || !parent?.showQuantity,
        }),
        defineField({
            name: 'bookNowLabel',
            title: '"Book Now" Button Label',
            type: 'string',
            placeholder: 'Book Now',
            hidden: ({ parent }) => !parent?.enableWidget,
        }),
      ]
    }),
  ],

  preview: {
    select: {
      title: 'name',
      media: 'gallery.0.asset',
      category: 'category.title',
    },
    prepare(selection) {
      const {title, media, category} = selection
      return {
        title,
        media,
        subtitle: category ? `in ${category}` : 'Uncategorized',
      }
    },
  },
}) 