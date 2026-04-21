
import { InsurerPilotSection } from '@/components/pricing-sections'

export default function ForInsurers() {
  return (
    <>
      <main>
        {/* HERO */}
        <section className="bg-[#0B1F33] px-5 py-16 sm:px-8 md:py-24">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">For Insurers</p>
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
              Underwrite with<br />
              <em className="text-[#C9A14D] not-italic font-light">certainty.</em>
            </h1>
            <div className="w-12 h-0.5 bg-[#C9A14D] mb-8" />
            <p className="max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
              FPIA certificates provide verified, timestamped condition data at point of transfer —
              giving insurers a defensible baseline for homeowners cover from day one.
            </p>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="bg-[#f5f0e8] px-5 py-16 sm:px-8 md:py-24">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">Why Insurers Partner with FPIA</p>
            <h2 className="mb-12 text-3xl font-bold text-[#0B1F33] sm:text-4xl md:mb-16">Known condition.<br />Reduced risk.</h2>

            <div className="space-y-12">
              {[
                { num: '01', title: 'Verified Condition at Transfer', body: "Every FPIA certificate captures the property's condition at the exact point of sale — giving you a defensible baseline that pre-dates the policy." },
                { num: '02', title: 'Reduce Fraudulent Claims', body: 'Pre-existing defects are documented before cover begins. Disputes over whether damage existed prior to the policy are eliminated.' },
                { num: '03', title: 'Faster Claims Assessment', body: 'Inspectors and assessors can reference the FPIA report directly — reducing investigation time and claims processing costs.' },
                { num: '04', title: 'Portfolio-Level Risk Intelligence', body: 'Partner with FPIA to access aggregated condition data across certified properties — enabling smarter underwriting at scale.' },
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

        <InsurerPilotSection />

        {/* CTA */}
        <section className="bg-[#0B1F33] px-5 py-16 text-center sm:px-8 md:py-24">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Partner with FPIA.</h2>
          <p className="text-gray-400 mb-10">Integrate FPIA certification into your homeowners onboarding flow.</p>
          <a href="/contact?inquiry=insurer-pilot-b" className="inline-flex w-full justify-center bg-[#C9A14D] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-[#0B1F33] transition-colors hover:bg-[#b8903e] sm:w-auto sm:px-10">
            Enquire About Partnership
          </a>
        </section>
      </main>
    </>
  )
}
