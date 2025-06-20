const defaultFooterData = {
    _type: 'siteSettings',
    title: 'BOATS IBIZA',
    footerTagline: 'Your premier boat rental service in Ibiza. Experience luxury and adventure with our fleet of modern boats, perfect for any occasion.',
    contactEmail: 'info@ibizahire.boats',
    contactPhoneNumber: '+34-871180297',
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
            { text: 'Terms of Service', url: '/terms' },
            { text: 'Privacy Policy', url: '/privacy' },
            { text: 'Cookie Policy', url: '/cookies' }
        ]
    },

    footerSocialTitle: 'Connect With Us',
    socialLinks: [
        { platform: 'twitter', url: 'https://twitter.com/boatsibiza' },
        { platform: 'instagram', url: 'https://instagram.com/boatsibiza' },
        { platform: 'facebook', url: 'https://facebook.com/boatsibiza' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/boatsibiza' }
    ],

    footerCopyright: 'Boats Ibiza',
    footerCredits: 'Made with ❤️ from MDQ & IBZ'
}

module.exports = { defaultFooterData } 