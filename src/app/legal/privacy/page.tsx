export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            At Hang Loose Ibiza, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
          <p className="mb-4">We may collect personal information that you voluntarily provide, including:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Name and contact information</li>
            <li>Payment information</li>
            <li>Identification documents</li>
            <li>Boating licenses and certifications</li>
            <li>Emergency contact details</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.2 Automatically Collected Information</h3>
          <p className="mb-4">When you visit our website, we automatically collect:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Usage patterns and preferences</li>
            <li>Location data (with your consent)</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. Use of Your Information</h2>
          <p className="mb-4">We use the collected information for:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Processing your reservations and payments</li>
            <li>Providing customer support</li>
            <li>Sending booking confirmations and updates</li>
            <li>Improving our services and website</li>
            <li>Complying with legal obligations</li>
            <li>Marketing communications (with your consent)</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. Data Protection</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Employee training on data protection</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights Under GDPR</h2>
          <p className="mb-4">Under the General Data Protection Regulation (GDPR), you have the right to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Access your personal data</li>
            <li>Rectify inaccurate personal data</li>
            <li>Request erasure of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
          <p className="mb-4">
            We may use third-party service providers to facilitate our services. These providers have access to your personal information only to perform specific tasks on our behalf and are obligated to protect your information.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
          <p className="mb-4">
            We retain your personal information for as long as necessary to:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Provide our services</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce our agreements</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p className="mb-4">
            For any questions about this Privacy Policy or to exercise your rights, please contact our Data Protection Officer at:
          </p>
          <ul className="list-none pl-6 mb-6">
            <li>Email: privacy@ibizahire.boats</li>
            <li>Phone: +34-654-082-728</li>
            <li>Address: Calle progreso n 2, San Antonio 07820 Ibiza</li>
          </ul>
        </section>
      </div>
    </div>
  )
} 