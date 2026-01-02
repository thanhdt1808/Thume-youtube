
export enum EmotionalTone {
  CURIOSITY = 'Curiosity',
  SHOCK = 'Shock',
  MYSTERY = 'Mystery',
  HOPE = 'Hope',
  URGENCY = 'Urgency',
  VINTAGE = 'Vintage',
  MINIMALIST = 'Minimalist',
  CYBERPUNK = 'Cyberpunk'
}

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  hue: number;
  sepia: number;
  invert: boolean;
  grayscale: number;
  temperature: number; // Simulated
  vibrancy: number;    // Simulated
}

export interface ThumbnailConfig {
  text: string;
  subjectDescription: string;
  tone: EmotionalTone;
  referenceImage: string | null;
  primaryColor: string;
  usePrimaryColor: boolean;
  adjustments: ImageAdjustments;
}

export interface GenerationResult {
  imageUrl: string;
  timestamp: number;
}
