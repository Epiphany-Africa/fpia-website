import { NextResponse } from 'next/server'
import { buildProtectedCertificatePdf } from '@/lib/pdf/buildProtectedCertificatePdf'

export const dynamic = 'force-dynamic'

function buildDownloadFileName(documentId: string) {
  const safeId = documentId.replace(/[^A-Z0-9._-]+/gi, '_')
  return `FPIA-${safeId}.pdf`
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { documentId, pdfBytes } = await buildProtectedCertificatePdf(id)

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${buildDownloadFileName(documentId)}"`,
        'Cache-Control': 'no-store, max-age=0',
        'X-FPIA-PDF-Protection': 'encrypted',
      },
    })
  } catch (error) {
    const message =
      error instanceof Error && error.message === 'Certificate record not found.'
        ? 'Certificate not found.'
        : 'Protected PDF generation failed.'
    const status = message === 'Certificate not found.' ? 404 : 500

    return NextResponse.json({ error: message }, { status })
  }
}
