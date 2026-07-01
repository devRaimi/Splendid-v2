export const CONFIG = {
  ADMIN_PIN: import.meta.env.VITE_ADMIN_PIN ?? '0000',
  // WHATSAPP_NUMBER: import.meta.env.VITE_WA_NUMBER ?? '2348000000000',
  WHATSAPP_NUMBER_MINNA: import.meta.env.VITE_WA_NUMBER_MINNA ?? '2349040233239',
  WHATSAPP_NUMBER_ZARIA: import.meta.env.VITE_WA_NUMBER_ZARIA ?? '2349058482190',

  BANK: {
    minnaAccountNumber: import.meta.env.VITE_BANK_ACCT_MINNA ?? '8115781078',
    zariaAccountNumber: import.meta.env.VITE_BANK_ACCT_ZARIA ?? '9058482190',
    bankName: import.meta.env.VITE_BANK_NAME ?? 'Palmpay Bank',
    minnaAccountName: import.meta.env.VITE_BANK_HOLDER_MINNA ?? 'Awwal Abdrahim - Splendid Puff - Minna',
    zariaAccountName: import.meta.env.VITE_BANK_HOLDER_ZARIA ?? 'Sheu Hanifa - Splendid Puff - Zaria',
  },

  PRODUCTS: [
    { id: 'puff-5',      name: 'Puff-puff × 5',    emoji: '🍩', price: 500,  hasFlavour: true,  available: true, category: 'puff-puff',  description: '5 freshly fried puff-puff' },
    { id: 'puff-10',     name: 'Puff-puff × 10',   emoji: '🍩', price: 900,  hasFlavour: true,  available: true, category: 'puff-puff',  description: '10 pieces — great for sharing' },
    { id: 'puff-box',    name: 'Party box × 30',   emoji: '📦', price: 2500, hasFlavour: true,  available: true, category: 'puff-puff',  description: '30-piece box for events' },
    { id: 'small-chops', name: 'Small chops',      emoji: '🥡', price: 1500, hasFlavour: false, available: true, category: 'combos',     description: 'Puff-puff, samosa & spring rolls' },
    { id: 'zobo',        name: 'Zobo drink',        emoji: '🥤', price: 400,  hasFlavour: false, available: true, category: 'drinks',     description: 'Chilled hibiscus zobo' },
  ],

  FLAVOURS: ['Classic', 'Sugar-dusted', 'Cinnamon', 'Chocolate drizzle', 'Pepper & spice'],
  CAMPUSES: ['Main campus', 'Mini campus', 'Hostel area', 'Staff quarters'],

  STATUS_FLOW:    { pending: 'confirmed', confirmed: 'approved', approved: 'completed' },
  STATUS_ACTIONS: { pending: 'Confirm order', confirmed: 'approve order', approved: 'Complete order' },
};

export const makeRef    = () => `SP-${Math.floor(1000 + Math.random() * 9000)}`;
export const formatNaira = (n) => '₦' + Math.round(Number(n) || 0).toLocaleString('en-NG');
export const digitsOnly  = (s) => String(s ?? '').replace(/\D/g, '');
export const waLink      = (phone, msg) => `https://wa.me/${digitsOnly(phone)}?text=${encodeURIComponent(msg)}`;

export const itemsLabel = (items) => {
  if (Array.isArray(items)) return items.map(i => `${i.qty ?? ''}× ${i.name ?? i.id ?? ''}`).join(' · ');
  return String(items ?? '');
};
