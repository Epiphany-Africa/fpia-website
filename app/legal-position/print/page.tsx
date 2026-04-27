import type { Metadata } from 'next'
import LegalPositionDocument from '../LegalPositionDocument'

export const metadata: Metadata = {
  title: 'FPIA Legal Position Statement PDF-Ready View',
  description:
    'Print-friendly FPIA legal position statement for save-as-PDF use.',
}

export default function LegalPositionPrintPage() {
  return <LegalPositionDocument printMode />
}
