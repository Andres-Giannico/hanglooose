export default function CookiesPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Cookies Policy</h1>
      
      <div className="prose max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
          They are widely used to make websites work more efficiently and provide information to the website owners.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">2. How We Use Cookies</h2>
        <p>We use cookies for the following purposes:</p>
        <ul>
          <li><strong>Essential cookies:</strong> These are necessary for the website to function properly and cannot be turned off.</li>
          <li><strong>Analytical/performance cookies:</strong> These help us improve our website by collecting and reporting information on how visitors use it.</li>
          <li><strong>Functionality cookies:</strong> These enable the website to provide enhanced functionality and personalization.</li>
          <li><strong>Targeting cookies:</strong> These are set by our advertising partners and may be used to build a profile of your interests.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">3. Types of Cookies We Use</h2>
        
        <h3 className="text-lg font-medium mt-4 mb-2">3.1 Strictly Necessary Cookies</h3>
        <p>
          These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site.
          Examples include cookies used for authentication, security, and session management.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">3.2 Performance Cookies</h3>
        <p>
          These cookies collect information about how visitors use a website, such as which pages are visited most often.
          They help us improve how our website works and ensure that users can find what they're looking for easily.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">3.3 Functionality Cookies</h3>
        <p>
          These cookies allow the website to remember choices you make (such as language preferences) and provide enhanced, 
          personalized features. They may also be used to provide services you have asked for.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">3.4 Targeting/Advertising Cookies</h3>
        <p>
          These cookies are used to deliver content that is more relevant to you and your interests. 
          They may be used to deliver targeted advertising or to limit the number of times you see an advertisement.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">4. Third-Party Cookies</h2>
        <p>
          In addition to our own cookies, we may also use various third-party cookies to report usage statistics, 
          deliver advertisements, and so on. These cookies may include:
        </p>
        <ul>
          <li>Google Analytics</li>
          <li>Facebook Pixel</li>
          <li>Payment processors</li>
          <li>Social media plugins</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">5. Managing Cookies</h2>
        <p>
          Most web browsers allow you to control cookies through their settings. You can:
        </p>
        <ul>
          <li>Delete all cookies</li>
          <li>Block all cookies</li>
          <li>Allow all cookies</li>
          <li>Block third-party cookies</li>
          <li>Clear all cookies when you close the browser</li>
          <li>Open a 'private browsing' / 'incognito' session</li>
          <li>Install add-ons and plugins to extend browser privacy features</li>
        </ul>
        
        <p className="mt-4">
          Please note that restricting cookies may impact your experience on our website, as some features may not function properly.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">6. Changes to This Cookie Policy</h2>
        <p>
          We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
          We advise you to check this policy periodically for any changes.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">7. Contact Us</h2>
        <p>
          If you have any questions about our Cookie Policy, please contact us at
          <a href="mailto:info@example.com" className="text-blue-600 hover:underline mx-1">info@example.com</a>
          or using the contact form on our website.
        </p>
      </div>
    </div>
  )
} 