function simpleHash(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(16).padStart(16, '0')
}

type Status = 'Certified' | 'Pending' | 'NotCertified'

type AuditItem = {
  label: string
  value: string
}

type CategoryItem = {
  name: string
  status: 'Pass' | 'Pending' | 'Fail'
}

export default async function VerifyProperty({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const normalizedId = id.toUpperCase()

  let status: Status = 'Certified'

  if (normalizedId.includes('PENDING')) {
    status = 'Pending'
  } else if (
    normalizedId.includes('FAIL') ||
    normalizedId.includes('NOT') ||
    normalizedId.includes('INVALID')
  ) {
    status = 'NotCertified'
  }

  const verificationHash = simpleHash(id + status)

  const copyHash = () => {
    navigator.clipboard.writeText(verificationHash)
  }
  const auditTrail: AuditItem[] =
    status === 'Certified'
      ? [
          { label: 'Record Created', value: '14 March 2024 · 09:12' },
          { label: 'Record Locked', value: '14 March 2024 · 11:48' },
          { label: 'Last Verified', value: '30 March 2026 · 08:41' },
        ]
      : status === 'Pending'
      ? [
          { label: 'Record Created', value: '30 March 2026 · 08:05' },
          { label: 'Inspection Scheduled', value: '31 March 2026 · 10:00' },
          { label: 'Last Verified', value: '30 March 2026 · 08:41' },
        ]
      : [
          { label: 'Lookup Performed', value: '30 March 2026 · 08:41' },
          { label: 'Registry Match', value: 'No active certification found' },
          { label: 'Last Verified', value: '30 March 2026 · 08:41' },
        ]

  const categories: CategoryItem[] =
    status === 'NotCertified'
      ? [
          { name: 'Electrical', status: 'Fail' },
          { name: 'Structural', status: 'Fail' },
          { name: 'Gas', status: 'Fail' },
          { name: 'Entomology', status: 'Fail' },
          { name: 'Electric Fence', status: 'Fail' },
          { name: 'Roof', status: 'Fail' },
        ]
      : status === 'Pending'
      ? [
          { name: 'Electrical', status: 'Pending' },
          { name: 'Structural', status: 'Pending' },
          { name: 'Gas', status: 'Pending' },
          { name: 'Entomology', status: 'Pending' },
          { name: 'Electric Fence', status: 'Pending' },
          { name: 'Roof', status: 'Pending' },
        ]
      : [
          { name: 'Electrical', status: 'Pass' },
          { name: 'Structural', status: 'Pass' },
          { name: 'Gas', status: 'Pass' },
          { name: 'Entomology', status: 'Pass' },
          { name: 'Electric Fence', status: 'Pass' },
          { name: 'Roof', status: 'Pass' },
        ]

  const mock = {
    id,
    address: '22 Zimbali Wedge, Ballito',
    province: 'KZN, 4420',
    status,
    inspectionDate: '14 March 2024',
    inspector: 'S. van der Merwe — SACPCMP Reg.',
    validUntil: status === 'Certified' ? '14 March 2025' : 'Not applicable',
    ledger: status === 'Certified' ? 'Block #88,241' : 'No active ledger entry',
    auditTrail,
    categories,
  }

  const statusContent: Record<
    Status,
    { title: string; message: string }
  > = {
    Certified: {
      title: 'This property is currently certified.',
      message:
        'This record confirms that the certificate has been verified against the official FPIA registry and reflects the current certified status of the property.',
    },
    Pending: {
      title: 'This property is currently pending certification.',
      message:
        'An FPIA inspection or review is currently in progress. A final certification outcome has not yet been issued on the official registry.',
    },
    NotCertified: {
      title: 'This property is not currently certified.',
      message:
        'No valid active certification was found for this property on the official FPIA registry based on the certificate reference provided.',
    },
  }

  const statementStyles: Record<
    Status,
    { border: string; titleColor: string; backgroundColor: string }
  > = {
    Certified: {
      border: '1px solid rgba(201,161,77,0.3)',
      titleColor: '#1a7f37',
      backgroundColor: '#fff',
    },
    Pending: {
      border: '1px solid rgba(21,101,192,0.28)',
      titleColor: '#1565C0',
      backgroundColor: '#f8fbff',
    },
    NotCertified: {
      border: '1px solid rgba(198,40,40,0.28)',
      titleColor: '#C62828',
      backgroundColor: '#fff8f8',
    },
  }

  const statusStyles: Record<string, React.CSSProperties> = {
    Certified: {
      background: '#E8F5E9',
      color: '#2E7D32',
      border: '1px solid #2E7D32',
    },
    Pending: {
      background: '#E3F2FD',
      color: '#1565C0',
      border: '1px solid #1565C0',
    },
    NotCertified: {
      background: '#FFEBEE',
      color: '#C62828',
      border: '1px solid #C62828',
    },
  }

  const integrityValueColor =
    mock.status === 'Certified'
      ? 'var(--off-white)'
      : mock.status === 'Pending'
      ? '#BBDEFB'
      : '#E8E2E2'

  const auditBorderColor =
    mock.status === 'Certified'
      ? '2px solid rgba(46,125,50,0.6)'
      : mock.status === 'Pending'
      ? '2px solid rgba(21,101,192,0.6)'
      : '2px solid rgba(198,40,40,0.6)'

  return (
    <main
      style={{
        backgroundColor: 'var(--off-white)',
        color: 'var(--navy)',
        fontFamily: "'DM Sans', sans-serif",
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px' }}>
        {/* Status banner */}
        <div
          style={{
            backgroundColor: 'var(--navy)',
            borderRadius: '4px 4px 0 0',
            padding: '32px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <p
              style={{
                color: 'var(--gold)',
                fontSize: '11px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              FPIA Verified Property Record
            </p>
            <p style={{ color: '#a0aec0', fontSize: '14px' }}>#{mock.id}</p>
          </div>

          <span
            style={{
              ...statusStyles[mock.status],
              padding: '6px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            ✔{' '}
            {mock.status === 'NotCertified'
              ? 'NOT CERTIFIED'
              : mock.status.toUpperCase()}
          </span>
        </div>

        {/* Verification Outcome */}
        <div
          style={{
            backgroundColor: statementStyles[mock.status].backgroundColor,
            border: statementStyles[mock.status].border,
            padding: '20px 24px',
            marginBottom: '16px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              margin: '0 0 10px 0',
              fontWeight: 700,
            }}
          >
            Verification Outcome
          </p>

          <p
            style={{
              fontSize: '16px',
              color: statementStyles[mock.status].titleColor,
              lineHeight: 1.5,
              margin: '0 0 10px 0',
              fontWeight: 600,
            }}
          >
            {statusContent[mock.status].title}
          </p>

          <p
            style={{
              fontSize: '14px',
              color: 'var(--navy)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {statusContent[mock.status].message}
          </p>
        </div>

        {/* Integrity Strip */}
        <div
          style={{
            backgroundColor: 'var(--navy)',
            border: '1px solid rgba(201,161,77,0.22)',
            padding: '18px 24px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '20px',
            }}
          >
            <div>
              <p style={integrityLabelStyle}>Record Integrity</p>
              <p style={{ ...integrityValueStyle, color: integrityValueColor }}>
                {mock.status === 'Certified'
                  ? 'Locked'
                  : mock.status === 'Pending'
                  ? 'In Review'
                  : 'No Active Lock'}
              </p>
            </div>

            <div>
              <p style={integrityLabelStyle}>Registry Match</p>
              <p style={{ ...integrityValueStyle, color: integrityValueColor }}>
                {mock.status === 'NotCertified' ? 'No Match Found' : 'Confirmed'}
              </p>
            </div>

            <div>
              <p style={integrityLabelStyle}>Ledger Reference</p>
              <p style={{ ...integrityValueStyle, color: integrityValueColor }}>
                {mock.ledger}
              </p>
            </div>

            <div>
              <p style={integrityLabelStyle}>Verification Hash</p>
<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <p
    style={{
      fontSize: '14px',
      color: integrityValueColor,
      margin: 0,
      fontWeight: 600,
      fontFamily: 'monospace',
      letterSpacing: '1px',
    }}
  >
    {verificationHash}
  </p>

  <button
    onClick={copyHash}
    style={{
      fontSize: '11px',
      padding: '4px 8px',
      border: '1px solid rgba(201,161,77,0.4)',
      background: 'transparent',
      color: 'var(--gold)',
      cursor: 'pointer',
    }}
  >
    Copy
  </button>
</div>
            </div>
          </div>
        </div>

        {/* Audit Trail */}
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(11,31,51,0.08)',
            padding: '24px',
            marginBottom: '16px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              margin: '0 0 18px 0',
              fontWeight: 700,
            }}
          >
            Audit Trail
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '20px',
            }}
          >
            {mock.auditTrail.map((item, i) => (
              <div
                key={i}
                style={{
                  borderLeft: auditBorderColor,
                  paddingLeft: '14px',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: '#6C7077',
                    margin: '0 0 8px 0',
                    fontWeight: 700,
                  }}
                >
                  {item.label}
                </p>

                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--navy)',
                    margin: 0,
                    fontWeight: 600,
                    lineHeight: 1.5,
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Property details */}
        <div
          style={{
            backgroundColor: '#fff',
            padding: '40px',
            borderLeft: '1px solid #eee',
            borderRight: '1px solid #eee',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '8px',
            }}
          >
            Property
          </p>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '28px',
              marginBottom: '4px',
            }}
          >
            {mock.address}
          </h2>
          <p style={{ color: '#666', marginBottom: '40px' }}>{mock.province}</p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0',
              borderTop: '1px solid #eee',
            }}
          >
            {[
              { label: 'Inspection Date', value: mock.inspectionDate },
              { label: 'Inspector', value: mock.inspector },
              { label: 'Certificate Valid Until', value: mock.validUntil },
              { label: 'Ledger Entry', value: mock.ledger },
            ].map((row, i) => (
              <div
                key={i}
                style={{
                  padding: '20px 0',
                  borderBottom: '1px solid #eee',
                  paddingRight: '24px',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#999',
                    marginBottom: '6px',
                  }}
                >
                  {row.label}
                </p>
                <p style={{ fontWeight: 600, color: 'var(--navy)' }}>{row.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance categories */}
        <div
          style={{
            backgroundColor: '#fff',
            padding: '40px',
            borderLeft: '1px solid #eee',
            borderRight: '1px solid #eee',
            borderTop: '1px solid #eee',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '24px',
            }}
          >
            Compliance Categories
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
          >
            {mock.categories.map((cat, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: 'var(--off-white)',
                  borderRadius: '4px',
                }}
              >
                <span style={{ fontSize: '14px', color: 'var(--navy)' }}>
                  {cat.name}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color:
                      cat.status === 'Pass'
                        ? '#2E7D32'
                        : cat.status === 'Pending'
                        ? '#1565C0'
                        : '#C62828',
                    fontWeight: 600,
                  }}
                >
                  {cat.status === 'Pass'
                    ? '✔'
                    : cat.status === 'Pending'
                    ? '•'
                    : '✕'}{' '}
                  {cat.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ledger footer */}
        <div
          style={{
            backgroundColor: 'var(--navy)',
            borderRadius: '0 0 4px 4px',
            padding: '24px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p style={{ color: '#a0aec0', fontSize: '12px' }}>
            Verified on the FPIA immutable ledger · fairproperties.org.za
          </p>
          <p style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: 600 }}>
            {mock.ledger}
          </p>
        </div>
      </div>

      <p
        style={{
          textAlign: 'center',
          color: '#999',
          fontSize: '12px',
          paddingBottom: '60px',
        }}
      >
        This certificate was issued by the Fair Property Inspection Authority (FPIA)
        · South Africa
      </p>
    </main>
  )
}

const integrityLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: 'var(--gold)',
  margin: '0 0 8px 0',
  fontWeight: 700,
}

const integrityValueStyle: React.CSSProperties = {
  fontSize: '14px',
  margin: 0,
  fontWeight: 600,
}

