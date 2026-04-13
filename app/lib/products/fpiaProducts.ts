export type FpiaProductId =
  | 'inspection_product'
  | 'upgrade_product'
  | 'seller_precert_package'

export type FpiaProduct = {
  id: FpiaProductId
  name: string
  usageSubheading: string
  certificateOutcome: string
  priceLabel: string
  price: string
  valueMicrocopy: string
  description: string
  systemTrigger: string
  triggerRoute: string
  ctaLabel: string
  ctaHref: string
}

export const fpiaProducts: FpiaProduct[] = [
  {
    id: 'inspection_product',
    name: 'Inspection Product',
    usageSubheading: 'When no verified record exists',
    certificateOutcome: 'Conditional Certificate',
    priceLabel: 'Fixed Fee',
    price: 'R3,500',
    valueMicrocopy:
      'Independent inspection with a verifiable property condition record',
    description:
      'Independent property inspection that creates the initial FPIA record and may issue a conditional certificate where findings or outstanding items remain.',
    systemTrigger:
      'Triggered when a buyer, seller, or agent requests a new inspection for a property that does not yet have a current verified record.',
    triggerRoute: '/request-inspection',
    ctaLabel: 'Request Inspection',
    ctaHref: '/request-inspection',
  },
  {
    id: 'upgrade_product',
    name: 'Upgrade Product',
    usageSubheading: 'After issues have been resolved',
    certificateOutcome: 'Verified Certification',
    priceLabel: 'Fixed Fee',
    price: 'R1,500',
    valueMicrocopy:
      'Follow-up verification to achieve full certification',
    description:
      'Follow-up verification service used after conditional findings have been resolved so the property can be reviewed for full verified certification.',
    systemTrigger:
      'Triggered after a conditional certificate when outstanding items have been corrected and a verification follow-up is required.',
    triggerRoute: '/verify/[id]',
    ctaLabel: 'Upgrade to Verified',
    ctaHref: '/verify',
  },
  {
    id: 'seller_precert_package',
    name: 'Seller Pre-Certification Package',
    usageSubheading: 'Before listing your property',
    certificateOutcome: 'Pre-Listing Inspection Package',
    priceLabel: 'Fixed Fee',
    price: 'R5,500',
    valueMicrocopy:
      'Prepare and certify your property before going to market',
    description:
      'Seller-led pre-listing package that prepares a property for market with inspection scheduling, document capture, and a certification pathway before buyer negotiations begin.',
    systemTrigger:
      'Triggered when a seller or listing agent registers a property before listing or marketing the asset to buyers.',
    triggerRoute: '/register',
    ctaLabel: 'Start Pre-Certification',
    ctaHref: '/register',
  },
]

export function getFpiaProduct(id: FpiaProductId): FpiaProduct {
  const product = fpiaProducts.find((item) => item.id === id)

  if (!product) {
    throw new Error(`Unknown FPIA product: ${id}`)
  }

  return product
}
