export interface CertificateTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  elements: CertificateElement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificateElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'line' | 'placeholder';
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  // Text properties
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
  textDecoration?: string;
  letterSpacing?: number;
  lineHeight?: number;
  fill?: string;
  // Image properties
  src?: string;
  // Shape properties
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'star' | 'polygon';
  stroke?: string;
  strokeWidth?: number;
  // Placeholder properties
  placeholderKey?: string;
  // Layer order
  zIndex?: number;
}

export interface PageSize {
  name: string;
  width: number;
  height: number;
  orientation: 'landscape' | 'portrait';
}

export interface RecipientData {
  [key: string]: string;
}

export interface ColumnMapping {
  placeholder: string;
  column: string;
}

export interface GenerationProgress {
  current: number;
  total: number;
  status: 'idle' | 'generating' | 'complete' | 'error';
  message?: string;
}

export interface ExportSettings {
  format: 'pdf' | 'png' | 'jpg';
  quality: number;
  namingPattern: string;
}

export const PAGE_SIZES: PageSize[] = [
  { name: 'A4 Landscape', width: 1123, height: 794, orientation: 'landscape' },
  { name: 'A4 Portrait', width: 794, height: 1123, orientation: 'portrait' },
  { name: 'A5 Landscape', width: 794, height: 559, orientation: 'landscape' },
  { name: 'A5 Portrait', width: 559, height: 794, orientation: 'portrait' },
  { name: 'Letter Landscape', width: 1056, height: 816, orientation: 'landscape' },
  { name: 'Letter Portrait', width: 816, height: 1056, orientation: 'portrait' },
  { name: 'Custom', width: 1000, height: 700, orientation: 'landscape' },
];

export const FONT_FAMILIES = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Raleway', value: 'Raleway' },
  { name: 'Dancing Script', value: 'Dancing Script' },
  { name: 'Great Vibes', value: 'Great Vibes' },
  { name: 'Satisfy', value: 'Satisfy' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Arial', value: 'Arial' },
];

export const DEFAULT_PLACEHOLDERS = [
  '{{Name}}',
  '{{Course_Name}}',
  '{{Organization_Name}}',
  '{{Date}}',
  '{{Certificate_ID}}',
  '{{Email}}',
  '{{Title}}',
  '{{Description}}',
];
