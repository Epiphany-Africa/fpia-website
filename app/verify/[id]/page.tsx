export default async function VerifyProperty({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const mock = {
    id,
    address: '22 Zimbali Wedge, Ballito',
    province: 'KZN, 4420',
    status: 'Certified' as const,
    inspectionDate: '14 March 2024',
    inspector: 'S. van der Merwe — SACPCMP Reg.',
    validUntil: '14 March 2025',
    ledger: 'Block #88,241',
    categories: [
  { name: 'Electrical', status: 'Pass' },
  { name: 'Structural', status: 'Pass' },
  { name: 'Gas', status: 'Pass' },
  { name: 'Entomology', status: 'Pass' },
  { name: 'Electric Fence', status: 'Pass' },
  { name: 'Roof', status: 'Pass' },
]
  }

  const statusStyles: Record<string, React.CSSProperties> = {
    Certified:    { background: '#E8F5E9', color: '#2E7D32', border: '1px solid #2E7D32' },
    Conditional:  { background: '#FFFDE7', color: '#F57F17', border: '1px solid #F9A825' },
    Pending:      { background: '#E3F2FD', color: '#1565C0', border: '1px solid #1565C0' },
    InProgress:   { background: '#F3E5F5', color: '#6A1B9A', border: '1px solid #6A1B9A' },
    NotCertified: { background: '#FFEBEE', color: '#C62828', border: '1px solid #C62828' },
  }

  return (
    <main style={{ backgroundColor: 'var(--off-white)', color: 'var(--navy)', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>

      {/* Main card */}
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px' }}>

        {/* Status banner */}
        <div style={{ backgroundColor: 'var(--navy)', borderRadius: '4px 4px 0 0', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>FPIA Verified Property Record</p>
            <p style={{ color: '#a0aec0', fontSize: '14px' }}>#{mock.id}</p>
          </div>
          <span style={{ ...statusStyles[mock.status], padding: '6px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 600 }}>
           ✔ {mock.status.toUpperCase()}
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(201,161,77,0.3)',
            padding: '20px 24px',
            marginBottom: '16px',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'var(--navy)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            This record confirms that the certificate presented has been verified against the official FPIA registry and reflects the current certified status of the property.
          </p>
        </div>

        {/* Property details */}
        <div style={{ backgroundColor: '#fff', padding: '40px', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>
          <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>Property</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '28px', marginBottom: '4px' }}>{mock.address}</h2>
          <p style={{ color: '#666', marginBottom: '40px' }}>{mock.province}</p>

          {/* Meta grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderTop: '1px solid #eee' }}>
            {[
              { label: 'Inspection Date', value: mock.inspectionDate },
              { label: 'Inspector', value: mock.inspector },
              { label: 'Certificate Valid Until', value: mock.validUntil },
              { label: 'Ledger Entry', value: mock.ledger },
            ].map((row, i) => (
              <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid #eee', paddingRight: '24px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#999', marginBottom: '6px' }}>{row.label}</p>
                <p style={{ fontWeight: 600, color: 'var(--navy)' }}>{row.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance categories */}
        <div style={{ backgroundColor: '#fff', padding: '40px', borderLeft: '1px solid #eee', borderRight: '1px solid #eee', borderTop: '1px solid #eee' }}>
          <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '24px' }}>Compliance Categories</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {mock.categories.map((cat, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--off-white)', borderRadius: '4px' }}>
                <span style={{ fontSize: '14px', color: 'var(--navy)' }}>{cat.name}</span>
                <span style={{ fontSize: '12px', color: '#2E7D32', fontWeight: 600 }}>✔ {cat.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ledger footer */}
        <div style={{ backgroundColor: 'var(--navy)', borderRadius: '0 0 4px 4px', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#a0aec0', fontSize: '12px' }}>Verified on the FPIA immutable ledger · fairproperties.org.za</p>
          <p style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: 600 }}>{mock.ledger}</p>
        </div>

      </div>

      {/* Disclaimer */}
      <p style={{ textAlign: 'center', color: '#999', fontSize: '12px', paddingBottom: '60px' }}>
        This certificate was issued by the Fair Property Inspection Authority (FPIA) · South Africa
      </p>

    </main>
  )
}

