/** Canonical social URLs for Digikon Marketing (single source of truth). */
export const INSTAGRAM_PROFILE_URL =
  "https://www.instagram.com/digikon.marketing/" as const;

/** E.164 without spaces (India). */
export const DIGIKON_PHONE_E164 = "+919101801200" as const;

/** WhatsApp deep link (digits only in path). */
export const DIGIKON_WHATSAPP_URL = "https://wa.me/919101801200" as const;

/** Human-friendly display (use DIGIKON_PHONE_E164 for tel:). */
export const DIGIKON_PHONE_DISPLAY = "+91 91018 01200" as const;
