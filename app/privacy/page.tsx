export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-sf-navy font-heading mb-8">Privacy Policy</h1>
        <div className="prose prose-gray max-w-none space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 className="text-xl font-semibold text-sf-navy mt-8">1. Information We Collect</h2>
          <p>We collect information you provide directly: name, email, company name, billing information, and project data you upload to the platform.</p>
          <h2 className="text-xl font-semibold text-sf-navy mt-8">2. How We Use Your Data</h2>
          <p>To provide and improve our construction management services, process transactions, send service updates, and comply with legal obligations.</p>
          <h2 className="text-xl font-semibold text-sf-navy mt-8">3. Data Storage & Security</h2>
          <p>Data is encrypted at rest and in transit. We use industry-standard security measures. You retain ownership of all project data.</p>
          <h2 className="text-xl font-semibold text-sf-navy mt-8">4. Third-Party Services</h2>
          <p>We integrate with Stripe (payment processing), QuickBooks (accounting), and Google Gemini (AI features). Each has its own privacy policy.</p>
          <h2 className="text-xl font-semibold text-sf-navy mt-8">5. Contact</h2>
          <p>Questions? Contact us at support@siteforge.app</p>
        </div>
      </div>
    </div>
  )
}
