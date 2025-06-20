import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homeSettings',
  title: 'Home Page Settings',
  type: 'document',
  groups: [
    {
      name: 'hero',
      title: 'Hero Section',
    },
    {
      name: 'about',
      title: 'About Section',
    },
    {
      name: 'features',
      title: 'Features Section',
    },
    {
      name: 'cta',
      title: 'Call to Action Section',
    },
  ],
  fields: [
    // Hero Section
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      initialValue: "Discover Ibiza's Best Adventures",
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
      initialValue: "Experience the magic of Ibiza's crystal-clear waters and secluded coves. No license needed for selected boats.",
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'hero',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'heroButtonText',
      title: 'Hero Button Text',
      type: 'string',
      group: 'hero',
      initialValue: 'Explore Our Boats',
    }),
    defineField({
      name: 'heroButtonLink',
      title: 'Hero Button Link',
      type: 'string',
      group: 'hero',
      initialValue: '/categories/boat-hire-ibiza',
    }),

    // About Section
    defineField({
      name: 'aboutTitle',
      title: 'About Section Title',
      type: 'string',
      group: 'about',
      initialValue: 'Your Premier Boat Rental Service in Ibiza',
    }),
    defineField({
      name: 'aboutDescription',
      title: 'About Description',
      type: 'text',
      rows: 4,
      group: 'about',
      initialValue: "At Hang Loose Ibiza, we specialize in providing unforgettable boating experiences around the beautiful island of Ibiza. Whether you're looking for a relaxing day trip to Formentera, an exciting coastal adventure, or a sunset cruise, we have the perfect boat for you.",
    }),
    defineField({
      name: 'aboutFeatures',
      title: 'About Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', title: 'Description', rows: 2 },
          ],
        },
      ],
      group: 'about',
      initialValue: [
        {
          title: 'No License Required',
          description: 'Perfect for beginners with our easy-to-handle boats',
        },
        {
          title: 'Best Locations',
          description: "Access to Ibiza's most beautiful coves and beaches",
        },
        {
          title: 'Expert Support',
          description: 'Full guidance and support throughout your journey',
        },
      ],
    }),

    // Features Section
    defineField({
      name: 'featuresTitle',
      title: 'Features Section Title',
      type: 'string',
      group: 'features',
      initialValue: 'Why Choose Hang Loose Ibiza',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', title: 'Description', rows: 2 },
            { 
              name: 'icon', 
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Check', value: 'check' },
                  { title: 'Clock', value: 'clock' },
                  { title: 'Shield', value: 'shield' },
                  { title: 'Phone', value: 'phone' },
                ],
              },
            },
          ],
        },
      ],
      group: 'features',
      initialValue: [
        {
          title: 'Easy Booking',
          description: 'Simple online reservation system with instant confirmation',
          icon: 'check',
        },
        {
          title: 'Flexible Hours',
          description: 'Choose from half-day or full-day rentals to suit your schedule',
          icon: 'clock',
        },
        {
          title: 'Safety First',
          description: 'All boats equipped with latest safety equipment',
          icon: 'shield',
        },
        {
          title: '24/7 Support',
          description: 'Professional assistance available whenever you need it',
          icon: 'phone',
        },
      ],
    }),

    // CTA Section
    defineField({
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      group: 'cta',
      initialValue: 'Ready to Start Your Adventure?',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'text',
      rows: 2,
      group: 'cta',
      initialValue: "Book your boat today and discover the magic of Ibiza's waters",
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      group: 'cta',
      initialValue: 'View All Boats',
    }),
    defineField({
      name: 'ctaButtonLink',
      title: 'CTA Button Link',
      type: 'string',
      group: 'cta',
      initialValue: '/categories/boat-hire-ibiza',
    }),
  ],
}) 