/**
 * ┌─────────────────────────────────────────────────┐
 * │         SPLENDID PUFF — CONFIGURATION           │
 * │  Edit this file to update business settings.   │
 * └─────────────────────────────────────────────────┘
 */

export const CONFIG = {
  // ── Business info ─────────────────────────────────────────────
  BUSINESS_NAME: "Splendid Puff Nigeria",
  WHATSAPP_NUMBER: "2349040233239",

  // ── Bank details ─────────────────────────────────────────────
  BANK_ACCOUNT_NUMBER: "8115781078",
  BANK_NAME: "Palmpay",
  BANK_ACCOUNT_HOLDER: "Splendid Puff",

  // ── Admin ────────────────────────────────────────────────────
  ADMIN_PIN: "1234",

  // ── Google Sheets webhook ────────────────────────────────────
  SHEET_WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbzsRk9sV4bZaBp7yuEmLFGb3qRXWwQ4wLdkAlwn2Y5WPmaXarb0_YA9isQYGzx6omq90w/exec",

  // ── Products ─────────────────────────────────────────────────
  PRODUCTS: [
    {
      id: "puff",
      name: "Plain-Puff",
      emoji: "🍩",
      hasFlavour: true,
      sizes: [
        { label: "Small (5 pcs)", price: 600 },
        { label: "Large (10 pcs)", price: 1200 },
      ]
    },
    {
      id: "puff",
      name: "Spicy-Puff",
      emoji: "🍩",
      hasFlavour: true,
      sizes: [
        { label: "Small (5 pcs)", price: 750 },
        { label: "Large (10 pcs)", price: 1500 },
      ]
    },
    {
      id: "zobo",
      name: "Zobo Drink",
      emoji: "🥤",
      hasFlavour: false,
      sizes: [
        { label: "35cl", price: 600 },
      ]
    },
    {
      id: "kebab",
      name: "Puff Kebab",
      emoji: "🍢",
      hasFlavour: false,
      sizes: [
        { label: "1 stick", price: 2000 },
      ]
    }
  ],

  // ── Campuses ─────────────────────────────────────────────────
  CAMPUSES: ["Minna", "Zaria"],

  // ── Puff flavours ────────────────────────────────────────────
  FLAVOURS: ["Spicy", "Plain", "Mixed"],
};
