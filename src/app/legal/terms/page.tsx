export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to Hang Loose Ibiza. These Terms of Service govern your use of our website, services, and boat rental operations. By accessing or using our services, you agree to be bound by these terms.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. Rental Terms & Conditions</h2>
          <h3 className="text-xl font-semibold mb-3">2.1 Booking and Reservation</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>All bookings are subject to availability and confirmation by Hang Loose Ibiza.</li>
            <li>A valid credit card and deposit may be required to secure your reservation.</li>
            <li>Cancellation policies apply as specified in Section 3.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.2 Requirements and Documentation</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>Valid identification is required for all renters.</li>
            <li>Specific licenses may be required for certain boat categories.</li>
            <li>All participants must sign liability waivers before departure.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. Cancellation Policy</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Full refund for cancellations made 48 hours or more before the scheduled rental time.</li>
            <li>50% refund for cancellations made 24-48 hours before the scheduled rental time.</li>
            <li>No refund for cancellations made less than 24 hours before the scheduled rental time.</li>
            <li>Weather-related cancellations will be handled on a case-by-case basis.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. Safety and Regulations</h2>
          <p className="mb-4">
            Safety is our top priority. All renters must:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Follow all maritime safety regulations and local laws.</li>
            <li>Wear provided safety equipment at all times.</li>
            <li>Maintain communication with our base as instructed.</li>
            <li>Not exceed the maximum passenger capacity.</li>
            <li>Not operate vessels under the influence of alcohol or drugs.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. Liability and Insurance</h2>
          <p className="mb-4">
            Our rental fees include basic insurance coverage. However:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Renters are responsible for any damage caused by negligence or violation of terms.</li>
            <li>Personal belongings are not covered under our insurance.</li>
            <li>Additional insurance options are available for purchase.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">6. Dispute Resolution</h2>
          <p>
            Any disputes arising from these terms or our services shall be resolved through:
          </p>
          <ol className="list-decimal pl-6 mb-6">
            <li>Direct negotiation between parties</li>
            <li>Mediation with a mutually agreed-upon mediator</li>
            <li>Binding arbitration under Spanish law</li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
          <p>
            For any questions regarding these terms, please contact us at:
          </p>
          <ul className="list-none pl-6 mb-6">
            <li>Email: info@ibizahire.boats</li>
            <li>Phone: +34-654-082-728</li>
            <li>Address: Calle progreso n 2, San Antonio 07820 Ibiza</li>
          </ul>
        </section>
      </div>
    </div>
  )
} 