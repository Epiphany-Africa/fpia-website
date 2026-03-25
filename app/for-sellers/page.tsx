
export default function ForSellers() {
  return (
    <>
      <main>
        {/* HERO */}
        <section className="bg-[#0B1F33] py-32 px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">For Sellers</p>
            <h1 className="text-white text-5xl font-bold mb-6">
              Sell with nothing<br />
              <em className="text-[#C9A14D] not-italic font-light">to hide.</em>
            </h1>
            <div className="w-12 h-0.5 bg-[#C9A14D] mb-8" />
            <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
              An FPIA certificate signals transparency — helping serious buyers commit faster
              and protecting you from post-sale disputes.
            </p>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="bg-[#f5f0e8] py-24 px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">Why Sellers Choose FPIA</p>
            <h2 className="text-[#0B1F33] text-4xl font-bold mb-16">The competitive edge<br />that closes deals.</h2>

            <div className="space-y-12">
              {[
                { num: '01', title: 'Attract Serious Buyers', body: "A certified property filters out low-ball offers and time-wasters. Buyers know what they're getting — and they pay for it." },
                { num: '02', title: 'Faster Transfer', body: 'No surprises during due diligence means fewer delays at the conveyancer. Certified properties move through the OTP window cleanly.' },
                { num: '03', title: 'Legal Protection', body: 'The FPIA certificate documents condition at time of sale — protecting you from post-transfer voetstoots disputes.' },
                { num: '04', title: 'Market Credibility', body: "Display the Fair Property Certified™ seal on listings and show boards. It's a signal the market trusts." },
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
          <h2 className="text-white text-4xl font-bold mb-4">Ready to certify your property?</h2>
          <p className="text-gray-400 mb-10">Register today and receive your FPIA certificate before listing.</p>
          <a href="/register" className="bg-[#C9A14D] text-[#0B1F33] font-semibold px-10 py-4 text-sm tracking-widest uppercase hover:bg-[#b8903e] transition-colors">
            Register a Property
          </a>
        </section>
      </main>
    </>
  )
}
