import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {
      name: 'header',
      title: 'Header Settings',
    },
    {
      name: 'footer',
      title: 'Footer Settings',
    },
    {
      name: 'contact',
      title: 'Contact Information',
    },
    {
      name: 'social',
      title: 'Social Media',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      group: 'header',
      description: 'The title of the website, used for SEO and internal reference.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'header',
      description: 'Upload the main logo for the header.',
      options: {
        hotspot: true,
      },
    }),
    // Contact Information
    defineField({
      name: 'contactPhoneNumber',
      title: 'Contact Phone Number (for link)',
      type: 'string',
      group: 'contact',
      description: 'The phone number for the link, e.g., +34871180297',
    }),
    defineField({
      name: 'contactPhoneNumberDisplay',
      title: 'Contact Phone Number (to display)',
      type: 'string',
      group: 'contact',
      description: 'The text to display for the phone number, e.g., IBIZA: +34-871-180-297',
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      group: 'contact',
      description: 'The number used for WhatsApp contact button, including country code (e.g., 34871180297)',
      initialValue: '34871180297',
    }),
    defineField({
      name: 'whatsappDefaultMessage',
      title: 'WhatsApp Default Message',
      type: 'string',
      group: 'contact',
      description: 'Default message to send when clicking the WhatsApp button (when not on a product page)',
      initialValue: 'Hi, I would like to get more information about your services.',
    }),
    defineField({
      name: 'whatsappButtonText',
      title: 'WhatsApp Button Hover Text',
      type: 'string',
      group: 'contact',
      description: 'Text shown when hovering over the WhatsApp button',
      initialValue: 'Chat with us',
    }),
    defineField({
      name: 'showWhatsAppButton',
      title: 'Show WhatsApp Button',
      type: 'boolean',
      group: 'contact',
      description: 'Display the floating WhatsApp button on all pages',
      initialValue: true,
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
      description: 'Main contact email address',
    }),
    defineField({
      name: 'address',
      title: 'Business Address',
      type: 'text',
      group: 'contact',
      rows: 2,
    }),
    // Footer Settings
    defineField({
      name: 'footerLogo',
      title: 'Footer Logo',
      type: 'image',
      group: 'footer',
      description: 'Upload a logo specific for the footer (optional, will use main logo if not provided)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'text',
      group: 'footer',
      rows: 2,
      description: 'A short description or tagline to show in the footer',
    }),
    defineField({
      name: 'footerQuickLinks',
      title: 'Quick Links Section',
      type: 'object',
      group: 'footer',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Quick Links',
        },
        {
          name: 'links',
          title: 'Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'text', title: 'Link Text', type: 'string'},
                {name: 'url', title: 'URL', type: 'string'},
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'footerLegalLinks',
      title: 'Legal Links Section',
      type: 'object',
      group: 'footer',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Legal',
        },
        {
          name: 'links',
          title: 'Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'text', title: 'Link Text', type: 'string'},
                {name: 'url', title: 'URL', type: 'string'},
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'footerSocialTitle',
      title: 'Social Media Section Title',
      type: 'string',
      group: 'footer',
      initialValue: 'Connect With Us',
    }),
    // Social Media Links
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      group: 'social',
      description: 'Add links to your social media profiles',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Twitter', value: 'twitter' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'WhatsApp', value: 'whatsapp' },
                  { title: 'TripAdvisor', value: 'tripadvisor' },
                ],
              },
            },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        },
      ],
    }),
    defineField({
      name: 'footerCopyright',
      title: 'Copyright Text',
      type: 'string',
      group: 'footer',
      description: 'Copyright notice (year will be added automatically)',
    }),
    defineField({
      name: 'footerCredits',
      title: 'Credits Text',
      type: 'string',
      group: 'footer',
      description: 'Credits or additional footer text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'logo',
    },
    prepare({title, media}) {
      return {
        title: title || 'Site Settings',
        media: media,
      }
    },
  },
}) 