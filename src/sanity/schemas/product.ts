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
    {
      name: 'marketing',
      title: 'Marketing & Reviews',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'visibility',
      title: 'Visibility Settings',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'pricing',
      title: 'Pricing Options',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'faq',
      title: 'Frequently Asked Questions',
      options: { collapsible: true, collapsed: false },
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
    
    // --- Visibility ---
    defineField({
      name: 'showOnHome',
      title: 'Show on Homepage',
      type: 'boolean',
      fieldset: 'visibility',
      description: 'If enabled, this product will be displayed on the homepage',
      initialValue: false,
    }),
    
    // --- Pricing ---
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required(),
      fieldset: 'pricing',
    }),
    defineField({
      name: 'showFromPrice',
      title: 'Show "From" before price',
      type: 'boolean',
      description: 'Enable this if you want to show "from" before the price',
      initialValue: false,
      fieldset: 'pricing',
    }),
    defineField({
      name: 'priceSubtitle',
      title: 'Price Subtitle',
      description: 'e.g., "per group up to 4", "Half day"',
      type: 'string',
      fieldset: 'pricing',
    }),
    
    // --- Media ---
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
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
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'}
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility.',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for the image',
            },
          ],
        },
        {
          type: 'object',
          name: 'htmlContent',
          title: 'HTML Content',
          fields: [
            {
              name: 'code',
              title: 'HTML Code',
              type: 'text',
              rows: 10,
              options: {
                language: 'html'
              }
            }
          ],
          preview: {
            select: {
              code: 'code'
            },
            prepare({ code }) {
              return {
                title: 'HTML Content',
                subtitle: code ? code.substring(0, 50) + '...' : 'Empty HTML'
              }
            }
          }
        }
      ],
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

    // --- Guarantees & Payment ---
    defineField({
      name: 'bookingGuarantees',
      title: 'Booking Guarantees',
      type: 'array',
      description: 'e.g., "Quick and easy reservation", "Instant confirmation"',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      },
      initialValue: [
        'Quick and easy reservation',
        'Instant confirmation',
        'Flexible cancellation policy',
        'All-inclusive experiences',
        'Expert guides and personalized attention',
        'Partial online payment',
      ],
    }),
    defineField({
      name: 'paymentMethods',
      title: 'Payment Methods Section',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Text',
          type: 'text',
          rows: 4,
          description: 'e.g., "Secure payment through major credit cards, Apple Pay, and Google Pay. All transactions are securely processed by Stripe."'
        },
        {
          name: 'logos',
          title: 'Payment Logos Image',
          type: 'image',
          description: 'Upload an image showing the logos (Visa, Mastercard, Stripe, etc.)',
          options: {
            hotspot: true
          }
        }
      ]
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
          name: 'billingTermIds',
          title: 'Billing Term IDs',
          type: 'array',
          of: [{ type: 'number' }],
          description: 'Specify which billing terms to show. Leave empty to show all terms.',
          hidden: ({ parent }) => !parent?.enableWidget,
          options: {
            layout: 'tags'
          }
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

    // --- Marketing & Reviews ---
    defineField({
      name: 'isBestSeller',
      title: 'Best Seller',
      type: 'boolean',
      fieldset: 'marketing',
      initialValue: false,
      description: 'Show "Best Seller" badge on the product card',
    }),
    defineField({
      name: 'isLikelyToSellOut',
      title: 'Likely to Sell Out',
      type: 'boolean',
      fieldset: 'marketing',
      initialValue: false,
      description: 'Show "Likely to Sell Out" badge on the product card',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      fieldset: 'marketing',
      validation: Rule => Rule.min(0).max(5).precision(1),
      description: 'Product rating from 0 to 5 (can use decimals)',
    }),
    defineField({
      name: 'reviewCount',
      title: 'Number of Reviews',
      type: 'number',
      fieldset: 'marketing',
      validation: Rule => Rule.min(0).integer(),
      description: 'Total number of reviews',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "2 hours", "Half Day", "Full Day"',
      validation: Rule => Rule.required(),
    }),

    // --- FAQs ---
    defineField({
      name: 'faqs',
      title: 'FAQs',
      description: 'Frequently asked questions about this product',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faq',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              validation: Rule => Rule.required()
            }
          ]
        }
      ],
      fieldset: 'faq'
    }),
  ],

  preview: {
    select: {
      title: 'name',
      media: 'mainImage',
    },
  },
}) 