'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  SELLER_READINESS_DISCLAIMER,
  SELLER_READINESS_INTAKE_NOTE,
} from '@/lib/seller-readiness/disclaimers'

const PROVINCES = [
  'Gauteng',
  'KwaZulu-Natal',
  'Western Cape',
  'Eastern Cape',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Free State',
  'Northern Cape',
]

const PROPERTY_TYPES = [
  'Residential freehold',
  'Sectional title',
  'Estate / cluster',
  'Commercial',
  'Industrial',
  'Mixed use',
]

const FINISH_TIERS = ['standard', 'mid', 'premium']
const SELLING_URGENCY = ['sell_fast', 'balanced', 'maximise_price'] as const
const DAMAGE_CATEGORY_OPTIONS = [
  'structural',
  'damp',
  'roof',
  'ceiling',
  'plumbing',
  'electrical',
  'boundary',
  'driveway',
  'retaining_wall',
  'finishes',
  'bathroom',
  'pool',
  'other',
]

type DamageItemForm = {
  id: string
  category: string
  locationOnProperty: string
  sellerNotes: string
  file: File | null
}

function newDamageItem(): DamageItemForm {
  return {
    id: crypto.randomUUID(),
    category: '',
    locationOnProperty: '',
    sellerNotes: '',
    file: null,
  }
}

function formatUrgency(value: string) {
  if (value === 'sell_fast') return 'Sell fast'
  if (value === 'maximise_price') return 'Maximise price'
  return 'Balanced'
}

export default function SellerReadinessPage() {
  const [sellerName, setSellerName] = useState('')
  const [sellerEmail, setSellerEmail] = useState('')
  const [sellerPhone, setSellerPhone] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [suburb, setSuburb] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [floorArea, setFloorArea] = useState('')
  const [erfSize, setErfSize] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [garages, setGarages] = useState('')
  const [finishTier, setFinishTier] = useState('')
  const [expectedAskingPrice, setExpectedAskingPrice] = useState('')
  const [sellingUrgency, setSellingUrgency] = useState<(typeof SELLING_URGENCY)[number] | ''>('')
  const [notes, setNotes] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [damageItems, setDamageItems] = useState<DamageItemForm[]>([newDamageItem()])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const validDamageItems = useMemo(
    () =>
      damageItems.filter(
        (item) => item.file || item.sellerNotes.trim() || item.locationOnProperty.trim()
      ),
    [damageItems]
  )

  function updateDamageItem(id: string, updater: (item: DamageItemForm) => DamageItemForm) {
    setDamageItems((current) =>
      current.map((item) => (item.id === id ? updater(item) : item))
    )
  }

  function removeDamageItem(id: string) {
    setDamageItems((current) =>
      current.length === 1 ? current : current.filter((item) => item.id !== id)
    )
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')

    if (!propertyAddress.trim() || !sellerName.trim() || !sellerEmail.trim()) {
      setError('Please complete the required seller and property fields.')
      return
    }

    for (const item of validDamageItems) {
      if (!item.file) {
        setError('Each visible damage item must include an image upload.')
        return
      }

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(item.file.type)) {
        setError('Only JPEG, PNG, and WEBP images are supported.')
        return
      }

      if (item.file.size > 10 * 1024 * 1024) {
        setError('Each image must be 10MB or smaller.')
        return
      }
    }

    setSubmitting(true)

    try {
      const payload = new FormData()
      payload.append('seller_name', sellerName)
      payload.append('seller_email', sellerEmail)
      payload.append('seller_phone', sellerPhone)
      payload.append('property_address', propertyAddress)
      payload.append('suburb', suburb)
      payload.append('city', city)
      payload.append('province', province)
      payload.append('postal_code', postalCode)
      payload.append('property_type', propertyType)
      payload.append('floor_area_m2', floorArea)
      payload.append('erf_size_m2', erfSize)
      payload.append('bedrooms', bedrooms)
      payload.append('bathrooms', bathrooms)
      payload.append('garages', garages)
      payload.append('finish_tier', finishTier)
      payload.append('expected_asking_price', expectedAskingPrice)
      payload.append('selling_urgency', sellingUrgency)
      payload.append('notes', notes)
      payload.append('company_website', companyWebsite)

      const damageItemPayload = validDamageItems.map((item, index) => {
        const fieldName = `damage_file_${index}`
        if (item.file) {
          payload.append(fieldName, item.file)
        }

        return {
          fieldName,
          damageCategory: item.category,
          locationOnProperty: item.locationOnProperty,
          sellerNotes: item.sellerNotes,
          uploadedFileName: item.file?.name ?? null,
        }
      })

      payload.append('damage_items', JSON.stringify(damageItemPayload))

      const response = await fetch('/api/seller-readiness', {
        method: 'POST',
        body: payload,
      })

      const json = (await response.json().catch(() => ({}))) as {
        error?: string
      }

      if (!response.ok) {
        throw new Error(json.error ?? 'Submission failed.')
      }

      setSubmitted(true)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Submission failed.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#F7F9FC] flex items-center justify-center px-6 py-24">
        <div className="max-w-xl text-center">
          <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center mx-auto mb-6 text-3xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-[#1A2B4A] mb-4">
            Submission received
          </h1>
          <p className="text-[#4A6082] leading-relaxed mb-6">
            Your Seller Readiness Assessment has been received. FPIA will review the
            submitted evidence and prepare the Pre-Listing Property Readiness Report.
          </p>
          <p className="text-sm text-[#6B7A90] leading-relaxed mb-8">
            AI-assisted findings are never final until reviewed by FPIA. We will
            separate reinstatement cost, visible repair exposure, and listing-posture
            guidance before anything is released publicly.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#1A2B4A] text-white rounded-lg text-sm font-semibold"
          >
            Return Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#F7F9FC] min-h-screen">
      <section className="bg-[#1A2B4A] px-6 py-24 md:py-28">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#C9A84C] text-xs font-bold tracking-[0.18em] uppercase mb-5">
            FPIA Seller Readiness Assessment
          </p>
          <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight max-w-4xl mb-6">
            Understand visible repair exposure, disclosure risk and buyer
            negotiation pressure before you list.
          </h1>
          <p className="text-[#A8BFDA] text-lg leading-relaxed max-w-3xl mb-10">
            Before you list, understand the visible issues buyers may use to
            renegotiate. FPIA helps sellers move from guesswork to governed pre-sale
            intelligence.
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: 'Reinstatement Cost Estimate',
                body: 'Indicative rebuild cost of the fixed improvements based on floor area, province, property type, and finish tier.',
              },
              {
                title: 'Visible Damage Repair Estimate',
                body: 'Indicative repair-cost range for visible defects evidenced in the uploaded photos and notes.',
              },
              {
                title: 'Seller Readiness Price Guidance',
                body: 'Listing-posture guidance based on visible repair exposure, seller expectation, urgency, disclosure risk, and negotiation pressure.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="border border-[#C9A84C]/20 bg-white/5 p-5 rounded-xl"
              >
                <div className="text-[#C9A84C] text-xs font-bold tracking-[0.18em] uppercase mb-3">
                  Output
                </div>
                <h2 className="text-white text-xl font-semibold mb-3">{card.title}</h2>
                <p className="text-[#C9D6E4] text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-18 md:py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] gap-8">
          <div className="bg-white border border-[#D8E2EE] rounded-2xl p-6 md:p-8">
            <p className="text-[#C9A84C] text-xs font-bold tracking-[0.18em] uppercase mb-4">
              Why this matters
            </p>
            <h2 className="text-3xl font-bold text-[#1A2B4A] mb-4">
              The Pre-Listing Property Readiness Report helps a seller decide whether
              to repair first, disclose clearly, or adjust their listing posture
              before going to market.
            </h2>
            <p className="text-[#4A6082] leading-relaxed mb-6">
              Upload visible damage evidence, capture your expected asking position,
              and receive a readiness report that separates reinstatement value,
              repair exposure, and negotiation risk.
            </p>
            <ul className="space-y-3 text-sm text-[#1A2B4A]">
              {[
                'Pre-sale property intelligence, not a formal valuation',
                'Useful for sellers, property practitioners, buyers, banks, insurers, and legal practitioners',
                'Designed to prevent late-stage OTP surprises and last-minute price renegotiation',
                'Conservative, governed language that avoids overclaiming hidden-defect certainty',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#C9A84C] font-bold">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#FFF8E8] border border-[#E6D7A5] rounded-2xl p-6 md:p-8">
            <p className="text-[#8A6B1F] text-xs font-bold tracking-[0.18em] uppercase mb-4">
              Important position
            </p>
            <p className="text-[#1A2B4A] text-sm leading-relaxed mb-4">
              {SELLER_READINESS_INTAKE_NOTE}
            </p>
            <p className="text-[#4A6082] text-sm leading-relaxed">
              The tool may reference seller asking expectations, but it does not
              determine market value, does not replace an estate-agent comparative
              market analysis, and does not replace contractor or specialist advice.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto bg-white border border-[#D8E2EE] rounded-2xl p-6 md:p-8">
          <p className="text-[#C9A84C] text-xs font-bold tracking-[0.18em] uppercase mb-4">
            Start Seller Readiness Assessment
          </p>

          <form onSubmit={handleSubmit} className="space-y-10">
            <input
              type="text"
              value={companyWebsite}
              onChange={(event) => setCompanyWebsite(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <fieldset>
              <legend className="text-sm font-bold text-[#1A2B4A] tracking-wide mb-5 pb-2 border-b border-[#E2EAF4] w-full">
                Seller and property
              </legend>
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Seller Name" required>
                  <input className={inputClass} value={sellerName} onChange={(event) => setSellerName(event.target.value)} />
                </Field>
                <Field label="Seller Email" required>
                  <input className={inputClass} type="email" value={sellerEmail} onChange={(event) => setSellerEmail(event.target.value)} />
                </Field>
                <Field label="Seller Phone">
                  <input className={inputClass} value={sellerPhone} onChange={(event) => setSellerPhone(event.target.value)} />
                </Field>
                <Field label="Property Type">
                  <select className={inputClass} value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                    <option value="">Select property type</option>
                    {PROPERTY_TYPES.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Property Address" required full>
                  <input className={inputClass} value={propertyAddress} onChange={(event) => setPropertyAddress(event.target.value)} />
                </Field>
                <Field label="Suburb">
                  <input className={inputClass} value={suburb} onChange={(event) => setSuburb(event.target.value)} />
                </Field>
                <Field label="City">
                  <input className={inputClass} value={city} onChange={(event) => setCity(event.target.value)} />
                </Field>
                <Field label="Province">
                  <select className={inputClass} value={province} onChange={(event) => setProvince(event.target.value)}>
                    <option value="">Select province</option>
                    {PROVINCES.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Postal Code">
                  <input className={inputClass} value={postalCode} onChange={(event) => setPostalCode(event.target.value)} />
                </Field>
                <Field label="Floor Area m²">
                  <input className={inputClass} type="number" value={floorArea} onChange={(event) => setFloorArea(event.target.value)} />
                </Field>
                <Field label="Erf Size m²">
                  <input className={inputClass} type="number" value={erfSize} onChange={(event) => setErfSize(event.target.value)} />
                </Field>
                <Field label="Bedrooms">
                  <input className={inputClass} type="number" step="0.5" value={bedrooms} onChange={(event) => setBedrooms(event.target.value)} />
                </Field>
                <Field label="Bathrooms">
                  <input className={inputClass} type="number" step="0.5" value={bathrooms} onChange={(event) => setBathrooms(event.target.value)} />
                </Field>
                <Field label="Garages">
                  <input className={inputClass} type="number" value={garages} onChange={(event) => setGarages(event.target.value)} />
                </Field>
                <Field label="Finish Tier">
                  <select className={inputClass} value={finishTier} onChange={(event) => setFinishTier(event.target.value)}>
                    <option value="">Select finish tier</option>
                    {FINISH_TIERS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Expected Asking Price">
                  <input className={inputClass} type="number" value={expectedAskingPrice} onChange={(event) => setExpectedAskingPrice(event.target.value)} />
                </Field>
                <Field label="Selling Urgency">
                  <select className={inputClass} value={sellingUrgency} onChange={(event) => setSellingUrgency(event.target.value as (typeof SELLING_URGENCY)[number] | '')}>
                    <option value="">Select urgency</option>
                    {SELLING_URGENCY.map((option) => (
                      <option key={option} value={option}>{formatUrgency(option)}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Notes" full>
                  <textarea className={`${inputClass} min-h-[120px]`} value={notes} onChange={(event) => setNotes(event.target.value)} />
                </Field>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-bold text-[#1A2B4A] tracking-wide mb-5 pb-2 border-b border-[#E2EAF4] w-full">
                Visible damage evidence
              </legend>

              <div className="space-y-5">
                {damageItems.map((item, index) => (
                  <div key={item.id} className="border border-[#D8E2EE] rounded-xl p-5 bg-[#F7F9FC]">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="text-sm font-bold text-[#1A2B4A]">
                        Damage Item {index + 1}
                      </div>
                      {damageItems.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeDamageItem(item.id)}
                          className="text-xs font-semibold text-[#B42318]"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Damage Category">
                        <select
                          className={inputClass}
                          value={item.category}
                          onChange={(event) =>
                            updateDamageItem(item.id, (current) => ({
                              ...current,
                              category: event.target.value,
                            }))
                          }
                        >
                          <option value="">Select category</option>
                          {DAMAGE_CATEGORY_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option.replaceAll('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Location On Property">
                        <input
                          className={inputClass}
                          value={item.locationOnProperty}
                          onChange={(event) =>
                            updateDamageItem(item.id, (current) => ({
                              ...current,
                              locationOnProperty: event.target.value,
                            }))
                          }
                          placeholder="e.g. front boundary wall"
                        />
                      </Field>

                      <Field label="Seller Notes" full>
                        <textarea
                          className={`${inputClass} min-h-[100px]`}
                          value={item.sellerNotes}
                          onChange={(event) =>
                            updateDamageItem(item.id, (current) => ({
                              ...current,
                              sellerNotes: event.target.value,
                            }))
                          }
                          placeholder="Describe the visible issue and anything the seller already knows."
                        />
                      </Field>

                      <Field label="Upload Image" full>
                        <input
                          className={inputClass}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(event) =>
                            updateDamageItem(item.id, (current) => ({
                              ...current,
                              file: event.target.files?.[0] ?? null,
                            }))
                          }
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setDamageItems((current) => [...current, newDamageItem()])}
                className="mt-5 inline-flex items-center justify-center px-4 py-2 border border-[#C9A84C] text-[#1A2B4A] rounded-lg text-sm font-semibold"
              >
                Add Another Damage Item
              </button>
            </fieldset>

            <div className="border border-[#E6D7A5] bg-[#FFF8E8] rounded-xl p-5">
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#8A6B1F] mb-3">
                Disclaimer
              </p>
              <p className="text-sm leading-relaxed text-[#1A2B4A]">
                {SELLER_READINESS_DISCLAIMER}
              </p>
            </div>

            {error ? (
              <div className="text-sm text-[#B42318]">{error}</div>
            ) : null}

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#1A2B4A] text-white rounded-lg text-sm font-semibold disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Seller Readiness Assessment'}
              </button>
              <div className="text-sm text-[#6B7A90] leading-relaxed max-w-2xl">
                FPIA review is required before any public report is released. AI-assisted
                findings remain draft until authority review.
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

function Field({
  label,
  children,
  full = false,
  required = false,
}: {
  label: string
  children: React.ReactNode
  full?: boolean
  required?: boolean
}) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-semibold tracking-wide text-[#1A2B4A] uppercase mb-1.5">
        {label} {required ? <span className="text-[#C9A84C]">*</span> : null}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full px-4 py-3 rounded-lg border border-[#D8E2EE] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]'
