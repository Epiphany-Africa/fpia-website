
export default function ForInsurers() {
  return (
    <>
      <main>
        {/* HERO */}
        <section className="bg-[#0B1F33] py-32 px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">For Insurers</p>
            <h1 className="text-white text-5xl font-bold mb-6">
              Underwrite with<br />
              <em className="text-[#C9A14D] not-italic font-light">certainty.</em>
            </h1>
            <div className="w-12 h-0.5 bg-[#C9A14D] mb-8" />
            <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
              FPIA certificates provide verified, timestamped condition data at point of transfer —
              giving insurers a defensible baseline for homeowners cover from day one.
            </p>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="bg-[#f5f0e8] py-24 px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">Why Insurers Partner with FPIA</p>
            <h2 className="text-[#0B1F33] text-4xl font-bold mb-16">Known condition.<br />Reduced risk.</h2>

            <div className="space-y-12">
              {[
                { num: '01', title: 'Verified Condition at Transfer', body: "Every FPIA certificate captures the property's condition at the exact point of sale — giving you a defensible baseline that pre-dates the policy." },
                { num: '02', title: 'Reduce Fraudulent Claims', body: 'Pre-existing defects are documented before cover begins. Disputes over whether damage existed prior to the policy are eliminated.' },
                { num: '03', title: 'Faster Claims Assessment', body: 'Inspectors and assessors can reference the FPIA report directly — reducing investigation time and claims processing costs.' },
                { num: '04', title: 'Portfolio-Level Risk Intelligence', body: 'Partner with FPIA to access aggregated condition data across certified properties — enabling smarter underwriting at scale.' },
              ].map((item) => (
                <div key={item.num} className="flex gap-10 border-t border-gray-200 pt-10">
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

        {/* CTA */}
        <section className="bg-[#0B1F33] py-24 px-8 text-center">
          <h2 className="text-white text-4xl font-bold mb-4">Partner with FPIA.</h2>
          <p className="text-gray-400 mb-10">Integrate FPIA certification into your homeowners onboarding flow.</p>
          <a href="/register" className="bg-[#C9A14D] text-[#0B1F33] font-semibold px-10 py-4 text-sm tracking-widest uppercase hover:bg-[#b8903e] transition-colors">
            Enquire About Partnership
          </a>
        </section>
      </main>
    </>
  )
}
