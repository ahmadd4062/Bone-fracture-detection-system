/**
 * Configuration for DIP Bone Fracture Detection Application
 * Premium dark medical imaging theme with editorial typography
 */

export interface SiteConfig {
  language: string
  title: string
  description: string
  brandName: string
}

export interface HeroConfig {
  titleText: string
  subtitleLines: string[]
  ctaLabel: string
  roomLabel: string
  fluidImagePath: string
}

export interface FooterConfig {
  brandText: string
  taglineLines: string[]
  navigationHeading: string
  navigationLinks: { label: string; href?: string }[]
  contactHeading: string
  contactLinks: { label: string; href?: string }[]
  copyright: string
  creditText: string
}

export const siteConfig: SiteConfig = {
  language: 'en',
  title: 'DIP Bone Fracture Detection',
  description:
    'A comprehensive Digital Image Processing application for bone fracture detection from X-ray images. Features point processing, neighborhood filters, edge detection, morphological operations, and an integrated fracture analysis pipeline.',
  brandName: 'DIP FRACTURE LAB',
}

export const heroConfig: HeroConfig = {
  titleText: 'FRACTURE\nDETECTION',
  subtitleLines: [
    'Upload a grayscale X-ray image to explore a comprehensive suite',
    'of digital image processing techniques for automated fracture',
    'detection, edge analysis, and structural segmentation.',
  ],
  ctaLabel: 'Upload X-Ray Image',
  roomLabel: 'DIP LAB // MEDICAL IMAGING SUITE',
  fluidImagePath: '',
}

export const footerConfig: FooterConfig = {
  brandText: 'DIP FRACTURE LAB',
  taglineLines: [
    'DIGITAL IMAGE PROCESSING',
    'FOR MEDICAL IMAGING ANALYSIS',
    'BONE FRACTURE DETECTION SYSTEM',
  ],
  navigationHeading: 'SECTIONS',
  navigationLinks: [
    { label: 'Point Processing' },
    { label: 'Neighborhood Filters' },
    { label: 'Edge Detection' },
    { label: 'Morphology & Segmentation' },
    { label: 'Fracture Pipeline' },
  ],
  contactHeading: 'TECHNOLOGIES',
  contactLinks: [
    { label: 'Canvas 2D API' },
    { label: 'React 19 + TypeScript' },
    { label: 'Tailwind CSS' },
  ],
  copyright: '\u00A9 2026 DIP FRACTURE LAB',
  creditText: 'DEVELOPED BY TEAM AMIGOS',
}
