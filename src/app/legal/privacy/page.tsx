export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">1. Introduction</h2>
        <p>
          Welcome to our Privacy Policy. This document explains how we collect, use, and process your personal information 
          when you use our website and services. We are committed to protecting and respecting your privacy and personal data.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">2. Information We Collect</h2>
        <p>We may collect the following information:</p>
        <ul>
          <li>Personal information such as name, email address, phone number, and billing details when you make a booking or create an account</li>
          <li>Information about your browsing behavior on our website</li>
          <li>Information from third parties, including social media platforms</li>
          <li>Communication data that you send to us</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">3. How We Use Your Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul>
          <li>To provide and manage the services you request</li>
          <li>To communicate with you regarding your bookings</li>
          <li>To personalize and improve your experience on our website</li>
          <li>To process payments</li>
          <li>To comply with legal obligations</li>
          <li>For marketing purposes if you have opted in</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">4. Sharing Your Information</h2>
        <p>
          We may share your information with third-party service providers who help us deliver our services, 
          such as payment processors and booking partners. We ensure that these providers adhere to strict data protection standards.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">5. Cookies</h2>
        <p>
          Our website uses cookies to enhance your browsing experience. You can manage cookie preferences through your browser settings.
          For more information, please refer to our <a href="/legal/cookies" className="text-blue-600 hover:underline">Cookie Policy</a>.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">6. Your Rights</h2>
        <p>You have the following rights regarding your personal data:</p>
        <ul>
          <li>The right to access your data</li>
          <li>The right to rectification</li>
          <li>The right to erasure</li>
          <li>The right to restrict processing</li>
          <li>The right to data portability</li>
          <li>The right to object</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">7. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal data against unauthorized or 
          unlawful processing, accidental loss, destruction, or damage.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">8. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the 
          updated policy on our website with a revised effective date.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or how we handle your personal data, please contact us at 
          <a href="mailto:info@example.com" className="text-blue-600 hover:underline mx-1">info@example.com</a>
          or using the contact form on our website.
        </p>
      </div>
    </div>
  )
} 