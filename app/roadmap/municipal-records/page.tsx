import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Municipal, Deeds and Approved Plans Roadmap',
}

const roadmapRecords = [
  {
    title: 'Approved plans and municipal records',
    body: 'Approved building plans, occupancy certificates and municipal artefacts may help parties understand whether the property record is complete, current and aligned to the built environment on site.',
  },
  {
    title: 'Title deed and property reference data',
    body: 'Title deed references, erf details, sectional-title scheme information and registered-property identifiers can help connect the physical property to the formal legal property record.',
  },
  {
    title: 'Compliance and certificate history',
    body: 'Electrical, plumbing, gas, electric fence, entomology, occupancy, inspection and other compliance documents can form part of a durable property history.',
  },
  {
    title: 'Owner and practitioner uploads',
    body: 'Until formal integrations exist, FPIA can still support owner, seller, practitioner and authority uploads as user-provided records, clearly separated from FPIA-verified outcomes.',
  },
  {
    title: 'Authority-reviewed evidence',
    body: 'Where FPIA reviews, structures or verifies evidence, the record should clearly distinguish between uploaded documents, reviewed documents, inspection findings and issued certificates.',
  },
]

const roadmapPhases = [
  {
    phase: 'Phase 1 — Owner and seller document capture',
    status: 'Live foundation',
    copy: 'Homeowners and sellers can upload property records such as COCs, approved plans, entomology certificates, occupancy certificates, warranties and prior inspection reports into the Property Passport and Seller Readiness flows.',
  },
  {
    phase: 'Phase 2 — Authority review and classification',
    status: 'In progress / platform capability',
    copy: 'FPIA can classify uploaded records, separate user-provided documents from reviewed evidence, and attach documents to governed property files.',
  },
  {
    phase: 'Phase 3 — Institutional and municipal engagement',
    status: 'Future roadmap',
    copy: 'FPIA may engage municipalities, public bodies, data providers and institutional partners to explore lawful access to approved plans, municipal records, title references and related property artefacts.',
  },
  {
    phase: 'Phase 4 — Governed property-record infrastructure',
    status: 'Strategic direction',
    copy: 'The long-term objective is a durable property record that supports sellers, buyers, practitioners, conveyancers, insurers, lenders and municipalities with clearer evidence, cleaner disclosure and better decision-making.',
  },
]

export default function MunicipalRecordsRoadmapPage() {
  return (
    <main style={{ backgroundColor: 'var(--off-white)' }}>
      <section style={{ backgroundColor: 'var(--navy)' }} className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-24">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-4 font-medium">
            Future Property Record Infrastructure
          </p>
          <h1
            style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--off-white)' }}
            className="max-w-4xl text-4xl leading-tight sm:text-5xl md:text-6xl mb-6"
          >
            Building toward a fuller property record.
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
            FPIA is designed to support a more complete property record over time — including approved plans, title deed references, compliance documents and municipal artefacts where lawful access and formal data-sharing arrangements allow.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">
            Why this matters
          </p>
          <h2
            style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }}
            className="text-3xl md:text-4xl mb-4"
          >
            A governed property record becomes more useful as more evidence can be organised responsibly.
          </h2>
          <p style={{ color: 'var(--slate)' }} className="max-w-4xl text-base leading-relaxed">
            Property decisions are stronger when condition evidence, compliance artefacts, ownership references and municipal records can be understood together. Today, these records are often fragmented across owners, agents, conveyancers, municipalities, inspectors and public registries. FPIA&apos;s roadmap is to create a governed property-record layer that can reference and organise these artefacts without overstating their legal status.
          </p>
        </div>
      </section>

      <section style={{ backgroundColor: 'white' }} className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">
            Records FPIA is designed to support
          </p>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {roadmapRecords.map((item) => (
              <div
                key={item.title}
                style={{ border: '1px solid rgba(11,31,51,0.1)', backgroundColor: 'var(--off-white)' }}
                className="p-7"
              >
                <h3
                  style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }}
                  className="text-2xl leading-tight mb-3"
                >
                  {item.title}
                </h3>
                <p style={{ color: 'var(--slate)' }} className="text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--navy)' }} className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">
            What FPIA will not claim
          </p>
          <div
            style={{ border: '1px solid rgba(201,161,77,0.24)', backgroundColor: 'rgba(255,255,255,0.03)' }}
            className="p-8"
          >
            <p style={{ color: 'rgba(255,255,255,0.78)' }} className="text-base leading-relaxed mb-5">
              FPIA does not claim that:
            </p>
            <ul className="space-y-3">
              {[
                'it currently has direct municipal system access;',
                'it currently has live Deeds Office or DeedsWeb integration;',
                'uploaded documents are automatically verified;',
                'a Property Passport replaces a title deed, municipal approval, occupation certificate, conveyancing process or legal advice;',
                'future integrations will be available without lawful access, data-sharing agreements and appropriate governance.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  <span style={{ color: 'var(--gold)', marginTop: '2px' }}>✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">
            Roadmap phases
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {roadmapPhases.map((phase) => (
              <div
                key={phase.phase}
                style={{ border: '1px solid rgba(11,31,51,0.1)', backgroundColor: 'white' }}
                className="p-7"
              >
                <p style={{ color: 'var(--gold)' }} className="text-[11px] tracking-[0.18em] uppercase mb-3 font-medium">
                  {phase.status}
                </p>
                <h3
                  style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }}
                  className="text-2xl leading-tight mb-3"
                >
                  {phase.phase}
                </h3>
                <p style={{ color: 'var(--slate)' }} className="text-sm leading-relaxed">
                  {phase.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: 'white' }} className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">
            Strategic value
          </p>
          <h2
            style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }}
            className="text-3xl md:text-4xl mb-4"
          >
            A fuller record strengthens property decisions without overstating what is verified.
          </h2>
          <p style={{ color: 'var(--slate)' }} className="max-w-4xl text-base leading-relaxed mb-8">
            This roadmap moves FPIA beyond inspection alone. It positions FPIA as a governed property-record infrastructure layer: a place where condition, compliance, disclosure, ownership references and transaction evidence can be organised, reviewed and verified according to clear trust rules.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/property-passport"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity"
            >
              Explore Property Passport
            </Link>
            <Link
              href="/seller-readiness"
              style={{ border: '1px solid rgba(11,31,51,0.2)', color: 'var(--navy)' }}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide hover:border-[rgba(11,31,51,0.4)] transition-colors"
            >
              Start Seller Readiness
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
