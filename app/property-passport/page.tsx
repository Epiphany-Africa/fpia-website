'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import FpiaPhoneInput from '@/components/FpiaPhoneInput'
import FpiaStepper from '@/components/FpiaStepper'

type PassportDocument = {
  id: string
  documentType: string
  issuedAt: string
  expiresAt: string
  file: File | null
  fileError: string | null
}

type PassportSubmissionResult = {
  profileId: string
  uploadedDocumentCount: number
  failedDocumentCount: number
}

const PASSPORT_STEPS = [
  { label: 'Property', meta: 'Address and owner details' },
  { label: 'Documents', meta: 'COCs, plans, and certificates' },
  { label: 'Confirm', meta: 'Create your free passport' },
]

const DOCUMENT_TYPE_OPTIONS = [
  'Electrical COC',
  'Plumbing COC',
  'Gas COC',
  'Electric Fence COC',
  'Beetle Certificate',
  'Approved House Plans',
  'Warranty Document',
  'Prior Inspection Report',
  'Other Property Record',
] as const

const MAX_DOCUMENT_SIZE_BYTES = 15 * 1024 * 1024
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']

function createEmptyDocument(): PassportDocument {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    documentType: DOCUMENT_TYPE_OPTIONS[0],
    issuedAt: '',
    expiresAt: '',
    file: null,
    fileError: null,
  }
}

function validateDocumentFile(file: File | null) {
  if (!file) return null
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return 'File exceeds the 15MB limit.'
  }
  if (file.type && !ACCEPTED_FILE_TYPES.includes(file.type)) {
    return 'Only PDF, JPG, PNG, and WEBP files are supported.'
  }
  return null
}

export default function PropertyPassportPage() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submissionResult, setSubmissionResult] = useState<PassportSubmissionResult | null>(null)

  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [suburb, setSuburb] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [notes, setNotes] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [documents, setDocuments] = useState<PassportDocument[]>([
    createEmptyDocument(),
  ])

  const validDocuments = useMemo(
    () => documents.filter((document) => document.file),
    [documents]
  )
  const documentsWithErrors = useMemo(
    () => documents.filter((document) => Boolean(document.fileError)),
    [documents]
  )

  function updateDocument(
    id: string,
    patch: Partial<PassportDocument>
  ) {
    setDocuments((current) =>
      current.map((document) =>
        document.id === id ? { ...document, ...patch } : document
      )
    )
  }

  function addDocumentRow() {
    setDocuments((current) => [...current, createEmptyDocument()])
  }

  function removeDocumentRow(id: string) {
    setDocuments((current) =>
      current.length === 1 ? current : current.filter((document) => document.id !== id)
    )
  }

  function canContinuePropertyStep() {
    return Boolean(
      ownerName.trim() &&
        ownerEmail.trim() &&
        ownerPhone.trim() &&
        propertyAddress.trim()
    )
  }

  async function handleSubmit() {
    setBusy(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('owner_name', ownerName.trim())
      formData.append('owner_email', ownerEmail.trim())
      formData.append('owner_phone', ownerPhone.trim())
      formData.append('property_address', propertyAddress.trim())
      formData.append('suburb', suburb.trim())
      formData.append('city', city.trim())
      formData.append('province', province.trim())
      formData.append('postal_code', postalCode.trim())
      formData.append('notes', notes.trim())
      formData.append('company_website', companyWebsite.trim())

      const documentPayload = validDocuments.map((document, index) => {
        formData.append(`document_file_${index}`, document.file as File)
        return {
          fieldName: `document_file_${index}`,
          documentType: document.documentType,
          issuedAt: document.issuedAt || null,
          expiresAt: document.expiresAt || null,
        }
      })

      formData.append('documents', JSON.stringify(documentPayload))

      const response = await fetch('/api/property-passport', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string
        profileId?: string
        uploadedDocumentCount?: number
        failedDocumentCount?: number
      }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Could not create your Property Passport.')
      }

      setSubmissionResult({
        profileId: payload.profileId ?? 'unknown',
        uploadedDocumentCount: payload.uploadedDocumentCount ?? validDocuments.length,
        failedDocumentCount: payload.failedDocumentCount ?? 0,
      })
      setSubmitted(true)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Could not create your Property Passport.'
      )
    } finally {
      setBusy(false)
    }
  }

  if (submitted) {
    const profileReference = submissionResult?.profileId
      ? `PP-${submissionResult.profileId.slice(0, 8).toUpperCase()}`
      : null
    const verificationParams = new URLSearchParams({
      inquiry: 'property-passport',
      name: ownerName.trim(),
      email: ownerEmail.trim(),
      phone: ownerPhone.trim(),
      role: 'Homeowner',
      message: [
        `I've created a Property Passport for ${propertyAddress.trim()}.`,
        profileReference ? `Passport reference: ${profileReference}` : '',
        `Uploaded documents accepted: ${submissionResult?.uploadedDocumentCount ?? validDocuments.length}.`,
        submissionResult?.failedDocumentCount
          ? `Documents that need attention: ${submissionResult.failedDocumentCount}.`
          : '',
        'Please contact me about document verification, missing records, and how to turn these uploads into FPIA-verified records.',
      ]
        .filter(Boolean)
        .join(' '),
    })

    return (
      <main
        style={{
          backgroundColor: 'var(--navy)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', color: 'var(--gold)', marginBottom: '18px' }}>
            ✓
          </div>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '2.4px',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '14px',
            }}
          >
            Property Passport Created
          </p>
          <h1
            style={{
              color: 'var(--off-white)',
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(32px, 5vw, 46px)',
              lineHeight: 1.08,
              marginBottom: '14px',
            }}
          >
            Your free document vault is open.
          </h1>
          <p style={{ color: 'var(--slate)', fontSize: '15px', lineHeight: 1.8 }}>
            Your property profile and uploaded records are now in the FPIA system.
            We keep homeowner uploads distinct from FPIA-verified records, so your
            documents remain useful immediately without pretending they are already
            certified.
          </p>
          <div
            style={{
              marginTop: '20px',
              display: 'grid',
              gap: '10px',
              border: '1px solid rgba(201,161,77,0.18)',
              backgroundColor: 'rgba(255,255,255,0.02)',
              padding: '18px',
              textAlign: 'left',
            }}
          >
            <div style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '1.8px', textTransform: 'uppercase' }}>
              Passport Summary
            </div>
            <div style={{ color: 'var(--off-white)', fontSize: '14px', lineHeight: 1.8 }}>
              Reference: {profileReference ?? 'Pending'}
            </div>
            <div style={{ color: 'var(--off-white)', fontSize: '14px', lineHeight: 1.8 }}>
              Documents accepted: {submissionResult?.uploadedDocumentCount ?? validDocuments.length}
            </div>
            <div style={{ color: 'var(--off-white)', fontSize: '14px', lineHeight: 1.8 }}>
              Documents needing attention: {submissionResult?.failedDocumentCount ?? 0}
            </div>
          </div>
          <div
            style={{
              marginTop: '24px',
              padding: '18px',
              border: '1px solid rgba(201,161,77,0.22)',
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            <p style={{ color: 'var(--off-white)', fontSize: '14px', lineHeight: 1.8, margin: 0 }}>
              Next best move: book an inspection or ask FPIA to verify the uploaded
              records so your passport becomes a trust asset, not just a storage folder.
            </p>
          </div>
          {submissionResult?.failedDocumentCount ? (
            <div
              style={{
                marginTop: '18px',
                padding: '16px 18px',
                border: '1px solid rgba(252,129,129,0.28)',
                backgroundColor: 'rgba(252,129,129,0.07)',
              }}
            >
              <p style={{ color: '#fbd5d5', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
                Some files were not accepted during upload. Use the verification enquiry so FPIA can help you identify replacements or missing records.
              </p>
            </div>
          ) : null}
          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/request-inspection" style={primaryButtonStyle}>
              Book Inspection
            </Link>
            <Link href={`/contact?${verificationParams.toString()}`} style={secondaryButtonStyle}>
              Ask FPIA To Verify Records
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: 'var(--navy)', minHeight: '100vh' }}>
      <section
        className="fpia-passport-hero"
        style={{ padding: '64px 80px 42px', borderBottom: '1px solid rgba(201,161,77,0.14)' }}
      >
        <p style={kickerStyle}>Property Passport</p>
        <h1
          style={{
            color: 'var(--off-white)',
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(34px, 5.5vw, 56px)',
            lineHeight: 1.06,
            maxWidth: '720px',
            marginBottom: '16px',
          }}
        >
          Build a free document vault for your home.
        </h1>
        <p style={{ color: 'var(--slate)', fontSize: '15px', lineHeight: 1.85, maxWidth: '680px' }}>
          Upload your COCs, approved plans, warranties, and prior inspection records into a single
          homeowner profile. FPIA stores the documents for free and keeps them separate from
          later verified inspection outcomes.
        </p>

        <div
          className="fpia-passport-benefits"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '14px',
            maxWidth: '980px',
            marginTop: '28px',
          }}
        >
          {[
            {
              title: 'Free Homeowner Vault',
              body: 'Centralise the records you already have before a sale, renewal, or insurer request.',
            },
            {
              title: 'Verified vs Uploaded',
              body: 'FPIA clearly separates homeowner uploads from authority-verified records.',
            },
            {
              title: 'Faster Future Inspections',
              body: 'Inspectors arrive with plans, certificates, and prior context instead of starting blind.',
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                border: '1px solid rgba(201,161,77,0.18)',
                backgroundColor: 'rgba(255,255,255,0.03)',
                padding: '18px',
              }}
            >
              <div style={{ color: 'var(--off-white)', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                {item.title}
              </div>
              <div style={{ color: 'var(--slate)', fontSize: '13px', lineHeight: 1.7 }}>
                {item.body}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '30px' }}>
          <FpiaStepper
            steps={PASSPORT_STEPS}
            currentStep={step}
            onStepSelect={setStep}
            canSelectStep={(index) => index <= step}
          />
        </div>
      </section>

      <section
        className="fpia-passport-form-shell"
        style={{ padding: '52px 80px 72px', maxWidth: '940px' }}
      >
        {step === 0 && (
          <div>
            <h2 style={sectionTitleStyle}>Homeowner and Property</h2>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  value={ownerName}
                  onChange={(event) => setOwnerName(event.target.value)}
                  style={darkInputStyle}
                  placeholder="e.g. Thandi Maseko"
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(event) => setOwnerEmail(event.target.value)}
                  style={darkInputStyle}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label style={labelStyle}>Mobile / WhatsApp</label>
                <FpiaPhoneInput
                  value={ownerPhone}
                  onValueChange={setOwnerPhone}
                  hint="Used only for passport support and future record alerts."
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Property Address</label>
                <input
                  value={propertyAddress}
                  onChange={(event) => setPropertyAddress(event.target.value)}
                  style={darkInputStyle}
                  placeholder="e.g. 12 Jacaranda Street, Bryanston"
                />
              </div>
              <div>
                <label style={labelStyle}>Suburb</label>
                <input
                  value={suburb}
                  onChange={(event) => setSuburb(event.target.value)}
                  style={darkInputStyle}
                  placeholder="e.g. Bryanston"
                />
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  style={darkInputStyle}
                  placeholder="e.g. Johannesburg"
                />
              </div>
              <div>
                <label style={labelStyle}>Province</label>
                <select
                  value={province}
                  onChange={(event) => setProvince(event.target.value)}
                  style={darkInputStyle}
                >
                  <option value="">Select province</option>
                  {[
                    'Gauteng',
                    'Western Cape',
                    'KwaZulu-Natal',
                    'Eastern Cape',
                    'Limpopo',
                    'Mpumalanga',
                    'North West',
                    'Free State',
                    'Northern Cape',
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Postal Code</label>
                <input
                  value={postalCode}
                  onChange={(event) => setPostalCode(event.target.value)}
                  style={darkInputStyle}
                  placeholder="e.g. 2191"
                />
              </div>
            </div>

            <div style={{ marginTop: '34px' }}>
              <button
                type="button"
                onClick={() => canContinuePropertyStep() && setStep(1)}
                disabled={!canContinuePropertyStep()}
                style={{
                  ...primaryButtonStyle,
                  opacity: canContinuePropertyStep() ? 1 : 0.45,
                  cursor: canContinuePropertyStep() ? 'pointer' : 'not-allowed',
                }}
              >
                Continue To Documents
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={sectionTitleStyle}>Upload Existing Records</h2>
            <p style={{ color: 'var(--slate)', fontSize: '14px', lineHeight: 1.8, marginBottom: '22px' }}>
              Upload anything you already have. These files help build the property history now, and
              they can later be checked or renewed through FPIA. Leave rows empty if you do not have the documents yet.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: '12px', lineHeight: 1.7, marginBottom: '22px' }}>
              Accepted files: PDF, JPG, PNG, and WEBP. Maximum size: 15MB per file.
            </p>

            <div style={{ display: 'grid', gap: '16px' }}>
              {documents.map((document, index) => (
                <div
                  key={document.id}
                  style={{
                    border: '1px solid rgba(201,161,77,0.18)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    padding: '18px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <div style={{ color: 'var(--off-white)', fontSize: '16px', fontWeight: 700 }}>
                      Document Slot {index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocumentRow(document.id)}
                      style={ghostButtonStyle}
                    >
                      Remove
                    </button>
                  </div>

                  <div style={gridStyle}>
                    <div>
                      <label style={labelStyle}>Document Type</label>
                      <select
                        value={document.documentType}
                        onChange={(event) =>
                          updateDocument(document.id, { documentType: event.target.value })
                        }
                        style={darkInputStyle}
                      >
                        {DOCUMENT_TYPE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Issued Date</label>
                      <input
                        type="date"
                        value={document.issuedAt}
                        onChange={(event) =>
                          updateDocument(document.id, { issuedAt: event.target.value })
                        }
                        style={darkInputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Expiry Date</label>
                      <input
                        type="date"
                        value={document.expiresAt}
                        onChange={(event) =>
                          updateDocument(document.id, { expiresAt: event.target.value })
                        }
                        style={darkInputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>File</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={(event) => {
                          const nextFile = event.target.files?.[0] ?? null
                          const fileError = validateDocumentFile(nextFile)

                          updateDocument(document.id, {
                            file: fileError ? null : nextFile,
                            fileError,
                          })
                        }}
                        style={{ ...darkInputStyle, paddingTop: '10px', paddingBottom: '10px' }}
                      />
                      {document.file ? (
                        <div style={{ color: 'var(--slate)', fontSize: '12px', marginTop: '8px' }}>
                          {document.file.name} • {Math.max(1, Math.round(document.file.size / 1024))} KB
                        </div>
                      ) : null}
                      {document.fileError ? (
                        <div style={{ color: '#fc8181', fontSize: '12px', marginTop: '8px' }}>
                          {document.fileError}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '18px', flexWrap: 'wrap' }}>
              <button type="button" onClick={addDocumentRow} style={secondaryButtonStyle}>
                Add Another Document
              </button>
              <div style={{ color: 'var(--slate)', fontSize: '13px', alignSelf: 'center' }}>
                {validDocuments.length} document{validDocuments.length === 1 ? '' : 's'} ready to upload
              </div>
            </div>
            {documentsWithErrors.length ? (
              <div
                style={{
                  marginTop: '18px',
                  padding: '16px 18px',
                  border: '1px solid rgba(252,129,129,0.28)',
                  backgroundColor: 'rgba(252,129,129,0.06)',
                }}
              >
                <p style={{ color: '#fbd5d5', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
                  Fix file issues before review. Unsupported or oversized files will be skipped.
                </p>
              </div>
            ) : null}

            <div style={{ display: 'flex', gap: '14px', marginTop: '34px', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setStep(0)} style={secondaryButtonStyle}>
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={documentsWithErrors.length > 0}
                style={{
                  ...primaryButtonStyle,
                  opacity: documentsWithErrors.length > 0 ? 0.5 : 1,
                  cursor: documentsWithErrors.length > 0 ? 'not-allowed' : 'pointer',
                }}
              >
                Review Passport
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={sectionTitleStyle}>Confirm Your Free Passport</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { label: 'Owner', value: ownerName },
                { label: 'Email', value: ownerEmail },
                { label: 'Phone', value: ownerPhone },
                { label: 'Property', value: propertyAddress },
                { label: 'Area', value: [suburb, city, province, postalCode].filter(Boolean).join(', ') || '—' },
                { label: 'Documents Uploaded', value: `${validDocuments.length}` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="fpia-passport-confirm-row"
                  style={{
                    border: '1px solid rgba(201,161,77,0.15)',
                    display: 'grid',
                    gridTemplateColumns: '170px 1fr',
                    gap: '14px',
                    padding: '14px 18px',
                  }}
                >
                  <div style={confirmLabelStyle}>{item.label}</div>
                  <div style={{ color: 'var(--off-white)', fontSize: '14px', lineHeight: 1.7 }}>
                    {item.value || '—'}
                  </div>
                </div>
                ))}
            </div>

            <div style={{ marginTop: '20px' }}>
              <div style={labelStyle}>Uploaded Records</div>
              <div
                style={{
                  border: '1px solid rgba(201,161,77,0.15)',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  padding: '16px 18px',
                }}
              >
                {validDocuments.length > 0 ? (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {validDocuments.map((document) => (
                      <div
                        key={document.id}
                        style={{
                          borderBottom: '1px solid rgba(201,161,77,0.12)',
                          paddingBottom: '12px',
                        }}
                      >
                        <div style={{ color: 'var(--off-white)', fontSize: '14px', fontWeight: 700 }}>
                          {document.documentType}
                        </div>
                        <div style={{ color: 'var(--slate)', fontSize: '13px', lineHeight: 1.7 }}>
                          {document.file?.name ?? 'No file name'}
                          {document.issuedAt ? ` • Issued ${document.issuedAt}` : ''}
                          {document.expiresAt ? ` • Expires ${document.expiresAt}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--slate)', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
                    No files attached yet. You can still create the passport and add or verify records later through FPIA.
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={labelStyle}>Notes For FPIA</label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                style={{ ...darkInputStyle, minHeight: '120px', resize: 'vertical' }}
                placeholder="Anything we should know about the property, the uploaded records, or missing certificates..."
              />
            </div>

            <div style={honeypotWrapStyle} aria-hidden="true">
              <label style={labelStyle}>Company website</label>
              <input
                value={companyWebsite}
                onChange={(event) => setCompanyWebsite(event.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={darkInputStyle}
              />
            </div>

            <div
              style={{
                marginTop: '20px',
                padding: '18px',
                border: '1px solid rgba(201,161,77,0.18)',
                backgroundColor: 'rgba(201,161,77,0.04)',
              }}
            >
              <p style={{ color: 'var(--slate)', fontSize: '13px', lineHeight: 1.8, margin: 0 }}>
                Homeowner uploads are stored as user-provided records until they are separately checked,
                renewed, or verified by FPIA. This keeps the database useful without overstating trust status.
              </p>
            </div>

            {error ? (
              <div style={{ color: '#fc8181', fontSize: '13px', marginTop: '16px' }}>{error}</div>
            ) : null}

            <div style={{ display: 'flex', gap: '14px', marginTop: '30px', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setStep(1)} style={secondaryButtonStyle}>
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={busy}
                style={{
                  ...primaryButtonStyle,
                  opacity: busy ? 0.6 : 1,
                  cursor: busy ? 'not-allowed' : 'pointer',
                }}
              >
                {busy ? 'Creating Passport...' : 'Create Free Property Passport'}
              </button>
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        @media (max-width: 980px) {
          .fpia-passport-hero,
          .fpia-passport-form-shell {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }

          .fpia-passport-benefits {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 720px) {
          .fpia-passport-confirm-row {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .fpia-passport-hero,
          .fpia-passport-form-shell {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }

          .fpia-passport-hero {
            padding-top: 44px !important;
            padding-bottom: 34px !important;
          }

          .fpia-passport-form-shell {
            padding-top: 34px !important;
            padding-bottom: 46px !important;
          }
        }
      `}</style>
    </main>
  )
}

const kickerStyle = {
  fontSize: '11px',
  letterSpacing: '2.5px',
  textTransform: 'uppercase',
  color: 'var(--gold)',
  marginBottom: '16px',
}

const sectionTitleStyle = {
  fontFamily: 'var(--font-serif)',
  fontSize: '30px',
  color: 'var(--off-white)',
  marginBottom: '20px',
}

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--gold)',
  marginBottom: '8px',
}

const confirmLabelStyle = {
  color: 'var(--gold)',
  fontSize: '11px',
  letterSpacing: '1.2px',
  textTransform: 'uppercase',
  paddingTop: '3px',
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '16px',
}

const darkInputStyle = {
  width: '100%',
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(201,161,77,0.24)',
  color: 'var(--off-white)',
  padding: '12px 16px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const primaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--gold)',
  color: 'var(--navy)',
  border: 'none',
  padding: '14px 26px',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  textDecoration: 'none',
}

const secondaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  color: 'var(--off-white)',
  border: '1px solid rgba(201,161,77,0.22)',
  padding: '14px 22px',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '1.2px',
  textTransform: 'uppercase',
  textDecoration: 'none',
}

const ghostButtonStyle = {
  background: 'transparent',
  border: '1px solid rgba(201,161,77,0.18)',
  color: 'var(--slate)',
  padding: '8px 12px',
  fontSize: '11px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  cursor: 'pointer',
}

const honeypotWrapStyle = {
  position: 'absolute' as const,
  left: '-9999px',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
}
