
export default function ForBondOriginators() {
  return (
    <>
      <main>
        {/* HERO */}
        <section className="bg-[#0B1F33] py-32 px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">For Bond Originators</p>
            <h1 className="text-white text-5xl font-bold mb-6">
              Back every bond with<br />
              <em className="text-[#C9A14D] not-italic font-light">verified assets.</em>
            </h1>
            <div className="w-12 h-0.5 bg-[#C9A14D] mb-8" />
            <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
              FPIA certification gives bond originators and lending institutions independent,
              verified condition data — reducing valuation risk and accelerating approval timelines.
            </p>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="bg-[#f5f0e8] py-24 px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">Why Bond Originators Choose FPIA</p>
            <h2 className="text-[#0B1F33] text-4xl font-bold mb-16">Stronger applications.<br />Faster approvals.</h2>

            <div className="space-y-12">
              {[
                { num: '01', title: 'Independent Asset Verification', body: 'An FPIA certificate is independent of the seller, agent, and buyer — giving lenders a neutral, third-party condition report they can rely on.' },
                { num: '02', title: 'Reduce Valuation Surprises', body: 'Undisclosed defects are one of the biggest causes of bond complications post-approval. FPIA surfaces these before the application reaches the bank.' },
                { num: '03', title: 'Support Faster Bond Approval', body: 'Certified properties arrive at the lender with documented condition history — fewer queries, fewer holdups, faster registration.' },
                { num: '04', title: 'Protect Your Client Relationships', body: 'Originators who recommend FPIA protect their clients from post-transfer surprises — and build the kind of trust that generates referrals.' },
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
          <h2 className="text-white text-4xl font-bold mb-4">Refer with confidence.</h2>
          <p className="text-gray-400 mb-10">Partner with FPIA and add certification to your pre-approval checklist.</p>
          <a href="/register" className="bg-[#C9A14D] text-[#0B1F33] font-semibold px-10 py-4 text-sm tracking-widest uppercase hover:bg-[#b8903e] transition-colors">
            Enquire About Partnership
          </a>
        </section>
      </main>
    </>
  )
}
