
export default function ForBondOriginators() {
  return (
    <>
      <main>
        {/* HERO */}
        <section className="bg-[#0B1F33] px-5 py-16 sm:px-8 md:py-24">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">For Bond Originators</p>
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
              Back every bond with<br />
              <em className="text-[#C9A14D] not-italic font-light">verified assets.</em>
            </h1>
            <div className="w-12 h-0.5 bg-[#C9A14D] mb-8" />
            <p className="max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
              FPIA certification gives bond originators and lending institutions independent,
              verified condition data — reducing valuation risk and accelerating approval timelines.
            </p>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="bg-[#f5f0e8] px-5 py-16 sm:px-8 md:py-24">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">Why Bond Originators Choose FPIA</p>
            <h2 className="mb-12 text-3xl font-bold text-[#0B1F33] sm:text-4xl md:mb-16">Stronger applications.<br />Faster approvals.</h2>

            <div className="space-y-12">
              {[
                { num: '01', title: 'Independent Asset Verification', body: 'An FPIA certificate is independent of the seller, agent, and buyer — giving lenders a neutral, third-party condition report they can rely on.' },
                { num: '02', title: 'Reduce Valuation Surprises', body: 'Undisclosed defects are one of the biggest causes of bond complications post-approval. FPIA surfaces these before the application reaches the bank.' },
                { num: '03', title: 'Support Faster Bond Approval', body: 'Certified properties arrive at the lender with documented condition history — fewer queries, fewer holdups, faster registration.' },
                { num: '04', title: 'Protect Your Client Relationships', body: 'Originators who recommend FPIA protect their clients from post-transfer surprises — and build the kind of trust that generates referrals.' },
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

        {/* CTA */}
        <section className="bg-[#0B1F33] px-5 py-16 text-center sm:px-8 md:py-24">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Refer with confidence.</h2>
          <p className="text-gray-400 mb-10">Partner with FPIA and add certification to your pre-approval checklist.</p>
          <a href="/register" className="inline-flex w-full justify-center bg-[#C9A14D] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-[#0B1F33] transition-colors hover:bg-[#b8903e] sm:w-auto sm:px-10">
            Enquire About Partnership
          </a>
        </section>
      </main>
    </>
  )
}
