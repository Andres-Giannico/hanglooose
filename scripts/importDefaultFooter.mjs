import { createClient } from '@sanity/client'
import { config } from 'dotenv'

// Cargar variables de entorno
config()

// Crear cliente de Sanity
const client = createClient({
    projectId: '2u8z0ywh',
    dataset: 'production',
    token: process.env.SANITY_WRITE_TOKEN,
    apiVersion: '2024-01-24',
    useCdn: false
})

const defaultFooterData = {
    _type: 'siteSettings',
    title: 'Hang Loose Ibiza',
    footerTagline: 'Your premier boat rental service in Ibiza. Experience luxury and adventure with our fleet of modern boats, perfect for any occasion.',
    contactEmail: 'info@ibizahire.boats',
    contactPhoneNumber: '34654082728',
    contactPhoneNumberDisplay: 'IBIZA: +34-654-082-728',
    address: 'Calle progreso n 2, San Antonio 07820 Ibiza',
    
    footerQuickLinks: {
        title: 'Quick Links',
        links: [
            { text: 'Home', url: '/' },
            { text: 'About Us', url: '/about' },
            { text: 'Boats', url: '/boats' },
            { text: 'Best Routes', url: '/routes' },
            { text: 'Blog', url: '/blog' }
        ]
    },

    footerLegalLinks: {
        title: 'Legal',
        links: [
            { text: 'Terms of Service', url: '/legal/terms' },
            { text: 'Privacy Policy', url: '/legal/privacy' },
            { text: 'Cookie Policy', url: '/legal/cookies' }
        ]
    },

    footerSocialTitle: 'Connect With Us',
    socialLinks: [
        { platform: 'twitter', url: 'https://twitter.com/hangloooseibiza' },
        { platform: 'instagram', url: 'https://instagram.com/hangloooseibiza' },
        { platform: 'facebook', url: 'https://facebook.com/hangloooseibiza' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/hangloooseibiza' }
    ],

    footerCopyright: 'Hang Loose Ibiza',
    footerCredits: 'Made with ❤️ from MDQ & IBZ'
}

// Función para importar los datos del footer
async function importFooterData() {
    try {
        // Intentar crear directamente
        console.log('Creando configuración...')
        const result = await client.create(defaultFooterData)
        console.log('Configuración creada exitosamente!', result)
    } catch (error) {
        console.error('Error al importar datos:', error)
        // Mostrar más detalles del error
        if (error.response) {
            console.error('Detalles del error:', error.response.body)
        }
    }
}

// Ejecutar la importación
importFooterData() 