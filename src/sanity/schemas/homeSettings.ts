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
      initialValue: "Experience Unforgettable Adventures",
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
      initialValue: "Discover the magic of our premium services designed for your perfect vacation experience.",
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
      initialValue: 'Explore Services',
    }),
    defineField({
      name: 'heroButtonLink',
      title: 'Hero Button Link',
      type: 'string',
      group: 'hero',
      initialValue: '/categories',
    }),

    // About Section
    defineField({
      name: 'aboutTitle',
      title: 'About Section Title',
      type: 'string',
      group: 'about',
      initialValue: 'Your Premier Experience Provider',
    }),
    defineField({
      name: 'aboutDescription',
      title: 'About Description',
      type: 'text',
      rows: 4,
      group: 'about',
      initialValue: "We specialize in providing unforgettable experiences that create lasting memories. Whether you're looking for relaxation, adventure, or something in between, our services are tailored to exceed your expectations.",
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
          title: 'Premium Quality',
          description: 'We only offer top-tier services for the best experience',
        },
        {
          title: 'Perfect Locations',
          description: "Access to the most beautiful spots in the area",
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
      initialValue: 'Why Choose Our Services',
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
          description: 'Choose from different time slots to suit your schedule',
          icon: 'clock',
        },
        {
          title: 'Safety First',
          description: 'All equipment and services follow strict safety standards',
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
      initialValue: "Book your experience today and create memories that will last a lifetime",
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      group: 'cta',
      initialValue: 'View All Services',
    }),
    defineField({
      name: 'ctaButtonLink',
      title: 'CTA Button Link',
      type: 'string',
      group: 'cta',
      initialValue: '/categories',
    }),
  ],
}) 