// File validation helpers
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ACCEPTED_PDF_TYPES = "application/pdf";
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const PLAN_CONFIG = {
  free: {
    name: "Free",
    maxBooks: 1,
    maxSessionsPerMonth: 5,
    maxMinutesPerSession: 5,
    hasHistory: false,
    price: 0,
  },
  standard: {
    name: "Standard",
    maxBooks: 10,
    maxSessionsPerMonth: 100,
    maxMinutesPerSession: 15,
    hasHistory: true,
    price: 8,
  },
  pro: {
    name: "Pro",
    maxBooks: 100,
    maxSessionsPerMonth: Infinity, // Unlimited
    maxMinutesPerSession: 60,
    hasHistory: true,
    price: 15,
  },
} as const;

export type PlanLevel = keyof typeof PLAN_CONFIG;
