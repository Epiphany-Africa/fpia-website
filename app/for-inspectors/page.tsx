'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

const PROVINCES = [
  'Gauteng', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape',
  'Limpopo', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape',
]

const REGISTRATION_BODIES = [
  'SACPCMP', 'ECSA', 'SACAP', 'ASAQS', 'SAIAT', 'Other',
]

const DISCIPLINES = [
  'Property Inspection',
  'Construction Management',
  'Quantity Surveying',
  'Structural Engineering',
  'Architecture',
  'Building Science',
  'Other',
]

const PROPERTY_TYPES = [
  'Residential freehold',
  'Sectional title',
  'Estate / cluster',
  'Commercial',
  'Industrial',
  'Mixed use',
]

const REFERRAL_SOURCES = [
  'Century 21', 'Internet search', 'Colleague referral', 'LinkedIn', 'Other',
]

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  province: string
  registrationBody: string
  registrationNumber: string
  registrationStatus: string
  qualification: string
  yearsExperience: string
  discipline: string
  propertyTypes: string[]
  currentlyInspecting: string
  motivation: string
  referral: string
  cvFile: File | null
  proofFile: File | null
  declaration: boolean
}

const initialForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  province: '',
  registrationBody: '',
  registrationNumber: '',
  registrationStatus: '',
  qualification: '',
  yearsExperience: '',
  discipline: '',
  propertyTypes: [],
  currentlyInspecting: '',
  motivation: '',
  referral: '',
  cvFile: null,
  proofFile: null,
  declaration: false,
}

export default function ForInspectorsPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLDivElement>(null)
  const cvInputRef = useRef<HTMLInputElement>(null)
  const proofInputRef = useRef<HTMLInputElement>(null)

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const set = (field: keyof FormState, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const togglePropertyType = (type: string) => {
    setForm(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type],
    }))
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.province) e.province = 'Required'
    if (!form.registrationBody) e.registrationBody = 'Required'
    if (!form.registrationNumber.trim()) e.registrationNumber = 'Required'
    if (!form.registrationStatus) e.registrationStatus = 'Required'
    if (!form.qualification.trim()) e.qualification = 'Required'
    if (!form.yearsExperience) e.yearsExperience = 'Required'
    if (!form.discipline) e.discipline = 'Required'
    if (form.propertyTypes.length === 0) e.propertyTypes = 'Select at least one'
    if (!form.motivation.trim()) e.motivation = 'Required'
    if (!form.currentlyInspecting) e.currentlyInspecting = 'Required'
    if (!form.cvFile) e.cvFile = 'CV is required'
    if (!form.declaration) e.declaration = 'You must confirm this declaration'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    setSubmitError('')

    try {
      const payload = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v instanceof File) {
          payload.append(k, v)
        } else if (Array.isArray(v)) {
          payload.append(k, v.join(', '))
        } else if (typeof v === 'boolean') {
          payload.append(k, v ? 'true' : 'false')
        } else if (v !== null) {
          payload.append(k, String(v))
        }
      })

      const response = await fetch('/api/inspector-application', {
        method: 'POST',
        body: payload,
      })

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
      }

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error ??
            'We could not submit your application right now. Please try again shortly.'
        )
      }

      setSubmitted(true)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'We could not submit your application right now. Please try again shortly.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all ${
      errors[field]
        ? 'border-red-400 bg-red-50'
        : 'border-[#D8E2EE] bg-white focus:border-[#C9A84C]'
    }`

  const selectClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all appearance-none bg-white ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-[#D8E2EE] focus:border-[#C9A84C]'
    }`

  const labelClass = 'block text-xs font-semibold tracking-wide text-[#1A2B4A] uppercase mb-1.5'
  const errorMsg = (field: string) =>
    errors[field] ? <span className="text-red-500 text-xs mt-1 block">{errors[field]}</span> : null

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#F7F9FC] flex items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1A2B4A] mb-4">Application Received</h1>
          <p className="text-[#4A6082] leading-relaxed mb-8">
            Thank you for applying to the FPIA inspector panel. Your application has been received and will be reviewed by
            the FPIA team. If shortlisted, you will hear from us within 10 business days. We will keep your details on
            file for future panel openings in your province.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-[#1A2B4A] text-white rounded-lg text-sm font-semibold hover:bg-[#243d6a] transition-colors"
          >
            Return Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#F7F9FC]">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative bg-[#1A2B4A] overflow-hidden">
        {/* subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1A2B4A]/60 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-32">
          <span className="inline-block text-[#C9A84C] text-xs font-bold tracking-[0.18em] uppercase mb-6 border border-[#C9A84C]/30 px-3 py-1 rounded-full">
            For Inspectors
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Inspect with authority.
          </h1>
          <p className="text-[#A8BFDA] text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            FPIA has built South Africa&apos;s first governed independent property inspector panel. If you are a built
            environment professional who believes property transactions deserve better evidence, this is where you belong.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A84C] text-[#1A2B4A] font-bold rounded-lg text-sm hover:bg-[#b8963f] transition-colors"
          >
            Apply to Join the Panel
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </section>

      {/* ── WHY JOIN ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <span className="text-[#C9A84C] text-xs font-bold tracking-[0.18em] uppercase block mb-4">
            Why the FPIA Panel
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A2B4A] mb-6 max-w-2xl">
            More than an inspection. A governed record that matters.
          </h2>
          <p className="text-[#4A6082] text-lg leading-relaxed max-w-3xl mb-16">
            FPIA inspectors don&apos;t just submit reports — they create governed property records that protect buyers, inform
            insurers, and support financial institutions. Your findings carry institutional weight in every transaction.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Independence model',
                body: 'FPIA inspectors operate under a conflict-of-interest framework that makes your certification credible to all transaction parties — buyers, sellers, agents, and insurers alike.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                ),
              },
              {
                title: 'Governed platform',
                body: 'Every inspection is lodged against a Supabase-backed property record, timestamped, version-controlled, and tamper-evident. Your work doesn\'t disappear — it compounds.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 4 8 4" />
                ),
              },
              {
                title: 'Professional designation pathway',
                body: 'FPIA is developing the FPIA-CPI (Certified Property Inspector) and FPIA-PPI (Principal Property Inspector) designations. Early panel members shape the standard.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                ),
              },
            ].map(card => (
              <div key={card.title} className="bg-[#F7F9FC] rounded-xl p-7 border border-[#E2EAF4]">
                <div className="w-10 h-10 rounded-lg bg-[#1A2B4A] flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {card.icon}
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#1A2B4A] mb-3">{card.title}</h3>
                <p className="text-[#4A6082] text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>

          {/* partnership logos / trust strip */}
          <div className="mt-16 pt-10 border-t border-[#E2EAF4]">
            <p className="text-xs font-semibold tracking-widest text-[#8FA3BF] uppercase mb-6 text-center">
              Institutional partnerships driving inspector demand
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {['Century 21 South Africa', 'Standard Insurance Limited'].map(p => (
                <span key={p} className="text-sm font-semibold text-[#1A2B4A]/50 tracking-wide">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO QUALIFIES ─────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F7F9FC] border-t border-[#E2EAF4]">
        <div className="max-w-5xl mx-auto px-6">
          <span className="text-[#C9A84C] text-xs font-bold tracking-[0.18em] uppercase block mb-4">
            Who Qualifies
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A2B4A] mb-12 max-w-xl">
            We set the bar. We expect you to clear it.
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              ['Current SACPCMP registration', 'Active registration or currently in progress. Equivalent registrations from ECSA, SACAP, or ASAQS are considered on merit.'],
              ['Relevant built environment qualification', 'National Diploma, B.Tech, or degree in construction management, civil engineering, architecture, or quantity surveying.'],
              ['Minimum 3 years site or inspection experience', 'Hands-on experience assessing properties in the field. Advisory or design-only backgrounds are considered alongside fieldwork.'],
              ['Geographic coverage', 'You nominate the provinces and metro areas you serve. We match assignments to your coverage map — no forced travel.'],
            ].map(([title, body]) => (
              <div key={title} className="flex gap-4 bg-white rounded-xl p-6 border border-[#E2EAF4]">
                <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#C9A84C] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1A2B4A] mb-1">{title}</p>
                  <p className="text-sm text-[#4A6082] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ─────────────────────────────────────────── */}
      <section ref={formRef} className="py-20 bg-white border-t border-[#E2EAF4]">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-[#C9A84C] text-xs font-bold tracking-[0.18em] uppercase block mb-4">
            Application Form
          </span>
          <h2 className="text-3xl font-bold text-[#1A2B4A] mb-3">Apply to join the FPIA inspector panel</h2>
          <p className="text-[#4A6082] mb-10 text-sm leading-relaxed">
            Submission does not guarantee panel appointment. Shortlisted applicants will be contacted within 10 business
            days.
          </p>

          {submitError ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="space-y-10">

            {/* Personal details */}
            <fieldset>
              <legend className="text-sm font-bold text-[#1A2B4A] tracking-wide mb-5 pb-2 border-b border-[#E2EAF4] w-full">
                Personal Details
              </legend>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>First name</label>
                  <input className={inputClass('firstName')} value={form.firstName}
                    onChange={e => set('firstName', e.target.value)} placeholder="Thabo" />
                  {errorMsg('firstName')}
                </div>
                <div>
                  <label className={labelClass}>Last name</label>
                  <input className={inputClass('lastName')} value={form.lastName}
                    onChange={e => set('lastName', e.target.value)} placeholder="Mokoena" />
                  {errorMsg('lastName')}
                </div>
                <div>
                  <label className={labelClass}>Email address</label>
                  <input className={inputClass('email')} type="email" value={form.email}
                    onChange={e => set('email', e.target.value)} placeholder="thabo@example.co.za" />
                  {errorMsg('email')}
                </div>
                <div>
                  <label className={labelClass}>Mobile number</label>
                  <input className={inputClass('phone')} type="tel" value={form.phone}
                    onChange={e => set('phone', e.target.value)} placeholder="071 234 5678" />
                  {errorMsg('phone')}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Primary province</label>
                  <div className="relative">
                    <select className={selectClass('province')} value={form.province}
                      onChange={e => set('province', e.target.value)}>
                      <option value="">Select province</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-3.5 w-4 h-4 text-[#8FA3BF]"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {errorMsg('province')}
                </div>
              </div>
            </fieldset>

            {/* Professional credentials */}
            <fieldset>
              <legend className="text-sm font-bold text-[#1A2B4A] tracking-wide mb-5 pb-2 border-b border-[#E2EAF4] w-full">
                Professional Credentials
              </legend>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Registration body</label>
                  <div className="relative">
                    <select className={selectClass('registrationBody')} value={form.registrationBody}
                      onChange={e => set('registrationBody', e.target.value)}>
                      <option value="">Select body</option>
                      {REGISTRATION_BODIES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-3.5 w-4 h-4 text-[#8FA3BF]"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {errorMsg('registrationBody')}
                </div>
                <div>
                  <label className={labelClass}>Registration number</label>
                  <input className={inputClass('registrationNumber')} value={form.registrationNumber}
                    onChange={e => set('registrationNumber', e.target.value)} placeholder="e.g. SACPCMP/CPM/00001" />
                  {errorMsg('registrationNumber')}
                </div>
                <div>
                  <label className={labelClass}>Registration status</label>
                  <div className="relative">
                    <select className={selectClass('registrationStatus')} value={form.registrationStatus}
                      onChange={e => set('registrationStatus', e.target.value)}>
                      <option value="">Select status</option>
                      <option value="Active">Active</option>
                      <option value="In progress">In progress</option>
                      <option value="Lapsed — renewing">Lapsed — renewing</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-3.5 w-4 h-4 text-[#8FA3BF]"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {errorMsg('registrationStatus')}
                </div>
                <div>
                  <label className={labelClass}>Highest qualification</label>
                  <input className={inputClass('qualification')} value={form.qualification}
                    onChange={e => set('qualification', e.target.value)} placeholder="e.g. B.Tech Construction Management" />
                  {errorMsg('qualification')}
                </div>
                <div>
                  <label className={labelClass}>Years of experience</label>
                  <div className="relative">
                    <select className={selectClass('yearsExperience')} value={form.yearsExperience}
                      onChange={e => set('yearsExperience', e.target.value)}>
                      <option value="">Select range</option>
                      <option value="1-2">1–2 years</option>
                      <option value="3-5">3–5 years</option>
                      <option value="6-10">6–10 years</option>
                      <option value="11-20">11–20 years</option>
                      <option value="20+">20+ years</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-3.5 w-4 h-4 text-[#8FA3BF]"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {errorMsg('yearsExperience')}
                </div>
                <div>
                  <label className={labelClass}>Primary discipline</label>
                  <div className="relative">
                    <select className={selectClass('discipline')} value={form.discipline}
                      onChange={e => set('discipline', e.target.value)}>
                      <option value="">Select discipline</option>
                      {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-3.5 w-4 h-4 text-[#8FA3BF]"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {errorMsg('discipline')}
                </div>
              </div>

              {/* Property types — multi-checkbox */}
              <div className="mt-5">
                <label className={labelClass}>Types of property inspected</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  {PROPERTY_TYPES.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => togglePropertyType(type)}
                      className={`text-left px-4 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                        form.propertyTypes.includes(type)
                          ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#1A2B4A]'
                          : 'border-[#D8E2EE] bg-white text-[#4A6082] hover:border-[#C9A84C]/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errorMsg('propertyTypes')}
              </div>
            </fieldset>

            {/* Motivation */}
            <fieldset>
              <legend className="text-sm font-bold text-[#1A2B4A] tracking-wide mb-5 pb-2 border-b border-[#E2EAF4] w-full">
                Motivation
              </legend>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Why do you want to join the FPIA inspector panel?</label>
                  <textarea
                    className={`${inputClass('motivation')} resize-none`}
                    rows={4}
                    maxLength={500}
                    value={form.motivation}
                    onChange={e => set('motivation', e.target.value)}
                    placeholder="Tell us what draws you to governed independent inspection and what you would bring to the FPIA panel..."
                  />
                  <div className="flex justify-between mt-1">
                    {errorMsg('motivation')}
                    <span className="text-xs text-[#8FA3BF] ml-auto">{form.motivation.length}/500</span>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Are you currently conducting independent property inspections?</label>
                  <div className="flex gap-4 mt-2">
                    {['Yes', 'No', 'Occasionally'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => set('currentlyInspecting', opt)}
                        className={`px-5 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                          form.currentlyInspecting === opt
                            ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#1A2B4A]'
                            : 'border-[#D8E2EE] text-[#4A6082] hover:border-[#C9A84C]/50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {errorMsg('currentlyInspecting')}
                </div>

                <div>
                  <label className={labelClass}>How did you hear about FPIA?</label>
                  <div className="relative">
                    <select className={selectClass('referral')} value={form.referral}
                      onChange={e => set('referral', e.target.value)}>
                      <option value="">Select</option>
                      {REFERRAL_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-3.5 w-4 h-4 text-[#8FA3BF]"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Documents */}
            <fieldset>
              <legend className="text-sm font-bold text-[#1A2B4A] tracking-wide mb-5 pb-2 border-b border-[#E2EAF4] w-full">
                Document Upload
              </legend>
              <div className="space-y-5">

                {/* CV upload */}
                <div>
                  <label className={labelClass}>CV / Resume <span className="text-[#C9A84C]">*</span></label>
                  <div
                    onClick={() => cvInputRef.current?.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                      errors.cvFile ? 'border-red-400 bg-red-50' : form.cvFile ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-[#D8E2EE] hover:border-[#C9A84C]/50'
                    }`}
                  >
                    <input
                      ref={cvInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={e => set('cvFile', e.target.files?.[0] ?? null)}
                    />
                    {form.cvFile ? (
                      <p className="text-sm text-[#1A2B4A] font-medium">✓ {form.cvFile.name}</p>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-[#8FA3BF] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm text-[#4A6082]">Click to upload CV <span className="text-[#8FA3BF]">(PDF, max 5MB)</span></p>
                      </>
                    )}
                  </div>
                  {errorMsg('cvFile')}
                </div>

                {/* Proof of registration */}
                <div>
                  <label className={labelClass}>Proof of registration <span className="text-[#8FA3BF] font-normal normal-case">(optional)</span></label>
                  <div
                    onClick={() => proofInputRef.current?.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                      form.proofFile ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-[#D8E2EE] hover:border-[#C9A84C]/50'
                    }`}
                  >
                    <input
                      ref={proofInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={e => set('proofFile', e.target.files?.[0] ?? null)}
                    />
                    {form.proofFile ? (
                      <p className="text-sm text-[#1A2B4A] font-medium">✓ {form.proofFile.name}</p>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-[#8FA3BF] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm text-[#4A6082]">Click to upload proof of registration <span className="text-[#8FA3BF]">(PDF / JPG, max 5MB)</span></p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Declaration */}
            <div
              className={`p-5 rounded-xl border transition-all cursor-pointer ${
                errors.declaration ? 'border-red-400 bg-red-50' : 'border-[#D8E2EE] bg-[#F7F9FC]'
              }`}
              onClick={() => set('declaration', !form.declaration)}
            >
              <div className="flex gap-3 items-start">
                <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  form.declaration ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-[#8FA3BF] bg-white'
                }`}>
                  {form.declaration && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-[#4A6082] leading-relaxed select-none">
                  I confirm that the information provided in this application is accurate and complete. I understand that
                  FPIA will contact me if my application is shortlisted and that submission does not guarantee panel
                  appointment.
                </p>
              </div>
              {errorMsg('declaration')}
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-4 bg-[#1A2B4A] text-white font-bold rounded-xl text-sm hover:bg-[#243d6a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting…
                </>
              ) : (
                'Submit Application →'
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ───────────────────────────────────────────────── */}
      <section className="py-20 bg-[#1A2B4A]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Inspect with independence. Build with authority.
          </h2>
          <p className="text-[#A8BFDA] mb-8 leading-relaxed">
            FPIA has built the standard for governed property inspection in South Africa. Your expertise belongs in a
            system that protects it.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-block px-8 py-4 bg-[#C9A84C] text-[#1A2B4A] font-bold rounded-lg text-sm hover:bg-[#b8963f] transition-colors"
          >
            Apply Now →
          </button>
        </div>
      </section>

    </main>
  )
}
