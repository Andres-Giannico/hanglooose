const { client } = require('../src/sanity/client')
const { defaultFooterData } = require('../src/sanity/schemas/defaultFooterData')

// Función para importar los datos del footer
async function importFooterData() {
    try {
        // Verificar si ya existe un documento de configuración
        const existingDoc = await client.fetch('*[_type == "siteSettings"][0]')

        if (existingDoc) {
            console.log('Actualizando configuración existente...')
            await client
                .patch(existingDoc._id)
                .set({
                    footerTagline: defaultFooterData.footerTagline,
                    contactEmail: defaultFooterData.contactEmail,
                    contactPhoneNumber: defaultFooterData.contactPhoneNumber,
                    address: defaultFooterData.address,
                    footerQuickLinks: defaultFooterData.footerQuickLinks,
                    footerLegalLinks: defaultFooterData.footerLegalLinks,
                    footerSocialTitle: defaultFooterData.footerSocialTitle,
                    socialLinks: defaultFooterData.socialLinks,
                    footerCopyright: defaultFooterData.footerCopyright,
                    footerCredits: defaultFooterData.footerCredits
                })
                .commit()
            
            console.log('Configuración actualizada exitosamente!')
        } else {
            console.log('Creando nueva configuración...')
            await client.create(defaultFooterData)
            console.log('Configuración creada exitosamente!')
        }
    } catch (error) {
        console.error('Error al importar datos:', error)
    }
}

// Ejecutar la importación
importFooterData() 