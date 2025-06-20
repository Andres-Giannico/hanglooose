export default function TermsConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
      
      <div className="prose max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">1. Introduction</h2>
        <p>
          Welcome to our website. These terms and conditions govern your use of our website and services. 
          By using our website, you accept these terms and conditions in full. If you disagree with these 
          terms and conditions or any part of them, you must not use our website.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">2. Booking and Reservations</h2>
        <p>
          When making a booking or reservation through our website, you must provide accurate and complete information. 
          All bookings are subject to availability and confirmation. We reserve the right to refuse any booking for any reason.
        </p>
        
        <p className="mt-3">
          Payment terms and cancellation policies vary by activity and are specified during the booking process. 
          Please review these carefully before completing your booking.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">3. User Obligations</h2>
        <p>You must not:</p>
        <ul>
          <li>Use our website in any way or take any action that causes, or may cause, damage to the website or impairment of its performance, availability, or accessibility</li>
          <li>Use our website in any way that is unlawful, illegal, fraudulent, or harmful</li>
          <li>Use our website to copy, store, host, transmit, send, use, publish, or distribute any material that consists of or is linked to any malicious computer software</li>
          <li>Conduct any systematic or automated data collection activities on or in relation to our website without our express written consent</li>
          <li>Use data collected from our website for any direct marketing activity</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">4. Intellectual Property</h2>
        <p>
          All content on our website, including but not limited to text, graphics, logos, images, audio clips, 
          digital downloads, and data compilations, is our property or that of our content suppliers and is protected 
          by international copyright laws.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">5. Safety and Conduct</h2>
        <p>
          Our activities may involve inherent risks. All participants must follow safety instructions provided by our staff. 
          We reserve the right to refuse service to anyone who does not comply with safety guidelines or whose behavior may 
          endanger themselves, others, or property.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions 
          relating to our website and the use of our website. We will not be liable for any loss or damage of any nature, 
          including but not limited to:
        </p>
        <ul>
          <li>Loss of profits, business, or revenue</li>
          <li>Loss of contracts or business opportunities</li>
          <li>Business interruption</li>
          <li>Loss of anticipated savings</li>
          <li>Loss of business information</li>
          <li>Loss of goodwill</li>
          <li>Any other indirect or consequential loss</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">7. Changes to These Terms</h2>
        <p>
          We may revise these terms and conditions at any time by amending this page. Please check this page 
          regularly to ensure you are familiar with the current version.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">8. Applicable Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws of Spain, 
          and any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction 
          of the courts of Spain.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">9. Contact Information</h2>
        <p>
          If you have any questions about these terms and conditions, please contact us at
          <a href="mailto:info@example.com" className="text-blue-600 hover:underline mx-1">info@example.com</a>
          or using the contact form on our website.
        </p>
      </div>
    </div>
  )
} 