
export default function ForAgents() {
  return (
    <>
      <main>
        {/* HERO */}
        <section className="bg-[#0B1F33] py-32 px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">For Agents</p>
            <h1 className="text-white text-5xl font-bold mb-6">
              Close more.<br />
              <em className="text-[#C9A14D] not-italic font-light">Dispute less.</em>
            </h1>
            <div className="w-12 h-0.5 bg-[#C9A14D] mb-8" />
            <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
              FPIA gives your listings a credibility edge — and gives you a paper trail
              that protects your commission and your reputation.
            </p>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="bg-[#f5f0e8] py-24 px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">Built for Agents</p>
            <h2 className="text-[#0B1F33] text-4xl font-bold mb-16">Your listings,<br />certified and protected.</h2>

            <div className="space-y-12">
              {[
                { num: '01', title: 'Differentiate Your Listings', body: "The Fair Property Certified™ seal sets your listings apart on portals like Property24 and Private Property. Buyers notice." },
                { num: '02', title: 'Protect Your Commission', body: 'Post-sale disputes are a threat to your fee. An FPIA certificate documents condition at time of mandate — your protection if anything is challenged.' },
                { num: '03', title: 'Faster Sales Cycle', body: 'Certified properties reduce buyer hesitation. Less back-and-forth, fewer conditional clauses, quicker OTP sign-off.' },
                { num: '04', title: 'Build a Trusted Brand', body: 'Agents who consistently use FPIA build a reputation for professionalism. Referrals follow transparency.' },
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
          <p className="text-gray-400 mb-10">Register as an agent partner and start certifying your listings today.</p>
          <a href="/register" className="bg-[#C9A14D] text-[#0B1F33] font-semibold px-10 py-4 text-sm tracking-widest uppercase hover:bg-[#b8903e] transition-colors">
            Become a Partner
          </a>
        </section>
      </main>
    </>
  )
}
