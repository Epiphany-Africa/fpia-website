
import { AgentPricingSection } from '@/components/pricing-sections'

const faqs = [
  {
    question: 'Does FPIA replace the PPRA disclosure form?',
    answer:
      'No. FPIA supports a clearer property record before transfer, but it does not replace the PPRA mandatory disclosure form or the legal steps required in the transaction.',
  },
  {
    question: 'When should an agency use FPIA?',
    answer:
      'The strongest time is before listing or early in the deal, when buyers, sellers, and agents can still act on the record before time pressure increases.',
  },
  {
    question: 'Can buyers verify an FPIA certificate themselves?',
    answer:
      'Yes. Buyers can verify certificate status directly through the public verification route and QR-linked record.',
  },
  {
    question: 'Does FPIA replace our CRM or agency operations software?',
    answer:
      'No. FPIA sits alongside your existing workflow as the property record and verification layer. It is not a CRM or general agency operations system.',
  },
  {
    question: 'Can one agency account support multiple agents or branches?',
    answer:
      'Yes. Agency access can be structured for individual agents, teams, or multi-branch environments depending on the operating model.',
  },
] as const

export default function ForAgents() {
  return (
    <>
      <main>
        {/* HERO */}
        <section className="bg-[#0B1F33] px-5 py-16 sm:px-8 md:py-24">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">For Agents and Agencies</p>
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
              Bring clearer property records<br />
              <em className="text-[#C9A14D] not-italic font-light">into every listing.</em>
            </h1>
            <div className="w-12 h-0.5 bg-[#C9A14D] mb-8" />
            <p className="max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
              FPIA helps agencies present property condition more clearly, reduce
              late-stage surprises, and move deals forward with a trusted record.
            </p>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="bg-[#f5f0e8] px-5 py-16 sm:px-8 md:py-24">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">Built for Agencies</p>
            <h2 className="mb-12 text-3xl font-bold text-[#0B1F33] sm:text-4xl md:mb-16">Clearer listings,<br />stronger transaction discipline.</h2>

            <div className="space-y-12">
              {[
                { num: '01', title: 'Present Listings More Clearly', body: 'FPIA helps agencies show buyers a clearer record of property condition before pressure builds in the deal.' },
                { num: '02', title: 'Reduce Late-Stage Friction', body: 'When condition questions are raised earlier, pricing, disclosure, and negotiation are easier to manage.' },
                { num: '03', title: 'Support Better Buyer Confidence', body: 'A verified record gives serious buyers a stronger factual base before they commit.' },
                { num: '04', title: 'Protect Client Trust', body: 'Using independent verification helps agencies run a more credible process and reduce avoidable disputes later.' },
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

        <section className="bg-white px-5 py-16 sm:px-8 md:py-24">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#C9A14D] text-xs tracking-widest uppercase mb-4">FAQs</p>
            <h2 className="mb-12 text-3xl font-bold text-[#0B1F33] sm:text-4xl">Questions agencies ask most.</h2>
            <div className="space-y-4">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="border border-[rgba(11,31,51,0.12)] bg-[#f8f5ef] px-6 py-5"
                >
                  <summary className="cursor-pointer list-none text-lg font-semibold text-[#0B1F33]">
                    {item.question}
                  </summary>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#5f6771]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0B1F33] px-5 py-16 text-center sm:px-8 md:py-24">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Talk to FPIA.</h2>
          <p className="text-gray-400 mb-10">Set up agency access and use FPIA more consistently across your listings.</p>
          <a href="/register?type=agent&tier=professional" className="inline-flex w-full justify-center bg-[#C9A14D] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-[#0B1F33] transition-colors hover:bg-[#b8903e] sm:w-auto sm:px-10">
            Request Agency Access
          </a>
        </section>
      </main>
    </>
  )
}
