import type { Metadata } from 'next'
import LegalPositionDocument from './LegalPositionDocument'

export const metadata: Metadata = {
  title: 'FPIA Legal Position Statement',
  description:
    'FPIA’s public legal position on voetstoots, the CPA, PPRA disclosure, and OTP suspensive conditions.',
}

export default function LegalPositionPage() {
  return <LegalPositionDocument />
}
