
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

export enum PrimaryMode {
  DISABLED = 'Disabled',
  ENABLED = 'Enabled',
  AUTO = 'Auto'
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
  temperature: number;
  vibrancy: number;
  intensity: number;
}

export interface ThumbnailStrategy {
  clarity: 'Standard' | 'High' | 'Ultra';
  contrast: 'Soft' | 'Strong' | 'Aggressive';
  focus: 'Subject' | 'Text' | 'Background' | 'Balanced';
  mobile: 'Standard' | 'Optimal' | 'Extreme';
}

export interface ThumbnailConfig {
  text: string;
  subjectDescription: string;
  tone: EmotionalTone;
  referenceImage: string | null;
  primaryColor: string;
  primaryMode: PrimaryMode;
  adjustments: ImageAdjustments;
  strategy: ThumbnailStrategy;
  layoutPresetId: string;
  autoCorrection: boolean;
}
