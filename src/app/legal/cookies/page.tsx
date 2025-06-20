export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Utilizamos cookies para mejorar su experiencia de navegación y entender cómo interactúa con nuestro sitio web.
          </p>
          <p>
            Al hacer clic en &ldquo;Aceptar todas las cookies&rdquo;, usted acepta el almacenamiento de cookies en su dispositivo para mejorar la navegación del sitio, analizar el uso del sitio y ayudar con nuestros esfuerzos de marketing.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
          <p className="mb-4">We use cookies for the following purposes:</p>
          
          <h3 className="text-xl font-semibold mb-3">2.1 Essential Cookies</h3>
          <p className="mb-4">These cookies are necessary for the website to function properly. They include:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Session cookies for managing user sessions</li>
            <li>Security cookies for fraud prevention</li>
            <li>Basic functionality cookies</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.2 Performance Cookies</h3>
          <p className="mb-4">These cookies help us understand how visitors interact with our website:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Analytics cookies to measure visitor numbers</li>
            <li>Performance monitoring</li>
            <li>Error tracking</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.3 Functionality Cookies</h3>
          <p className="mb-4">These cookies remember your preferences:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Language preferences</li>
            <li>Location settings</li>
            <li>Personalization options</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.4 Marketing Cookies</h3>
          <p className="mb-4">These cookies track your online activity to help us deliver relevant advertising:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Behavioral advertising cookies</li>
            <li>Social media sharing cookies</li>
            <li>Retargeting cookies</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. Third-Party Cookies</h2>
          <p className="mb-4">
            Some cookies are placed by third-party services that appear on our pages. We use third-party cookies from:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Google Analytics for website analytics</li>
            <li>Payment processors for secure transactions</li>
            <li>Social media platforms for content sharing</li>
            <li>Advertising partners for targeted advertising</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. Cookie Management</h2>
          <p className="mb-4">You can control and manage cookies in various ways:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Browser settings to block or delete cookies</li>
            <li>Our cookie consent tool on the website</li>
            <li>Third-party opt-out tools</li>
          </ul>
          <p className="mb-4">
            Please note that blocking certain cookies may impact the functionality of our website.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. Cookie Consent</h2>
          <p className="mb-4">
            When you first visit our website, we will ask for your consent to set cookies. You can change your preferences at any time by clicking the "Cookie Settings" link in the footer.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">6. Updates to This Policy</h2>
          <p className="mb-4">
            We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our Cookie Policy, please contact us at:
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