import { CertificateTemplate, CertificateElement } from '@/types/certificate';
import { v4 as uuidv4 } from 'uuid';

export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  category: 'completion' | 'participation' | 'achievement' | 'internship' | 'appreciation';
  preview: string;
  template: Omit<CertificateTemplate, 'id' | 'createdAt' | 'updatedAt'>;
}

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
        // Border frame
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
        // Header
        createTextElement('CERTIFICATE', 561, 80, {
          fontFamily: 'Playfair Display',
          fontSize: 18,
          fontWeight: 'normal',
          fill: '#c9a227',
          letterSpacing: 8,
          zIndex: 2,
        }),
        createTextElement('OF COMPLETION', 561, 105, {
          fontFamily: 'Playfair Display',
          fontSize: 42,
          fontWeight: 'bold',
          fill: '#1e3a5f',
          zIndex: 3,
        }),
        // Decorative line
        createLineElement(361, 160, 400, {
          fill: '#c9a227',
          strokeWidth: 2,
          zIndex: 4,
        }),
        // This is to certify
        createTextElement('This is to certify that', 561, 200, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#666666',
          zIndex: 5,
        }),
        // Name placeholder
        createPlaceholderElement('Name', 561, 250, {
          fontFamily: 'Great Vibes',
          fontSize: 52,
          fontWeight: 'normal',
          fill: '#1e3a5f',
          zIndex: 6,
        }),
        // Has successfully completed
        createTextElement('has successfully completed the course', 561, 330, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#666666',
          zIndex: 7,
        }),
        // Course name placeholder
        createPlaceholderElement('Course_Name', 561, 380, {
          fontFamily: 'Playfair Display',
          fontSize: 32,
          fontWeight: 'bold',
          fill: '#1e3a5f',
          zIndex: 8,
        }),
        // Organization
        createTextElement('Presented by', 561, 450, {
          fontFamily: 'Inter',
          fontSize: 14,
          fill: '#888888',
          zIndex: 9,
        }),
        createPlaceholderElement('Organization_Name', 561, 485, {
          fontFamily: 'Montserrat',
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#333333',
          zIndex: 10,
        }),
        // Date line
        createLineElement(200, 620, 200, {
          fill: '#1e3a5f',
          strokeWidth: 1,
          zIndex: 11,
        }),
        createPlaceholderElement('Date', 300, 640, {
          fontFamily: 'Inter',
          fontSize: 16,
          fontWeight: 'normal',
          fill: '#666666',
          zIndex: 12,
        }),
        createTextElement('Date', 300, 670, {
          fontFamily: 'Inter',
          fontSize: 12,
          fill: '#888888',
          zIndex: 13,
        }),
        // Signature line
        createLineElement(723, 620, 200, {
          fill: '#1e3a5f',
          strokeWidth: 1,
          zIndex: 14,
        }),
        createTextElement('Authorized Signature', 823, 670, {
          fontFamily: 'Inter',
          fontSize: 12,
          fill: '#888888',
          zIndex: 15,
        }),
        // Certificate ID
        createPlaceholderElement('Certificate_ID', 561, 730, {
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#aaaaaa',
          zIndex: 16,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
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
        // Left accent bar
        createShapeElement(0, 0, 60, 794, {
          fill: '#6366f1',
          stroke: 'transparent',
          strokeWidth: 0,
          zIndex: 0,
        }),
        // Header badge
        createShapeElement(481, 50, 160, 50, {
          shapeType: 'rectangle',
          fill: '#6366f1',
          stroke: 'transparent',
          strokeWidth: 0,
          zIndex: 1,
        }),
        createTextElement('CERTIFICATE', 561, 65, {
          fontFamily: 'Montserrat',
          fontSize: 16,
          fontWeight: 'bold',
          fill: '#ffffff',
          letterSpacing: 4,
          zIndex: 2,
        }),
        // Main title
        createTextElement('OF PARTICIPATION', 561, 140, {
          fontFamily: 'Montserrat',
          fontSize: 36,
          fontWeight: 'bold',
          fill: '#1e293b',
          zIndex: 3,
        }),
        // This is to certify
        createTextElement('This certificate is proudly presented to', 561, 220, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#64748b',
          zIndex: 4,
        }),
        // Name
        createPlaceholderElement('Name', 561, 280, {
          fontFamily: 'Playfair Display',
          fontSize: 48,
          fontWeight: 'bold',
          fill: '#6366f1',
          zIndex: 5,
        }),
        // For participating in
        createTextElement('for participating in', 561, 360, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#64748b',
          zIndex: 6,
        }),
        // Event name
        createPlaceholderElement('Course_Name', 561, 410, {
          fontFamily: 'Montserrat',
          fontSize: 28,
          fontWeight: 'bold',
          fill: '#1e293b',
          zIndex: 7,
        }),
        // Organization
        createTextElement('organized by', 561, 480, {
          fontFamily: 'Inter',
          fontSize: 14,
          fill: '#94a3b8',
          zIndex: 8,
        }),
        createPlaceholderElement('Organization_Name', 561, 520, {
          fontFamily: 'Montserrat',
          fontSize: 20,
          fontWeight: 'bold',
          fill: '#475569',
          zIndex: 9,
        }),
        // Bottom section
        createLineElement(200, 620, 250, {
          fill: '#6366f1',
          strokeWidth: 2,
          zIndex: 10,
        }),
        createLineElement(673, 620, 250, {
          fill: '#6366f1',
          strokeWidth: 2,
          zIndex: 11,
        }),
        createPlaceholderElement('Date', 325, 650, {
          fontFamily: 'Inter',
          fontSize: 16,
          fontWeight: 'normal',
          fill: '#475569',
          zIndex: 12,
        }),
        createTextElement('Date', 325, 680, {
          fontFamily: 'Inter',
          fontSize: 11,
          fill: '#94a3b8',
          zIndex: 13,
        }),
        createTextElement('Signature', 798, 680, {
          fontFamily: 'Inter',
          fontSize: 11,
          fill: '#94a3b8',
          zIndex: 14,
        }),
        // Certificate ID
        createPlaceholderElement('Certificate_ID', 561, 750, {
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#cbd5e1',
          zIndex: 15,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
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
        // Inner frame
        createShapeElement(50, 50, 1023, 694, {
          fill: '#ffffff',
          stroke: '#c9a227',
          strokeWidth: 4,
          zIndex: 0,
        }),
        // Corner decorations (simplified as shapes)
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
        // Certificate of
        createTextElement('CERTIFICATE OF', 561, 120, {
          fontFamily: 'Montserrat',
          fontSize: 14,
          fontWeight: 'bold',
          fill: '#c9a227',
          letterSpacing: 6,
          zIndex: 5,
        }),
        // Achievement
        createTextElement('ACHIEVEMENT', 561, 160, {
          fontFamily: 'Playfair Display',
          fontSize: 48,
          fontWeight: 'bold',
          fill: '#1e293b',
          zIndex: 6,
        }),
        // Decorative line
        createLineElement(411, 210, 300, {
          fill: '#c9a227',
          strokeWidth: 3,
          zIndex: 7,
        }),
        // This is presented to
        createTextElement('This certificate is proudly presented to', 561, 260, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#64748b',
          zIndex: 8,
        }),
        // Name
        createPlaceholderElement('Name', 561, 320, {
          fontFamily: 'Great Vibes',
          fontSize: 56,
          fontWeight: 'normal',
          fill: '#1e293b',
          zIndex: 9,
        }),
        // For outstanding achievement
        createTextElement('for outstanding achievement in', 561, 400, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#64748b',
          zIndex: 10,
        }),
        // Achievement description
        createPlaceholderElement('Course_Name', 561, 450, {
          fontFamily: 'Playfair Display',
          fontSize: 28,
          fontWeight: 'bold',
          fill: '#1e293b',
          zIndex: 11,
        }),
        // Organization
        createPlaceholderElement('Organization_Name', 561, 520, {
          fontFamily: 'Montserrat',
          fontSize: 18,
          fontWeight: 'normal',
          fill: '#475569',
          zIndex: 12,
        }),
        // Date and signature
        createLineElement(180, 620, 200, {
          fill: '#1e293b',
          strokeWidth: 1,
          zIndex: 13,
        }),
        createPlaceholderElement('Date', 280, 640, {
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#475569',
          zIndex: 14,
        }),
        createTextElement('Date', 280, 665, {
          fontFamily: 'Inter',
          fontSize: 10,
          fill: '#94a3b8',
          zIndex: 15,
        }),
        createLineElement(743, 620, 200, {
          fill: '#1e293b',
          strokeWidth: 1,
          zIndex: 16,
        }),
        createTextElement('Authorized Signature', 843, 665, {
          fontFamily: 'Inter',
          fontSize: 10,
          fill: '#94a3b8',
          zIndex: 17,
        }),
        // Certificate ID
        createPlaceholderElement('Certificate_ID', 561, 710, {
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#cbd5e1',
          zIndex: 18,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
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
        // Top bar
        createShapeElement(0, 0, 1123, 15, {
          fill: '#0ea5e9',
          stroke: 'transparent',
          strokeWidth: 0,
          zIndex: 0,
        }),
        // Bottom bar
        createShapeElement(0, 779, 1123, 15, {
          fill: '#0ea5e9',
          stroke: 'transparent',
          strokeWidth: 0,
          zIndex: 1,
        }),
        // Certificate badge
        createTextElement('INTERNSHIP', 561, 60, {
          fontFamily: 'Montserrat',
          fontSize: 14,
          fontWeight: 'bold',
          fill: '#0ea5e9',
          letterSpacing: 6,
          zIndex: 2,
        }),
        // Certificate
        createTextElement('CERTIFICATE', 561, 100, {
          fontFamily: 'Playfair Display',
          fontSize: 44,
          fontWeight: 'bold',
          fill: '#0f172a',
          zIndex: 3,
        }),
        // Decorative element
        createLineElement(461, 155, 200, {
          fill: '#0ea5e9',
          strokeWidth: 3,
          zIndex: 4,
        }),
        // This is to certify
        createTextElement('This is to certify that', 561, 200, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#64748b',
          zIndex: 5,
        }),
        // Name
        createPlaceholderElement('Name', 561, 260, {
          fontFamily: 'Playfair Display',
          fontSize: 48,
          fontWeight: 'bold',
          fill: '#0f172a',
          zIndex: 6,
        }),
        // Has successfully completed
        createTextElement('has successfully completed an internship at', 561, 340, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#64748b',
          zIndex: 7,
        }),
        // Organization
        createPlaceholderElement('Organization_Name', 561, 390, {
          fontFamily: 'Montserrat',
          fontSize: 28,
          fontWeight: 'bold',
          fill: '#0ea5e9',
          zIndex: 8,
        }),
        // Department/Role
        createTextElement('as', 561, 450, {
          fontFamily: 'Inter',
          fontSize: 14,
          fill: '#94a3b8',
          zIndex: 9,
        }),
        createPlaceholderElement('Course_Name', 561, 490, {
          fontFamily: 'Montserrat',
          fontSize: 22,
          fontWeight: 'bold',
          fill: '#334155',
          zIndex: 10,
        }),
        // Duration text
        createTextElement('Duration of Internship', 561, 550, {
          fontFamily: 'Inter',
          fontSize: 12,
          fill: '#94a3b8',
          zIndex: 11,
        }),
        createPlaceholderElement('Date', 561, 580, {
          fontFamily: 'Inter',
          fontSize: 16,
          fontWeight: 'bold',
          fill: '#475569',
          zIndex: 12,
        }),
        // Signatures
        createLineElement(180, 660, 220, {
          fill: '#0f172a',
          strokeWidth: 1,
          zIndex: 13,
        }),
        createTextElement('HR Manager', 290, 690, {
          fontFamily: 'Inter',
          fontSize: 11,
          fill: '#64748b',
          zIndex: 14,
        }),
        createLineElement(723, 660, 220, {
          fill: '#0f172a',
          strokeWidth: 1,
          zIndex: 15,
        }),
        createTextElement('Department Head', 833, 690, {
          fontFamily: 'Inter',
          fontSize: 11,
          fill: '#64748b',
          zIndex: 16,
        }),
        // Certificate ID
        createPlaceholderElement('Certificate_ID', 561, 750, {
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#cbd5e1',
          zIndex: 17,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
  {
    id: 'appreciation-warm',
    name: 'Appreciation - Warm',
    description: 'Heartfelt design for appreciation certificates',
    category: 'appreciation',
    preview: '❤️',
    template: {
      name: 'Appreciation Certificate',
      width: 1123,
      height: 794,
      backgroundColor: '#fef7f0',
      elements: [
        // Border
        createShapeElement(25, 25, 1073, 744, {
          fill: 'transparent',
          stroke: '#d97706',
          strokeWidth: 2,
          zIndex: 0,
        }),
        createShapeElement(35, 35, 1053, 724, {
          fill: 'transparent',
          stroke: '#fbbf24',
          strokeWidth: 1,
          zIndex: 1,
        }),
        // Certificate of
        createTextElement('CERTIFICATE OF', 561, 90, {
          fontFamily: 'Montserrat',
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#d97706',
          letterSpacing: 8,
          zIndex: 2,
        }),
        // Appreciation
        createTextElement('APPRECIATION', 561, 140, {
          fontFamily: 'Playfair Display',
          fontSize: 48,
          fontWeight: 'bold',
          fill: '#92400e',
          zIndex: 3,
        }),
        // Decorative lines
        createLineElement(361, 195, 400, {
          fill: '#d97706',
          strokeWidth: 2,
          zIndex: 4,
        }),
        // This is presented
        createTextElement('This certificate is warmly presented to', 561, 245, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#78716c',
          zIndex: 5,
        }),
        // Name
        createPlaceholderElement('Name', 561, 310, {
          fontFamily: 'Dancing Script',
          fontSize: 52,
          fontWeight: 'bold',
          fill: '#92400e',
          zIndex: 6,
        }),
        // In recognition
        createTextElement('in recognition of valuable contributions to', 561, 390, {
          fontFamily: 'Inter',
          fontSize: 16,
          fill: '#78716c',
          zIndex: 7,
        }),
        // Course/Event
        createPlaceholderElement('Course_Name', 561, 440, {
          fontFamily: 'Playfair Display',
          fontSize: 28,
          fontWeight: 'bold',
          fill: '#292524',
          zIndex: 8,
        }),
        // Thank you message
        createTextElement('Your dedication and hard work are truly appreciated.', 561, 510, {
          fontFamily: 'Inter',
          fontSize: 14,
          fontStyle: 'italic',
          fill: '#78716c',
          zIndex: 9,
        }),
        // Organization
        createPlaceholderElement('Organization_Name', 561, 560, {
          fontFamily: 'Montserrat',
          fontSize: 20,
          fontWeight: 'bold',
          fill: '#44403c',
          zIndex: 10,
        }),
        // Date and signature
        createLineElement(180, 650, 200, {
          fill: '#92400e',
          strokeWidth: 1,
          zIndex: 11,
        }),
        createPlaceholderElement('Date', 280, 670, {
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#57534e',
          zIndex: 12,
        }),
        createTextElement('Date', 280, 695, {
          fontFamily: 'Inter',
          fontSize: 10,
          fill: '#a8a29e',
          zIndex: 13,
        }),
        createLineElement(743, 650, 200, {
          fill: '#92400e',
          strokeWidth: 1,
          zIndex: 14,
        }),
        createTextElement('Signature', 843, 695, {
          fontFamily: 'Inter',
          fontSize: 10,
          fill: '#a8a29e',
          zIndex: 15,
        }),
        // Certificate ID
        createPlaceholderElement('Certificate_ID', 561, 735, {
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: 'normal',
          fill: '#d6d3d1',
          zIndex: 16,
        }),
      ].map((el, index) => ({ ...el, id: uuidv4(), zIndex: index })) as CertificateElement[],
    },
  },
];

export const getTemplatesByCategory = (category: PresetTemplate['category']) => {
  return PRESET_TEMPLATES.filter(t => t.category === category);
};

export const getTemplateById = (id: string) => {
  return PRESET_TEMPLATES.find(t => t.id === id);
};
