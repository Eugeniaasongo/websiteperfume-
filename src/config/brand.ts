export interface BrandConfig {
  name: string;
  tagline: string;
  currency: {
    code: string;
    symbol: string;
    locale: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  trustMessages: string[];
}

export const brandConfig: BrandConfig = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'VALOR & AURA',
  tagline: process.env.NEXT_PUBLIC_TAGLINE || 'Essence of Ghanaian High Perfumery',
  currency: {
    code: 'GHS',
    symbol: '₵',
    locale: 'en-GH',
  },
  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE || '+233 24 123 4567',
    whatsapp: process.env.NEXT_PUBLIC_PHONE || '+233 24 123 4567',
    email: process.env.NEXT_PUBLIC_EMAIL || 'concierge@valorandaura.com',
    address: process.env.NEXT_PUBLIC_ADDRESS || '12 Senchi Street, Airport Residential Area, Accra, Ghana',
  },
  socials: {
    instagram: 'https://instagram.com/valorandaura',
    facebook: 'https://facebook.com/valorandaura',
    tiktok: 'https://tiktok.com/@valorandaura',
  },
  trustMessages: [
    'Cash on Delivery Accepted',
    'Pay with MoMo or Card',
    'Express Delivery across Ghana',
  ],
};

export function formatPrice(amount: number): string {
  return `${brandConfig.currency.symbol}${amount.toLocaleString(brandConfig.currency.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
