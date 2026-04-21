
import { AgentPricingSection } from '@/components/pricing-sections'
import { AgentRewardsProgrammeSection } from '@/components/agent-rewards-section'

export default function ForAgents() {
  return (
    <>
      <main>
        {/* HERO */}
        <section className="bg-[#0B1F33] px-5 py-16 sm:px-8 md:py-24">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">For Agents</p>
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
              Close more.<br />
              <em className="text-[#C9A14D] not-italic font-light">Dispute less.</em>
            </h1>
            <div className="w-12 h-0.5 bg-[#C9A14D] mb-8" />
            <p className="max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
              FPIA gives your listings a credibility edge — and gives you a paper trail
              that protects your commission and your reputation.
            </p>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="bg-[#f5f0e8] px-5 py-16 sm:px-8 md:py-24">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">Built for Agents</p>
            <h2 className="mb-12 text-3xl font-bold text-[#0B1F33] sm:text-4xl md:mb-16">Your listings,<br />certified and protected.</h2>

            <div className="space-y-12">
              {[
                { num: '01', title: 'Differentiate Your Listings', body: "The Fair Property Certified™ seal sets your listings apart on portals like Property24 and Private Property. Buyers notice." },
                { num: '02', title: 'Protect Your Commission', body: 'Post-sale disputes are a threat to your fee. An FPIA certificate documents condition at time of mandate — your protection if anything is challenged.' },
                { num: '03', title: 'Faster Sales Cycle', body: 'Certified properties reduce buyer hesitation. Less back-and-forth, fewer conditional clauses, quicker OTP sign-off.' },
                { num: '04', title: 'Build a Trusted Brand', body: 'Agents who consistently use FPIA build a reputation for professionalism. Referrals follow transparency.' },
              ].map((item) => (
                <div key={item.num} className="flex flex-col gap-4 border-t border-gray-200 pt-8 sm:flex-row sm:gap-10 sm:pt-10">
                  <span className="text-[#C9A14D] text-3xl font-bold w-12 shrink-0">{item.num}</span>
                  <div>
                    <h3 className="text-[#0B1F33] text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-[#6C7077] leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AgentPricingSection />
        <AgentRewardsProgrammeSection />

        {/* CTA */}
        <section className="bg-[#0B1F33] px-5 py-16 text-center sm:px-8 md:py-24">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Partner with FPIA.</h2>
          <p className="text-gray-400 mb-10">Register as an agent partner and start certifying your listings today.</p>
          <a href="/register?type=agent&tier=professional" className="inline-flex w-full justify-center bg-[#C9A14D] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-[#0B1F33] transition-colors hover:bg-[#b8903e] sm:w-auto sm:px-10">
            Become a Partner
          </a>
        </section>
      </main>
    </>
  )
}
