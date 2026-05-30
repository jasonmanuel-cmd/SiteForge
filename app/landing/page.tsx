'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-sf-navy-dark text-white overflow-hidden relative">
      {/* Blueprint grid overlay */}
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Top accent line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-sf-orange z-50" />

      {/* ─── NAV ─── */}
      <nav className="relative z-40 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sf-orange rounded-lg flex items-center justify-center font-bold text-white text-sm font-heading">SF</div>
          <span className="text-xl font-bold font-heading tracking-wide">SiteForge</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/70">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#estimator" className="hover:text-white transition-colors">Estimator</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link href="/signup" className="bg-sf-orange hover:bg-sf-orange-dark text-white font-semibold px-5 py-2.5 rounded-lg transition-colors font-heading tracking-wide text-sm">
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative z-40 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="max-w-3xl">
          <div className="inline-block bg-sf-orange/20 text-sf-orange-light text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            Built for Contractors Who Hate Admin Work
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-heading leading-[1.05] tracking-wide mb-8">
            Stop Losing Money<br />
            Between the Bid<br />
            and the <span className="text-sf-orange">Built.</span>
          </h1>
          <p className="text-xl text-white/60 leading-relaxed mb-10 max-w-2xl">
            SiteForge is the AI-powered construction management platform that turns your phone into a full office. Estimates, invoices, RFIs, change orders, CRM — one system. One login. Zero excuses.
          </p>

          {/* CTA + Social Proof */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/signup"
              className="bg-sf-orange hover:bg-sf-orange-dark text-white font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg shadow-sf-orange/20 hover:shadow-xl hover:shadow-sf-orange/30 font-heading tracking-wide">
              Start Free — No Credit Card
            </Link>
            <Link href="/login"
              className="border-2 border-white/20 hover:border-white/40 text-white font-semibold px-10 py-4 rounded-xl text-lg text-center transition-colors font-heading tracking-wide">
              Try the Demo
            </Link>
          </div>

          {/* Avatars + proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['👷', '👨‍🔧', '👩‍💼', '🔧'].map((emoji, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/10 border-2 border-sf-navy-dark flex items-center justify-center text-lg">
                  {emoji}
                </div>
              ))}
            </div>
            <span className="text-sm text-white/50">
              <strong className="text-white/80">200+ contractors</strong> already managing projects on SiteForge
            </span>
          </div>
        </div>
      </section>

      {/* ─── PAIN POINT HOOK ─── */}
      <section className="relative z-40 bg-sf-cream text-sf-text py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-sf-orange font-bold uppercase tracking-widest text-sm mb-4">The Problem</p>
            <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-wide text-sf-navy leading-tight">
              You Became a Contractor to Build Things.<br />
              Not to Fight With Spreadsheets.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📊', title: 'Estimates Take Forever', desc: 'You&apos;re quoting jobs on the hood of your truck. Competitors send polished PDFs while you&apos;re still doing math.' },
              { icon: '📄', title: 'Invoices Disappear Into the Void', desc: 'Tracking who owes you what across 15 active projects? You need a spreadsheet just for the spreadsheets.' },
              { icon: '😤', title: 'The Office Is Haunting You', desc: 'RFIs, change orders, daily reports, vendor calls — the paperwork never ends. And every hour on admin is an hour not building.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-sf-navy font-heading tracking-wide mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="relative z-40 bg-white text-sf-text py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-sf-orange font-bold uppercase tracking-widest text-sm mb-4">The Solution</p>
            <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-wide text-sf-navy mb-6">
              Everything Your Business Needs.<br />Nothing You Don&apos;t.
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              One platform that replaces your messy stack of tools, spreadsheets, and sticky notes with a single command center.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔧', title: 'AI Trade Estimator', desc: '8 trade calculators with CA tax compliance. Framing, drywall, concrete, electrical, plumbing, painting, HVAC, roofing. Get accurate bids in minutes, not hours.' },
              { icon: '📋', title: 'Smart Invoicing', desc: 'AI reads your receipts and invoices. Auto-extracts vendor, amounts, line items. QuickBooks sync. No more data entry from paper.' },
              { icon: '👥', title: 'CRM & Pipeline', desc: 'Kanban boards for every lead. Track from first contact to close. Know exactly where every dollar is coming from.' },
              { icon: '🏗️', title: 'Project Management', desc: 'Budget tracking, timelines, status updates. One dashboard that shows the truth about every job site.' },
              { icon: '❓', title: 'RFI Tracker', desc: 'Create, send, and track RFIs without the email black hole. Never lose a request again.' },
              { icon: '🤖', title: 'Built-In AI Assistant', desc: 'Ask anything. Get construction-smart answers. Cost codes, best practices, material recommendations — like having a senior PM on call.' },
            ].map((feature, i) => (
              <div key={i} className="group bg-sf-cream hover:bg-sf-navy-light p-8 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-sf-orange">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold font-heading tracking-wide mb-3 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-gray-500 group-hover:text-white/60 leading-relaxed transition-colors">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ESTIMATOR CALL-OUT ─── */}
      <section id="estimator" className="relative z-40 bg-sf-navy-dark text-white py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sf-orange font-bold uppercase tracking-widest text-sm mb-4">AI Estimator</p>
              <h2 className="text-4xl font-bold font-heading tracking-wide mb-6">
                Quote Jobs Before<br />
                Your Competitor Finishes<br />
                His Coffee.
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Eight trade-specific calculators built for California contractors. Enter square footage, material grades, and labor rates — get a fully itemized, tax-compliant estimate with labor breakdowns in under 5 minutes.
              </p>
              <div className="space-y-4">
                {[
                  'Framing, drywall, concrete, painting',
                  'Electrical, plumbing, HVAC, roofing',
                  'CA tax-compliant formulas built in',
                  'Export polished PDFs to clients instantly',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-sf-orange rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">✓</div>
                    <span className="text-white/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-sm text-white/40 uppercase tracking-widest mb-6 font-heading">Live Preview</div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 block mb-1">Trade</label>
                  <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-medium">Framing — Residential</div>
                </div>
                <div>
                  <label className="text-sm text-white/60 block mb-1">Square Footage</label>
                  <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-medium">2,400 sq ft</div>
                </div>
                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/50">Labor</span>
                    <span className="text-white font-medium">$18,420</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/50">Materials</span>
                    <span className="text-white font-medium">$12,880</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/50">CA Tax (7.25%)</span>
                    <span className="text-white font-medium">$2,269</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-3 mt-3">
                    <span className="text-sf-orange">Total Estimate</span>
                    <span className="text-sf-orange text-lg">$33,569</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF / TESTIMONIALS ─── */}
      <section className="relative z-40 bg-sf-cream text-sf-text py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-sf-orange font-bold uppercase tracking-widest text-sm mb-4">Trusted by Contractors</p>
            <h2 className="text-4xl font-bold font-heading tracking-wide text-sf-navy">Built With the Trades. For the Trades.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Mike T.', role: 'General Contractor, Bakersfield', quote: 'I was spending 10 hours a week on invoices alone. SiteForge cut that to maybe one. The AI estimator paid for itself on the first job.', stars: '★★★★★' },
              { name: 'Sarah C.', role: 'Remodeling Specialist, CA', quote: 'Finally a system that doesn&apos;t feel like it was designed by a software engineer who&apos;s never held a hammer. This gets it.', stars: '★★★★★' },
              { name: 'Robert G.', role: 'Multi-Trade Contractor', quote: 'I run three crews across five active sites. SiteForge is the only thing keeping me from losing my mind. The CRM alone is worth it.', stars: '★★★★★' },
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="text-sf-orange text-lg mb-4">{review.stars}</div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">&ldquo;{review.quote}&rdquo;</p>
                <div>
                  <p className="font-bold text-sf-navy font-heading">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="relative z-40 bg-white text-sf-text py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-sf-orange font-bold uppercase tracking-widest text-sm mb-4">Pricing</p>
            <h2 className="text-4xl font-bold font-heading tracking-wide text-sf-navy mb-4">
              Start Free. Scale When You&apos;re Ready.
            </h2>
            <p className="text-gray-500 text-lg">No credit card required. No hidden fees. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-sf-cream p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold font-heading tracking-wide text-sf-navy mb-2">Starter</h3>
              <div className="text-4xl font-bold font-heading text-sf-navy mb-1">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <p className="text-gray-500 text-sm mb-6">Free forever for small crews</p>
              <ul className="space-y-3 mb-8">
                {['Up to 3 active projects', 'AI Estimator (all 8 trades)', 'Basic CRM (up to 50 contacts)', 'Invoice tracking', 'Email support'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-sf-orange">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center bg-white border-2 border-sf-navy text-sf-navy font-bold py-3 rounded-xl hover:bg-sf-navy hover:text-white transition-colors font-heading tracking-wide text-sm">
                Get Started Free
              </Link>
            </div>

            <div className="bg-sf-navy text-white p-8 rounded-2xl border-2 border-sf-orange relative shadow-xl shadow-sf-navy/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sf-orange text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold font-heading tracking-wide mb-2">Professional</h3>
              <div className="text-4xl font-bold font-heading mb-1">$49<span className="text-lg text-white/50 font-normal">/mo</span></div>
              <p className="text-white/50 text-sm mb-6">For growing contracting businesses</p>
              <ul className="space-y-3 mb-8">
                {['Unlimited projects', 'Everything in Starter', 'QuickBooks sync', 'AI invoice from photo', 'Priority support', 'RFI & Change Order tracking', 'Team access (up to 5)'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-sf-orange">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center bg-sf-orange hover:bg-sf-orange-dark text-white font-bold py-3 rounded-xl transition-colors font-heading tracking-wide text-sm">
                Start Free Trial
              </Link>
            </div>

            <div className="bg-sf-cream p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold font-heading tracking-wide text-sf-navy mb-2">Enterprise</h3>
              <div className="text-4xl font-bold font-heading text-sf-navy mb-1">$149<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <p className="text-gray-500 text-sm mb-6">For established contractors &amp; GCs</p>
              <ul className="space-y-3 mb-8">
                {['Everything in Professional', 'Unlimited team members', 'Custom onboarding', 'API access', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-sf-orange">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="mailto:sales@siteforge.com" className="block text-center bg-white border-2 border-sf-navy text-sf-navy font-bold py-3 rounded-xl hover:bg-sf-navy hover:text-white transition-colors font-heading tracking-wide text-sm">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative z-40 bg-sf-navy-dark text-white py-24">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-wide mb-6">
            Every Hour Spent on Admin<br />Is an Hour You&apos;re <span className="text-sf-orange">Not Getting Paid.</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
            Join contractors who&apos;ve already made the switch. Start your free trial today. See what running your business actually feels like.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/signup"
              className="bg-sf-orange hover:bg-sf-orange-dark text-white font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg shadow-sf-orange/20 hover:shadow-xl hover:shadow-sf-orange/30 font-heading tracking-wide">
              Start Free Trial
            </Link>
            <Link href="/login"
              className="border-2 border-white/20 hover:border-white/40 text-white font-semibold px-10 py-4 rounded-xl text-lg text-center transition-colors font-heading tracking-wide">
              Try Demo First
            </Link>
          </div>
          {!submitted ? (
            <form onSubmit={handleWaitlist} className="flex gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-sf-orange focus:outline-none" />
              <button type="submit" className="bg-sf-orange hover:bg-sf-orange-dark text-white font-bold px-6 py-3 rounded-xl transition-colors font-heading tracking-wide text-sm">
                Get Updates
              </button>
            </form>
          ) : (
            <p className="text-green-400 font-semibold font-heading">✓ You&apos;re on the list. We&apos;ll be in touch.</p>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-40 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sf-orange rounded-lg flex items-center justify-center font-bold text-white text-xs font-heading">SF</div>
              <span className="font-bold font-heading tracking-wide text-sm">SiteForge</span>
              <span className="text-white/30 text-sm"> — Forge your operation.</span>
            </div>
            <p className="text-white/30 text-sm">© 2026 SiteForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
