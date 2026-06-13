export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-sf-navy font-heading mb-8">Terms of Service</h1>
        <div className="prose prose-gray max-w-none space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 className="text-xl font-semibold text-sf-navy mt-8">1. Acceptance of Terms</h2>
          <p>By using SiteForge, you agree to these terms. If you do not agree, do not use the service.</p>
          <h2 className="text-xl font-semibold text-sf-navy mt-8">2. Service Description</h2>
          <p>SiteForge provides construction project management tools including AI-powered estimating, invoicing, RFI tracking, and change order management.</p>
          <h2 className="text-xl font-semibold text-sf-navy mt-8">3. User Responsibilities</h2>
          <p>You are responsible for maintaining account security, providing accurate information, and complying with applicable laws.</p>
          <h2 className="text-xl font-semibold text-sf-navy mt-8">4. Billing & Subscriptions</h2>
          <p>Paid plans billed monthly via Stripe. Cancel anytime. No refunds for partial months.</p>
          <h2 className="text-xl font-semibold text-sf-navy mt-8">5. Limitation of Liability</h2>
          <p>SiteForge is provided &quot;as is&quot; without warranty. We are not liable for construction errors, budget overruns, or project delays.</p>
          <h2 className="text-xl font-semibold text-sf-navy mt-8">6. Contact</h2>
          <p>Questions? Email support@siteforge.app</p>
        </div>
      </div>
    </div>
  )
}
