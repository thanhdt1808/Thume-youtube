
export enum EmotionalTone {
  CURIOSITY = 'Curiosity',
  SHOCK = 'Shock',
  MYSTERY = 'Mystery',
  HOPE = 'Hope',
  URGENCY = 'Urgency'
}

export interface ThumbnailConfig {
  text: string;
  subjectDescription: string;
  tone: EmotionalTone;
  referenceImage: string | null;
  primaryColor: string;
  secondaryColor: string;
}

export interface GenerationResult {
  imageUrl: string;
  timestamp: number;
}
