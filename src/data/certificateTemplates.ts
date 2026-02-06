import { CertificateTemplate, CertificateElement } from '@/types/certificate';
import { v4 as uuidv4 } from 'uuid';

export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  category: 'completion' | 'participation' | 'achievement' | 'internship' | 'appreciation' | 'professional';
  preview: string;
  template: Omit<CertificateTemplate, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface TemplateCategory {
  id: PresetTemplate['category'];
  label: string;
  color: string;
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: 'professional', label: 'Professional', color: 'text-blue-400' },
  { id: 'completion', label: 'Course Completion', color: 'text-emerald-400' },
  { id: 'participation', label: 'Participation', color: 'text-violet-400' },
  { id: 'achievement', label: 'Achievement', color: 'text-amber-400' },
  { id: 'internship', label: 'Internship', color: 'text-teal-400' },
  { id: 'appreciation', label: 'Appreciation', color: 'text-rose-400' },
];

// Canvas center X position for A4 Landscape (1123px width)
const CENTER_X = 561;

const createTextElement = (
  text: string,
  x: number,
  y: number,
  options: Partial<CertificateElement> = {}
): Omit<CertificateElement, 'id'> => ({
  type: 'text',
  x,
  y,
  text,
  fontFamily: 'Inter',
  fontSize: 24,
  fontWeight: 'normal',
  fill: '#000000',
  textAlign: 'center',
  ...options,
});

const createPlaceholderElement = (
  key: string,
  x: number,
  y: number,
  options: Partial<CertificateElement> = {}
): Omit<CertificateElement, 'id'> => ({
  type: 'placeholder',
  x,
  y,
  text: `{{${key}}}`,
  placeholderKey: key,
  fontFamily: 'Inter',
  fontSize: 32,
  fontWeight: 'bold',
  fill: '#1e3a5f',
  textAlign: 'center',
  ...options,
});

const createShapeElement = (
  x: number,
  y: number,
  width: number,
  height: number,
  options: Partial<CertificateElement> = {}
): Omit<CertificateElement, 'id'> => ({
  type: 'shape',
  x,
  y,
  width,
  height,
  shapeType: 'rectangle',
  fill: '#e2e8f0',
  stroke: '#94a3b8',
  strokeWidth: 1,
  ...options,
});

const createLineElement = (
  x: number,
  y: number,
  width: number,
  options: Partial<CertificateElement> = {}
): Omit<CertificateElement, 'id'> => ({
  type: 'line',
  x,
  y,
  width,
  height: 2,
  fill: '#c9a227',
  strokeWidth: 2,
  ...options,
});

export const PRESET_TEMPLATES: PresetTemplate[] = [
  // ===== PROFESSIONAL TEMPLATES (Tech Company Style) =====
  {
    id: 'google-style',
    name: 'Tech Modern - Google Style',
    description: 'Clean, minimal design inspired by Google certificates',
    category: 'professional',
    preview: '🔵',
    template: {
      name: 'Professional Certificate',
      width: 1123,
      height: 794,
      backgroundColor: '#ffffff',
      elements: [
        // Top colorful bar - gradient effect with 4 colors
        createShapeElement(0, 0, 281, 8, { fill: '#4285f4', stroke: 'transparent', zIndex: 0 }),
        createShapeElement(281, 0, 281, 8, { fill: '#ea4335', stroke: 'transparent', zIndex: 1 }),
        createShapeElement(562, 0, 281, 8, { fill: '#fbbc04', stroke: 'transparent', zIndex: 2 }),
        createShapeElement(843, 0, 280, 8, { fill: '#34a853', stroke: 'transparent', zIndex: 3 }),
        // Subtle bottom gradient bar
        createShapeElement(0, 786, 281, 8, { fill: '#4285f4', stroke: 'transparent', zIndex: 4 }),
        createShapeElement(281, 786, 281, 8, { fill: '#ea4335', stroke: 'transparent', zIndex: 5 }),
        createShapeElement(562, 786, 281, 8, { fill: '#fbbc04', stroke: 'transparent', zIndex: 6 }),
        createShapeElement(843, 786, 280, 8, { fill: '#34a853', stroke: 'transparent', zIndex: 7 }),
        // Google logo circle
        createShapeElement(CENTER_X - 30, 40, 60, 60, { 
          shapeType: 'circle', 
          fill: '#4285f4', 
          stroke: 'transparent',
          zIndex: 8 
        }),
        // Main content - all centered
        createTextElement('Certificate of Completion', CENTER_X, 140, {
          fontFamily: 'Roboto',
          fontSize: 36,
          fontWeight: 'normal',
          fill: '#202124',
          zIndex: 9,
        }),
        createPlaceholderElement('Name', CENTER_X, 220, {
          fontFamily: 'Roboto',
          fontSize: 48,
          fontWeight: 'bold',
          fill: '#202124',
          zIndex: 10,
        }),
        createTextElement('has successfully completed', CENTER_X, 300, {
          fontFamily: 'Roboto',
          fontSize: 18,
          fontWeight: 'normal',
          fill: '#5f6368',
          zIndex: 11,
        }),
        createPlaceholderElement('Course_Name', CENTER_X, 360, {
          fontFamily: 'Roboto',
          fontSize: 28,
          fontWeight: 'bold',
          fill: '#1a73e8',
          zIndex: 12,
        }),
        createTextElement('an online non-credit course authorized by', CENTER_X, 420, {
          fontFamily: 'Roboto',
          fontSize: 16,
          fill: '#5f6368',
          zIndex: 13,
        }),
        createPlaceholderElement('Organization_Name', CENTER_X, 470, {
          fontFamily: 'Roboto',
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#202124',
          zIndex: 14,
        }),
        // Signature lines - properly centered
        createLineElement(CENTER_X - 300, 580, 200, { fill: '#dadce0', strokeWidth: 1, zIndex: 15 }),
        createLineElement(CENTER_X + 100, 580, 200, { fill: '#dadce0', strokeWidth: 1, zIndex: 16 }),
        createPlaceholderElement('Date', CENTER_X - 200, 600, {
          fontFamily: 'Roboto',
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#5f6368',
          zIndex: 17,
        }),
        createTextElement('Date of Completion', CENTER_X - 200, 625, {
          fontFamily: 'Roboto',
          fontSize: 11,
          fill: '#80868b',
          zIndex: 18,
        }),
        createTextElement('Instructor Signature', CENTER_X + 200, 625, {
          fontFamily: 'Roboto',
          fontSize: 11,
          fill: '#80868b',
          zIndex: 19,
        }),
        createPlaceholderElement('Certificate_ID', CENTER_X, 720, {
          fontFamily: 'Roboto',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#9aa0a6',
          zIndex: 20,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
  {
    id: 'coursera-style',
    name: 'Platform Style - Coursera',
    description: 'Professional learning platform certificate design',
    category: 'professional',
    preview: '📚',
    template: {
      name: 'Course Certificate',
      width: 1123,
      height: 794,
      backgroundColor: '#ffffff',
      elements: [
        // Blue header bar with gradient effect
        createShapeElement(0, 0, 1123, 100, { fill: '#0056d2', stroke: 'transparent', zIndex: 0 }),
        createShapeElement(0, 100, 1123, 4, { fill: '#003d99', stroke: 'transparent', zIndex: 1 }),
        createTextElement('COURSERA', 100, 40, {
          fontFamily: 'Arial',
          fontSize: 28,
          fontWeight: 'bold',
          fill: '#ffffff',
          textAlign: 'left',
          zIndex: 2,
        }),
        // Main content - all centered
        createTextElement('Certificate of Completion', CENTER_X, 160, {
          fontFamily: 'Georgia',
          fontSize: 32,
          fontWeight: 'normal',
          fill: '#1f1f1f',
          zIndex: 3,
        }),
        createPlaceholderElement('Date', CENTER_X, 210, {
          fontFamily: 'Arial',
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#636363',
          zIndex: 4,
        }),
        createPlaceholderElement('Name', CENTER_X, 290, {
          fontFamily: 'Georgia',
          fontSize: 44,
          fontWeight: 'bold',
          fill: '#1f1f1f',
          zIndex: 5,
        }),
        createTextElement('has successfully completed the online course', CENTER_X, 360, {
          fontFamily: 'Arial',
          fontSize: 16,
          fill: '#636363',
          zIndex: 6,
        }),
        createPlaceholderElement('Course_Name', CENTER_X, 420, {
          fontFamily: 'Georgia',
          fontSize: 28,
          fontWeight: 'bold',
          fill: '#0056d2',
          zIndex: 7,
        }),
        createTextElement('Offered by', CENTER_X, 490, {
          fontFamily: 'Arial',
          fontSize: 14,
          fill: '#636363',
          zIndex: 8,
        }),
        createPlaceholderElement('Organization_Name', CENTER_X, 530, {
          fontFamily: 'Arial',
          fontSize: 22,
          fontWeight: 'bold',
          fill: '#1f1f1f',
          zIndex: 9,
        }),
        // Signature section - centered
        createLineElement(CENTER_X - 280, 620, 180, { fill: '#e0e0e0', strokeWidth: 1, zIndex: 10 }),
        createLineElement(CENTER_X + 100, 620, 180, { fill: '#e0e0e0', strokeWidth: 1, zIndex: 11 }),
        createTextElement('Instructor', CENTER_X - 190, 645, {
          fontFamily: 'Arial',
          fontSize: 11,
          fill: '#9b9b9b',
          zIndex: 12,
        }),
        createTextElement('Director of Coursera', CENTER_X + 190, 645, {
          fontFamily: 'Arial',
          fontSize: 11,
          fill: '#9b9b9b',
          zIndex: 13,
        }),
        // Verify text - centered
        createTextElement('Verify at coursera.org/verify/', CENTER_X - 60, 730, {
          fontFamily: 'Arial',
          fontSize: 10,
          fill: '#9b9b9b',
          zIndex: 14,
        }),
        createPlaceholderElement('Certificate_ID', CENTER_X + 80, 730, {
          fontFamily: 'Arial',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#0056d2',
          zIndex: 15,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
  {
    id: 'ibm-style',
    name: 'Enterprise - IBM Style',
    description: 'Corporate enterprise certificate design',
    category: 'professional',
    preview: '💻',
    template: {
      name: 'Professional Certificate',
      width: 1123,
      height: 794,
      backgroundColor: '#f4f4f4',
      elements: [
        // Dark header with gradient effect
        createShapeElement(0, 0, 1123, 120, { fill: '#161616', stroke: 'transparent', zIndex: 0 }),
        createShapeElement(0, 120, 1123, 6, { fill: '#0f62fe', stroke: 'transparent', zIndex: 1 }),
        createTextElement('IBM', 80, 50, {
          fontFamily: 'Arial',
          fontSize: 36,
          fontWeight: 'bold',
          fill: '#ffffff',
          textAlign: 'left',
          zIndex: 2,
        }),
        createTextElement('Professional Certificate', 200, 55, {
          fontFamily: 'Arial',
          fontSize: 18,
          fontWeight: 'normal',
          fill: '#a8a8a8',
          textAlign: 'left',
          zIndex: 3,
        }),
        // Content - all centered
        createTextElement('This is to certify that', CENTER_X, 190, {
          fontFamily: 'Arial',
          fontSize: 16,
          fill: '#525252',
          zIndex: 4,
        }),
        createPlaceholderElement('Name', CENTER_X, 260, {
          fontFamily: 'Arial',
          fontSize: 42,
          fontWeight: 'bold',
          fill: '#161616',
          zIndex: 5,
        }),
        createTextElement('has successfully earned the', CENTER_X, 330, {
          fontFamily: 'Arial',
          fontSize: 16,
          fill: '#525252',
          zIndex: 6,
        }),
        createPlaceholderElement('Course_Name', CENTER_X, 390, {
          fontFamily: 'Arial',
          fontSize: 28,
          fontWeight: 'bold',
          fill: '#0f62fe',
          zIndex: 7,
        }),
        createTextElement('Professional Certificate', CENTER_X, 440, {
          fontFamily: 'Arial',
          fontSize: 18,
          fill: '#161616',
          zIndex: 8,
        }),
        createTextElement('This achievement certifies proficiency in enterprise-level skills', CENTER_X, 490, {
          fontFamily: 'Arial',
          fontSize: 14,
          fill: '#6f6f6f',
          zIndex: 9,
        }),
        createPlaceholderElement('Organization_Name', CENTER_X, 540, {
          fontFamily: 'Arial',
          fontSize: 20,
          fontWeight: 'bold',
          fill: '#161616',
          zIndex: 10,
        }),
        // Footer with gradient
        createShapeElement(0, 700, 1123, 94, { fill: '#262626', stroke: 'transparent', zIndex: 11 }),
        createShapeElement(0, 694, 1123, 6, { fill: '#0f62fe', stroke: 'transparent', zIndex: 12 }),
        createPlaceholderElement('Date', CENTER_X - 200, 740, {
          fontFamily: 'Arial',
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#a8a8a8',
          zIndex: 13,
        }),
        createPlaceholderElement('Certificate_ID', CENTER_X + 200, 740, {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'normal',
          fill: '#6f6f6f',
          zIndex: 14,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
  {
    id: 'linkedin-style',
    name: 'Platform - LinkedIn Learning',
    description: 'LinkedIn Learning certificate style',
    category: 'professional',
    preview: '💼',
    template: {
      name: 'Certificate of Completion',
      width: 1123,
      height: 794,
      backgroundColor: '#ffffff',
      elements: [
        // LinkedIn blue header with gradient
        createShapeElement(0, 0, 1123, 80, { fill: '#0a66c2', stroke: 'transparent', zIndex: 0 }),
        createShapeElement(0, 80, 1123, 3, { fill: '#004182', stroke: 'transparent', zIndex: 1 }),
        createTextElement('in', CENTER_X - 30, 30, {
          fontFamily: 'Arial',
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#ffffff',
          zIndex: 2,
        }),
        createTextElement('Learning', CENTER_X + 20, 30, {
          fontFamily: 'Arial',
          fontSize: 24,
          fontWeight: 'normal',
          fill: '#ffffff',
          zIndex: 3,
        }),
        // Main content - all centered
        createTextElement('Certificate of Completion', CENTER_X, 150, {
          fontFamily: 'Georgia',
          fontSize: 32,
          fill: '#000000',
          zIndex: 4,
        }),
        createTextElement('Congratulations!', CENTER_X, 200, {
          fontFamily: 'Georgia',
          fontSize: 18,
          fontStyle: 'italic',
          fill: '#666666',
          zIndex: 5,
        }),
        createPlaceholderElement('Name', CENTER_X, 280, {
          fontFamily: 'Georgia',
          fontSize: 42,
          fontWeight: 'bold',
          fill: '#000000',
          zIndex: 6,
        }),
        createTextElement('has completed', CENTER_X, 350, {
          fontFamily: 'Arial',
          fontSize: 16,
          fill: '#666666',
          zIndex: 7,
        }),
        createPlaceholderElement('Course_Name', CENTER_X, 410, {
          fontFamily: 'Arial',
          fontSize: 26,
          fontWeight: 'bold',
          fill: '#0a66c2',
          zIndex: 8,
        }),
        createPlaceholderElement('Date', CENTER_X, 480, {
          fontFamily: 'Arial',
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#666666',
          zIndex: 9,
        }),
        // Bottom section - centered
        createLineElement(CENTER_X - 200, 560, 400, { fill: '#e0e0e0', strokeWidth: 1, zIndex: 10 }),
        createTextElement('This certificate is issued by LinkedIn Corporation', CENTER_X, 610, {
          fontFamily: 'Arial',
          fontSize: 12,
          fill: '#999999',
          zIndex: 11,
        }),
        createPlaceholderElement('Certificate_ID', CENTER_X, 660, {
          fontFamily: 'Arial',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#cccccc',
          zIndex: 12,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
  {
    id: 'microsoft-style',
    name: 'Enterprise - Microsoft Style',
    description: 'Microsoft certification style design',
    category: 'professional',
    preview: '🪟',
    template: {
      name: 'Microsoft Certificate',
      width: 1123,
      height: 794,
      backgroundColor: '#ffffff',
      elements: [
        // Colored squares (Microsoft logo) - centered at top
        createShapeElement(CENTER_X - 35, 40, 30, 30, { fill: '#f25022', stroke: 'transparent', zIndex: 0 }),
        createShapeElement(CENTER_X + 5, 40, 30, 30, { fill: '#7fba00', stroke: 'transparent', zIndex: 1 }),
        createShapeElement(CENTER_X - 35, 75, 30, 30, { fill: '#00a4ef', stroke: 'transparent', zIndex: 2 }),
        createShapeElement(CENTER_X + 5, 75, 30, 30, { fill: '#ffb900', stroke: 'transparent', zIndex: 3 }),
        createTextElement('Microsoft', CENTER_X, 135, {
          fontFamily: 'Segoe UI',
          fontSize: 26,
          fontWeight: 'normal',
          fill: '#737373',
          zIndex: 4,
        }),
        // Main content - all centered
        createTextElement('Certified', CENTER_X, 190, {
          fontFamily: 'Segoe UI',
          fontSize: 18,
          fontWeight: 'normal',
          fill: '#737373',
          letterSpacing: 4,
          zIndex: 5,
        }),
        createPlaceholderElement('Course_Name', CENTER_X, 240, {
          fontFamily: 'Segoe UI',
          fontSize: 36,
          fontWeight: 'bold',
          fill: '#0078d4',
          zIndex: 6,
        }),
        createLineElement(CENTER_X - 200, 290, 400, { fill: '#0078d4', strokeWidth: 2, zIndex: 7 }),
        createTextElement('This certifies that', CENTER_X, 340, {
          fontFamily: 'Segoe UI',
          fontSize: 16,
          fill: '#737373',
          zIndex: 8,
        }),
        createPlaceholderElement('Name', CENTER_X, 410, {
          fontFamily: 'Segoe UI',
          fontSize: 40,
          fontWeight: 'bold',
          fill: '#1a1a1a',
          zIndex: 9,
        }),
        createTextElement('has successfully demonstrated skills and knowledge by completing', CENTER_X, 480, {
          fontFamily: 'Segoe UI',
          fontSize: 14,
          fill: '#737373',
          zIndex: 10,
        }),
        createTextElement('the requirements for Microsoft certification', CENTER_X, 505, {
          fontFamily: 'Segoe UI',
          fontSize: 14,
          fill: '#737373',
          zIndex: 11,
        }),
        // Footer section - centered
        createPlaceholderElement('Date', CENTER_X - 200, 600, {
          fontFamily: 'Segoe UI',
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#737373',
          zIndex: 12,
        }),
        createTextElement('Certification Date', CENTER_X - 200, 625, {
          fontFamily: 'Segoe UI',
          fontSize: 11,
          fill: '#a0a0a0',
          zIndex: 13,
        }),
        createPlaceholderElement('Certificate_ID', CENTER_X + 200, 600, {
          fontFamily: 'Segoe UI',
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#737373',
          zIndex: 14,
        }),
        createTextElement('Certification Number', CENTER_X + 200, 625, {
          fontFamily: 'Segoe UI',
          fontSize: 11,
          fill: '#a0a0a0',
          zIndex: 15,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
  {
    id: 'udemy-style',
    name: 'Platform - Udemy Style',
    description: 'Udemy online course certificate',
    category: 'professional',
    preview: '🎯',
    template: {
      name: 'Certificate of Completion',
      width: 1123,
      height: 794,
      backgroundColor: '#ffffff',
      elements: [
        // Purple header with gradient
        createShapeElement(0, 0, 1123, 90, { fill: '#5624d0', stroke: 'transparent', zIndex: 0 }),
        createShapeElement(0, 90, 1123, 4, { fill: '#3d1a9b', stroke: 'transparent', zIndex: 1 }),
        createTextElement('U', CENTER_X - 70, 35, {
          fontFamily: 'Arial',
          fontSize: 32,
          fontWeight: 'bold',
          fill: '#ffffff',
          zIndex: 2,
        }),
        createTextElement('Udemy Certificate', CENTER_X + 10, 38, {
          fontFamily: 'Arial',
          fontSize: 18,
          fill: '#ffffff',
          zIndex: 3,
        }),
        // Content - all centered
        createTextElement('Certificate of Completion', CENTER_X, 160, {
          fontFamily: 'Georgia',
          fontSize: 32,
          fill: '#1c1d1f',
          zIndex: 4,
        }),
        createPlaceholderElement('Name', CENTER_X, 250, {
          fontFamily: 'Georgia',
          fontSize: 44,
          fontWeight: 'bold',
          fill: '#1c1d1f',
          zIndex: 5,
        }),
        createLineElement(CENTER_X - 200, 310, 400, { fill: '#5624d0', strokeWidth: 3, zIndex: 6 }),
        createPlaceholderElement('Course_Name', CENTER_X, 370, {
          fontFamily: 'Arial',
          fontSize: 26,
          fontWeight: 'bold',
          fill: '#5624d0',
          zIndex: 7,
        }),
        createTextElement('Instructor:', CENTER_X - 80, 440, {
          fontFamily: 'Arial',
          fontSize: 14,
          fill: '#6a6f73',
          zIndex: 8,
        }),
        createPlaceholderElement('Organization_Name', CENTER_X + 40, 440, {
          fontFamily: 'Arial',
          fontSize: 14,
          fontWeight: 'bold',
          fill: '#1c1d1f',
          zIndex: 9,
        }),
        createPlaceholderElement('Date', CENTER_X, 510, {
          fontFamily: 'Arial',
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#6a6f73',
          zIndex: 10,
        }),
        // Footer with gradient
        createShapeElement(0, 700, 1123, 94, { fill: '#f7f9fa', stroke: 'transparent', zIndex: 11 }),
        createShapeElement(0, 694, 1123, 6, { fill: '#5624d0', stroke: 'transparent', zIndex: 12 }),
        createTextElement('Length:', CENTER_X - 150, 740, {
          fontFamily: 'Arial',
          fontSize: 12,
          fill: '#6a6f73',
          zIndex: 13,
        }),
        createTextElement('Complete Course', CENTER_X - 50, 740, {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'bold',
          fill: '#1c1d1f',
          zIndex: 14,
        }),
        createPlaceholderElement('Certificate_ID', CENTER_X + 150, 740, {
          fontFamily: 'Arial',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#6a6f73',
          zIndex: 15,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
  // ===== UNIVERSITY CLASSIC TEMPLATE =====
  {
    id: 'university-classic',
    name: 'University - Classic',
    description: 'Traditional formal university certificate',
    category: 'completion',
    preview: '🎓',
    template: {
      name: 'Academic Certificate',
      width: 1123,
      height: 794,
      backgroundColor: '#fffef5',
      elements: [
        // Elegant double border
        createShapeElement(30, 30, 1063, 734, {
          fill: 'transparent',
          stroke: '#1e3a5f',
          strokeWidth: 3,
          zIndex: 0,
        }),
        createShapeElement(45, 45, 1033, 704, {
          fill: 'transparent',
          stroke: '#c9a227',
          strokeWidth: 2,
          zIndex: 1,
        }),
        // University seal circle - centered
        createShapeElement(CENTER_X - 40, 60, 80, 80, { 
          shapeType: 'circle', 
          fill: '#1e3a5f', 
          stroke: '#c9a227',
          strokeWidth: 3,
          zIndex: 2 
        }),
        // Header - centered
        createPlaceholderElement('Organization_Name', CENTER_X, 180, {
          fontFamily: 'Playfair Display',
          fontSize: 28,
          fontWeight: 'bold',
          fill: '#1e3a5f',
          zIndex: 3,
        }),
        createTextElement('hereby certifies that', CENTER_X, 230, {
          fontFamily: 'Georgia',
          fontSize: 16,
          fontStyle: 'italic',
          fill: '#555555',
          zIndex: 4,
        }),
        // Main content - centered
        createPlaceholderElement('Name', CENTER_X, 310, {
          fontFamily: 'Great Vibes',
          fontSize: 56,
          fontWeight: 'normal',
          fill: '#1e3a5f',
          zIndex: 5,
        }),
        createTextElement('has successfully completed the requirements for', CENTER_X, 390, {
          fontFamily: 'Georgia',
          fontSize: 16,
          fill: '#555555',
          zIndex: 6,
        }),
        createPlaceholderElement('Course_Name', CENTER_X, 450, {
          fontFamily: 'Playfair Display',
          fontSize: 32,
          fontWeight: 'bold',
          fill: '#1e3a5f',
          zIndex: 7,
        }),
        createTextElement('conferred this', CENTER_X - 50, 520, {
          fontFamily: 'Georgia',
          fontSize: 14,
          fill: '#666666',
          zIndex: 8,
        }),
        createPlaceholderElement('Date', CENTER_X + 60, 520, {
          fontFamily: 'Georgia',
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#1e3a5f',
          zIndex: 9,
        }),
        // Signature section - properly centered
        createLineElement(CENTER_X - 350, 620, 180, { fill: '#1e3a5f', strokeWidth: 1, zIndex: 10 }),
        createLineElement(CENTER_X - 90, 620, 180, { fill: '#1e3a5f', strokeWidth: 1, zIndex: 11 }),
        createLineElement(CENTER_X + 170, 620, 180, { fill: '#1e3a5f', strokeWidth: 1, zIndex: 12 }),
        createTextElement('Dean', CENTER_X - 260, 640, {
          fontFamily: 'Georgia',
          fontSize: 11,
          fill: '#888888',
          zIndex: 13,
        }),
        createTextElement('Registrar', CENTER_X, 640, {
          fontFamily: 'Georgia',
          fontSize: 11,
          fill: '#888888',
          zIndex: 14,
        }),
        createTextElement('President', CENTER_X + 260, 640, {
          fontFamily: 'Georgia',
          fontSize: 11,
          fill: '#888888',
          zIndex: 15,
        }),
        // Certificate ID - centered
        createPlaceholderElement('Certificate_ID', CENTER_X, 720, {
          fontFamily: 'Georgia',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#aaaaaa',
          zIndex: 16,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
  // ===== COURSE COMPLETION TEMPLATE =====
  {
    id: 'course-completion-elegant',
    name: 'Course Completion - Elegant',
    description: 'Professional certificate for course completion with elegant gold accents',
    category: 'completion',
    preview: '🎓',
    template: {
      name: 'Course Completion Certificate',
      width: 1123,
      height: 794,
      backgroundColor: '#ffffff',
      elements: [
        // Elegant border with gradient effect
        createShapeElement(30, 30, 1063, 734, {
          fill: 'transparent',
          stroke: '#c9a227',
          strokeWidth: 3,
          zIndex: 0,
        }),
        createShapeElement(40, 40, 1043, 714, {
          fill: 'transparent',
          stroke: '#1e3a5f',
          strokeWidth: 1,
          zIndex: 1,
        }),
        // Header - centered
        createTextElement('CERTIFICATE', CENTER_X, 80, {
          fontFamily: 'Playfair Display',
          fontSize: 18,
          fontWeight: 'normal',
          fill: '#c9a227',
          letterSpacing: 8,
          zIndex: 2,
        }),
        createTextElement('OF COMPLETION', CENTER_X, 120, {
          fontFamily: 'Playfair Display',
          fontSize: 42,
          fontWeight: 'bold',
          fill: '#1e3a5f',
          zIndex: 3,
        }),
        createLineElement(CENTER_X - 200, 170, 400, {
          fill: '#c9a227',
          strokeWidth: 2,
          zIndex: 4,
        }),
        // Content - centered
        createTextElement('This is to certify that', CENTER_X, 210, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#666666',
          zIndex: 5,
        }),
        createPlaceholderElement('Name', CENTER_X, 280, {
          fontFamily: 'Great Vibes',
          fontSize: 52,
          fontWeight: 'normal',
          fill: '#1e3a5f',
          zIndex: 6,
        }),
        createTextElement('has successfully completed the course', CENTER_X, 350, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#666666',
          zIndex: 7,
        }),
        createPlaceholderElement('Course_Name', CENTER_X, 410, {
          fontFamily: 'Playfair Display',
          fontSize: 32,
          fontWeight: 'bold',
          fill: '#1e3a5f',
          zIndex: 8,
        }),
        createTextElement('Presented by', CENTER_X, 470, {
          fontFamily: 'Inter',
          fontSize: 14,
          fill: '#888888',
          zIndex: 9,
        }),
        createPlaceholderElement('Organization_Name', CENTER_X, 510, {
          fontFamily: 'Montserrat',
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#333333',
          zIndex: 10,
        }),
        // Signature section - centered
        createLineElement(CENTER_X - 300, 600, 200, {
          fill: '#1e3a5f',
          strokeWidth: 1,
          zIndex: 11,
        }),
        createPlaceholderElement('Date', CENTER_X - 200, 620, {
          fontFamily: 'Inter',
          fontSize: 16,
          fontWeight: 'normal',
          fill: '#666666',
          zIndex: 12,
        }),
        createTextElement('Date', CENTER_X - 200, 645, {
          fontFamily: 'Inter',
          fontSize: 12,
          fill: '#888888',
          zIndex: 13,
        }),
        createLineElement(CENTER_X + 100, 600, 200, {
          fill: '#1e3a5f',
          strokeWidth: 1,
          zIndex: 14,
        }),
        createTextElement('Authorized Signature', CENTER_X + 200, 645, {
          fontFamily: 'Inter',
          fontSize: 12,
          fill: '#888888',
          zIndex: 15,
        }),
        createPlaceholderElement('Certificate_ID', CENTER_X, 720, {
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#aaaaaa',
          zIndex: 16,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
  // ===== PARTICIPATION TEMPLATE =====
  {
    id: 'participation-modern',
    name: 'Participation - Modern',
    description: 'Clean modern design for participation certificates',
    category: 'participation',
    preview: '🏅',
    template: {
      name: 'Participation Certificate',
      width: 1123,
      height: 794,
      backgroundColor: '#f8fafc',
      elements: [
        // Left accent bar - gradient effect
        createShapeElement(0, 0, 60, 794, {
          fill: '#6366f1',
          stroke: 'transparent',
          strokeWidth: 0,
          zIndex: 0,
        }),
        createShapeElement(60, 0, 8, 794, {
          fill: '#4f46e5',
          stroke: 'transparent',
          strokeWidth: 0,
          zIndex: 1,
        }),
        // Header badge - centered
        createShapeElement(CENTER_X - 80, 50, 160, 50, {
          shapeType: 'rectangle',
          fill: '#6366f1',
          stroke: 'transparent',
          strokeWidth: 0,
          zIndex: 2,
        }),
        createTextElement('CERTIFICATE', CENTER_X, 68, {
          fontFamily: 'Montserrat',
          fontSize: 16,
          fontWeight: 'bold',
          fill: '#ffffff',
          letterSpacing: 4,
          zIndex: 3,
        }),
        // Content - all centered
        createTextElement('OF PARTICIPATION', CENTER_X, 140, {
          fontFamily: 'Montserrat',
          fontSize: 36,
          fontWeight: 'bold',
          fill: '#1e293b',
          zIndex: 4,
        }),
        createTextElement('This certificate is proudly presented to', CENTER_X, 210, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#64748b',
          zIndex: 5,
        }),
        createPlaceholderElement('Name', CENTER_X, 280, {
          fontFamily: 'Playfair Display',
          fontSize: 48,
          fontWeight: 'bold',
          fill: '#6366f1',
          zIndex: 6,
        }),
        createTextElement('for participating in', CENTER_X, 350, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#64748b',
          zIndex: 7,
        }),
        createPlaceholderElement('Course_Name', CENTER_X, 410, {
          fontFamily: 'Montserrat',
          fontSize: 28,
          fontWeight: 'bold',
          fill: '#1e293b',
          zIndex: 8,
        }),
        createTextElement('organized by', CENTER_X, 470, {
          fontFamily: 'Inter',
          fontSize: 14,
          fill: '#94a3b8',
          zIndex: 9,
        }),
        createPlaceholderElement('Organization_Name', CENTER_X, 510, {
          fontFamily: 'Montserrat',
          fontSize: 20,
          fontWeight: 'bold',
          fill: '#475569',
          zIndex: 10,
        }),
        // Signature section - centered
        createLineElement(CENTER_X - 300, 600, 200, {
          fill: '#6366f1',
          strokeWidth: 2,
          zIndex: 11,
        }),
        createLineElement(CENTER_X + 100, 600, 200, {
          fill: '#6366f1',
          strokeWidth: 2,
          zIndex: 12,
        }),
        createPlaceholderElement('Date', CENTER_X - 200, 620, {
          fontFamily: 'Inter',
          fontSize: 16,
          fontWeight: 'normal',
          fill: '#475569',
          zIndex: 13,
        }),
        createTextElement('Date', CENTER_X - 200, 645, {
          fontFamily: 'Inter',
          fontSize: 11,
          fill: '#94a3b8',
          zIndex: 14,
        }),
        createTextElement('Signature', CENTER_X + 200, 645, {
          fontFamily: 'Inter',
          fontSize: 11,
          fill: '#94a3b8',
          zIndex: 15,
        }),
        createPlaceholderElement('Certificate_ID', CENTER_X, 720, {
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#cbd5e1',
          zIndex: 16,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
  // ===== ACHIEVEMENT TEMPLATE =====
  {
    id: 'achievement-royal',
    name: 'Achievement - Royal',
    description: 'Prestigious design for achievement certificates',
    category: 'achievement',
    preview: '🏆',
    template: {
      name: 'Achievement Certificate',
      width: 1123,
      height: 794,
      backgroundColor: '#1e293b',
      elements: [
        // White inner panel with gold border
        createShapeElement(50, 50, 1023, 694, {
          fill: '#ffffff',
          stroke: '#c9a227',
          strokeWidth: 4,
          zIndex: 0,
        }),
        // Gold corner accents - symmetrical
        createShapeElement(50, 50, 80, 80, {
          fill: '#c9a227',
          stroke: 'transparent',
          strokeWidth: 0,
          zIndex: 1,
        }),
        createShapeElement(993, 50, 80, 80, {
          fill: '#c9a227',
          stroke: 'transparent',
          strokeWidth: 0,
          zIndex: 2,
        }),
        createShapeElement(50, 664, 80, 80, {
          fill: '#c9a227',
          stroke: 'transparent',
          strokeWidth: 0,
          zIndex: 3,
        }),
        createShapeElement(993, 664, 80, 80, {
          fill: '#c9a227',
          stroke: 'transparent',
          strokeWidth: 0,
          zIndex: 4,
        }),
        // Header - centered
        createTextElement('CERTIFICATE OF', CENTER_X, 130, {
          fontFamily: 'Montserrat',
          fontSize: 14,
          fontWeight: 'bold',
          fill: '#c9a227',
          letterSpacing: 6,
          zIndex: 5,
        }),
        createTextElement('ACHIEVEMENT', CENTER_X, 175, {
          fontFamily: 'Playfair Display',
          fontSize: 48,
          fontWeight: 'bold',
          fill: '#1e293b',
          zIndex: 6,
        }),
        createLineElement(CENTER_X - 150, 220, 300, {
          fill: '#c9a227',
          strokeWidth: 3,
          zIndex: 7,
        }),
        // Content - centered
        createTextElement('This certificate is proudly presented to', CENTER_X, 270, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#64748b',
          zIndex: 8,
        }),
        createPlaceholderElement('Name', CENTER_X, 340, {
          fontFamily: 'Great Vibes',
          fontSize: 56,
          fontWeight: 'normal',
          fill: '#1e293b',
          zIndex: 9,
        }),
        createTextElement('for outstanding achievement in', CENTER_X, 410, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#64748b',
          zIndex: 10,
        }),
        createPlaceholderElement('Course_Name', CENTER_X, 465, {
          fontFamily: 'Playfair Display',
          fontSize: 28,
          fontWeight: 'bold',
          fill: '#1e293b',
          zIndex: 11,
        }),
        createPlaceholderElement('Organization_Name', CENTER_X, 520, {
          fontFamily: 'Montserrat',
          fontSize: 18,
          fontWeight: 'normal',
          fill: '#475569',
          zIndex: 12,
        }),
        // Signature section - centered
        createLineElement(CENTER_X - 300, 610, 200, {
          fill: '#1e293b',
          strokeWidth: 1,
          zIndex: 13,
        }),
        createPlaceholderElement('Date', CENTER_X - 200, 630, {
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#475569',
          zIndex: 14,
        }),
        createTextElement('Date', CENTER_X - 200, 655, {
          fontFamily: 'Inter',
          fontSize: 11,
          fill: '#94a3b8',
          zIndex: 15,
        }),
        createLineElement(CENTER_X + 100, 610, 200, {
          fill: '#1e293b',
          strokeWidth: 1,
          zIndex: 16,
        }),
        createTextElement('Authorized Signature', CENTER_X + 200, 655, {
          fontFamily: 'Inter',
          fontSize: 11,
          fill: '#94a3b8',
          zIndex: 17,
        }),
        createPlaceholderElement('Certificate_ID', CENTER_X, 710, {
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#94a3b8',
          zIndex: 18,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
  // ===== INTERNSHIP TEMPLATE =====
  {
    id: 'internship-professional',
    name: 'Internship - Professional',
    description: 'Clean professional design for internship certificates',
    category: 'internship',
    preview: '💼',
    template: {
      name: 'Internship Certificate',
      width: 1123,
      height: 794,
      backgroundColor: '#ffffff',
      elements: [
        // Top gradient bar
        createShapeElement(0, 0, 1123, 12, { fill: '#0f766e', stroke: 'transparent', zIndex: 0 }),
        createShapeElement(0, 12, 1123, 4, { fill: '#0d9488', stroke: 'transparent', zIndex: 1 }),
        // Bottom gradient bar
        createShapeElement(0, 778, 1123, 4, { fill: '#0d9488', stroke: 'transparent', zIndex: 2 }),
        createShapeElement(0, 782, 1123, 12, { fill: '#0f766e', stroke: 'transparent', zIndex: 3 }),
        // Subtle corner accents
        createShapeElement(40, 40, 100, 6, { fill: '#0f766e', stroke: 'transparent', zIndex: 4 }),
        createShapeElement(40, 40, 6, 100, { fill: '#0f766e', stroke: 'transparent', zIndex: 5 }),
        createShapeElement(983, 40, 100, 6, { fill: '#0f766e', stroke: 'transparent', zIndex: 6 }),
        createShapeElement(1077, 40, 6, 100, { fill: '#0f766e', stroke: 'transparent', zIndex: 7 }),
        // Header - centered
        createTextElement('CERTIFICATE OF', CENTER_X, 100, {
          fontFamily: 'Montserrat',
          fontSize: 14,
          fontWeight: 'bold',
          fill: '#0f766e',
          letterSpacing: 6,
          zIndex: 8,
        }),
        createTextElement('INTERNSHIP', CENTER_X, 150, {
          fontFamily: 'Playfair Display',
          fontSize: 48,
          fontWeight: 'bold',
          fill: '#0f4c4c',
          zIndex: 9,
        }),
        createLineElement(CENTER_X - 200, 200, 400, {
          fill: '#0f766e',
          strokeWidth: 2,
          zIndex: 10,
        }),
        // Content - centered
        createTextElement('This is to certify that', CENTER_X, 250, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#525252',
          zIndex: 11,
        }),
        createPlaceholderElement('Name', CENTER_X, 320, {
          fontFamily: 'Playfair Display',
          fontSize: 48,
          fontWeight: 'bold',
          fill: '#0f4c4c',
          zIndex: 12,
        }),
        createTextElement('has successfully completed an internship program in', CENTER_X, 390, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#525252',
          zIndex: 13,
        }),
        createPlaceholderElement('Course_Name', CENTER_X, 445, {
          fontFamily: 'Montserrat',
          fontSize: 26,
          fontWeight: 'bold',
          fill: '#0f766e',
          zIndex: 14,
        }),
        createTextElement('at', CENTER_X, 500, {
          fontFamily: 'Inter',
          fontSize: 14,
          fill: '#737373',
          zIndex: 15,
        }),
        createPlaceholderElement('Organization_Name', CENTER_X, 540, {
          fontFamily: 'Montserrat',
          fontSize: 22,
          fontWeight: 'bold',
          fill: '#171717',
          zIndex: 16,
        }),
        // Signature section - centered
        createLineElement(CENTER_X - 300, 620, 200, {
          fill: '#0f766e',
          strokeWidth: 1,
          zIndex: 17,
        }),
        createPlaceholderElement('Date', CENTER_X - 200, 640, {
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#525252',
          zIndex: 18,
        }),
        createTextElement('Date', CENTER_X - 200, 665, {
          fontFamily: 'Inter',
          fontSize: 11,
          fill: '#a3a3a3',
          zIndex: 19,
        }),
        createLineElement(CENTER_X + 100, 620, 200, {
          fill: '#0f766e',
          strokeWidth: 1,
          zIndex: 20,
        }),
        createTextElement('Supervisor', CENTER_X + 200, 665, {
          fontFamily: 'Inter',
          fontSize: 11,
          fill: '#a3a3a3',
          zIndex: 21,
        }),
        createPlaceholderElement('Certificate_ID', CENTER_X, 720, {
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#d4d4d4',
          zIndex: 22,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
  // ===== APPRECIATION TEMPLATE =====
  {
    id: 'appreciation-warm',
    name: 'Appreciation - Warm',
    description: 'Warm and welcoming design for appreciation certificates',
    category: 'appreciation',
    preview: '❤️',
    template: {
      name: 'Certificate of Appreciation',
      width: 1123,
      height: 794,
      backgroundColor: '#fef7ed',
      elements: [
        // Warm gradient border effect
        createShapeElement(0, 0, 1123, 20, { fill: '#ea580c', stroke: 'transparent', zIndex: 0 }),
        createShapeElement(0, 20, 1123, 6, { fill: '#f97316', stroke: 'transparent', zIndex: 1 }),
        createShapeElement(0, 768, 1123, 6, { fill: '#f97316', stroke: 'transparent', zIndex: 2 }),
        createShapeElement(0, 774, 1123, 20, { fill: '#ea580c', stroke: 'transparent', zIndex: 3 }),
        // Decorative circles - symmetrical
        createShapeElement(60, 60, 60, 60, { 
          shapeType: 'circle', 
          fill: '#fed7aa', 
          stroke: '#f97316',
          strokeWidth: 2,
          zIndex: 4 
        }),
        createShapeElement(1003, 60, 60, 60, { 
          shapeType: 'circle', 
          fill: '#fed7aa', 
          stroke: '#f97316',
          strokeWidth: 2,
          zIndex: 5 
        }),
        // Header - centered
        createTextElement('CERTIFICATE OF', CENTER_X, 120, {
          fontFamily: 'Montserrat',
          fontSize: 14,
          fontWeight: 'bold',
          fill: '#ea580c',
          letterSpacing: 6,
          zIndex: 6,
        }),
        createTextElement('APPRECIATION', CENTER_X, 170, {
          fontFamily: 'Playfair Display',
          fontSize: 48,
          fontWeight: 'bold',
          fill: '#9a3412',
          zIndex: 7,
        }),
        createLineElement(CENTER_X - 200, 220, 400, {
          fill: '#ea580c',
          strokeWidth: 2,
          zIndex: 8,
        }),
        // Content - centered
        createTextElement('This certificate is warmly presented to', CENTER_X, 270, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#78350f',
          zIndex: 9,
        }),
        createPlaceholderElement('Name', CENTER_X, 340, {
          fontFamily: 'Great Vibes',
          fontSize: 52,
          fontWeight: 'normal',
          fill: '#9a3412',
          zIndex: 10,
        }),
        createTextElement('in recognition of outstanding contribution to', CENTER_X, 410, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#78350f',
          zIndex: 11,
        }),
        createPlaceholderElement('Course_Name', CENTER_X, 465, {
          fontFamily: 'Playfair Display',
          fontSize: 28,
          fontWeight: 'bold',
          fill: '#9a3412',
          zIndex: 12,
        }),
        createTextElement('Your dedication and hard work are truly appreciated.', CENTER_X, 520, {
          fontFamily: 'Inter',
          fontSize: 14,
          fontStyle: 'italic',
          fill: '#92400e',
          zIndex: 13,
        }),
        createPlaceholderElement('Organization_Name', CENTER_X, 560, {
          fontFamily: 'Montserrat',
          fontSize: 20,
          fontWeight: 'bold',
          fill: '#78350f',
          zIndex: 14,
        }),
        // Signature section - centered
        createLineElement(CENTER_X - 300, 630, 200, {
          fill: '#ea580c',
          strokeWidth: 1,
          zIndex: 15,
        }),
        createPlaceholderElement('Date', CENTER_X - 200, 650, {
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#92400e',
          zIndex: 16,
        }),
        createTextElement('Date', CENTER_X - 200, 675, {
          fontFamily: 'Inter',
          fontSize: 11,
          fill: '#c2410c',
          zIndex: 17,
        }),
        createLineElement(CENTER_X + 100, 630, 200, {
          fill: '#ea580c',
          strokeWidth: 1,
          zIndex: 18,
        }),
        createTextElement('Director', CENTER_X + 200, 675, {
          fontFamily: 'Inter',
          fontSize: 11,
          fill: '#c2410c',
          zIndex: 19,
        }),
        createPlaceholderElement('Certificate_ID', CENTER_X, 720, {
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#fdba74',
          zIndex: 20,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
];

export function getTemplatesByCategory(category: PresetTemplate['category']): PresetTemplate[] {
  return PRESET_TEMPLATES.filter(t => t.category === category);
}

export function getTemplateById(id: string): PresetTemplate | undefined {
  return PRESET_TEMPLATES.find(t => t.id === id);
}
