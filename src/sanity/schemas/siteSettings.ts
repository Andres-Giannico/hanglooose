import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description: 'The title of the website, used for SEO and internal reference.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Upload the main logo for the header.',
      options: {
        hotspot: true, // Allows for better cropping
      },
    }),
    defineField({
      name: 'contactPhoneNumber',
      title: 'Contact Phone Number (for link)',
      type: 'string',
      description: 'The phone number for the link, e.g., +34871180297',
    }),
    defineField({
      name: 'contactPhoneNumberDisplay',
      title: 'Contact Phone Number (to display)',
      type: 'string',
      description: 'The text to display for the phone number, e.g., IBIZA: +34-871-180-297',
    }),
    defineField({
      name: 'contactButtonText',
      title: 'Contact Button Text',
      type: 'string',
      description: 'The text for the main call-to-action button in the header.',
      initialValue: 'Contact Us',
    }),
    defineField({
      name: 'contactButtonLink',
      title: 'Contact Button Link',
      type: 'url',
      description: 'The URL the contact button links to (e.g., a WhatsApp link or /contact page).',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      description: 'Add links to your social media profiles. They will appear as icons in the header.',
      of: [
        {
          name: 'socialLink',
          title: 'Social Link',
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'TripAdvisor', value: 'tripadvisor' },
                  { title: 'WhatsApp', value: 'whatsapp' },
                  { title: 'YouTube', value: 'youtube' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url'
            },
            prepare({ title, subtitle }) {
              const platformTitle = title ? title.charAt(0).toUpperCase() + title.slice(1) : 'No platform selected';
              return {
                title: platformTitle,
                subtitle: subtitle,
              };
            },
          }
        },
      ],
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