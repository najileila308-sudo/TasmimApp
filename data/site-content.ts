import { AppColors } from '@/constants/theme';

export type AccentTone = 'accent' | 'blue' | 'amber';

export type ServiceItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  icon: string;
  accent: AccentTone;
  image: 'prjdev' | 'appmobile' | 'designuiux';
};

export type ProjectItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  accent: AccentTone;
  image: 'devweb' | 'commerce' | 'appService';
};

export const heroStats = [
  { label: 'Projets livres', value: '50+' },
  { label: 'Satisfaction client', value: '98%' },
  { label: 'Basee a Casablanca', value: 'MA' },
] as const;

export const services: ServiceItem[] = [
  {
    id: 'web',
    title: 'Developpement Web',
    subtitle: 'Sites vitrines, e-commerce et plateformes metier',
    description:
      "Conception de sites rapides, modernes et adaptes au mobile, avec une base solide pour le contenu, le SEO et l'evolution future.",
    highlights: ['UI sur mesure', 'SEO technique', 'Performance mobile'],
    icon: 'globe-outline',
    accent: 'accent',
    image: 'prjdev',
  },
  {
    id: 'mobile',
    title: 'Applications Mobile',
    subtitle: 'Experiences iOS et Android en React Native',
    description:
      "Realisation d'applications fluides pour presenter un service, digitaliser un parcours client ou lancer un produit avec une seule base de code.",
    highlights: ['React Native', 'UX mobile', 'Publication accompagnee'],
    icon: 'phone-portrait-outline',
    accent: 'blue',
    image: 'appmobile',
  },
  {
    id: 'design',
    title: 'Design UI/UX',
    subtitle: 'Wireframes, prototypes et identite visuelle',
    description:
      'Structuration de parcours clairs, interfaces coherentes et maquettes premium pour renforcer la confiance et la conversion.',
    highlights: ['Parcours utilisateur', 'Prototype', 'Branding digital'],
    icon: 'color-palette-outline',
    accent: 'amber',
    image: 'designuiux',
  },
];

export const processSteps = [
  {
    id: 'planning',
    title: 'Planification',
    text: 'Comprendre ce que vous voulez sur votre site web et definir une feuille de route claire.',
  },
  {
    id: 'conception',
    title: 'Conception',
    text: 'Concevoir une solution lisible, efficace et adaptee a votre projet digital.',
  },
  {
    id: 'development',
    title: 'Developpement',
    text: 'Developper des experiences web ou mobile stables, performantes et evolutives.',
  },
  {
    id: 'launch',
    title: 'Lancement',
    text: 'Apres les tests, livrer et deployer le produit pour une mise en service propre.',
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    text: 'Assurer le suivi et les ajustements necessaires pour garder le projet efficace dans le temps.',
  },
] as const;

export const valuePoints = [
  'Approche sur mesure pour chaque projet',
  'Execution mobile-first et orientee performance',
  'Accompagnement de la conception jusqu a la mise en ligne',
] as const;

export const projects: ProjectItem[] = [
  {
    id: 'showcase-brand',
    title: 'Site vitrine premium',
    category: 'Developpement web',
    summary:
      "Une presence digitale claire pour presenter l'activite, les services et les contacts avec une image plus professionnelle.",
    tags: ['Vitrine', 'SEO', 'Responsive'],
    accent: 'accent',
    image: 'devweb',
  },
  {
    id: 'store-launch',
    title: 'Boutique e-commerce',
    category: 'Commerce en ligne',
    summary:
      'Un parcours d achat simple avec catalogue, pages produits, mise en confiance et optimisation mobile.',
    tags: ['E-commerce', 'Paiement', 'Catalogue'],
    accent: 'blue',
    image: 'commerce',
  },
  {
    id: 'booking-app',
    title: 'Application de service',
    category: 'Application mobile',
    summary:
      'Une app pour simplifier la reservation, le suivi client ou la presentation d un service digital.',
    tags: ['React Native', 'UX', 'Cross-platform'],
    accent: 'amber',
    image: 'appService',
  },
];

export const contactDetails = {
  phone: '+212 6 66 67 16 07',
  email: 'contact@tasmimweb.com',
  address: 'Rue 14 Amal 2 Imm 2, 3eme Etage N 8, Sidi Bernoussi - Casablanca',
  hours: 'Lun - Sam, 9h00 - 18h30',
} as const;

export const ctaLinks = {
  phone: 'tel:+212666671607',
  email: 'mailto:contact@tasmimweb.com',
  website: 'https://www.tasmimweb.com/',
  linkedin: 'https://www.linkedin.com/company/tasmim-web-agency?originalSubdomain=ma',
  instagram: 'https://www.instagram.com/tasmimweb?igsh=MWd6ejJoNXM4cjJ4ZQ==',
} as const;

export const agencyStats = [
  { label: 'Projets realises', value: '42' },
  { label: 'Clients actifs', value: '12' },
  { label: 'Sites heberges', value: '22' },
  { label: 'CMS maitrises', value: '4' },
] as const;

export const contactServiceOptions = [
  'Creation de Site Web : Vitrine, Blog, e-Commerce',
  "Creation d'Application Web : Application de Gestion",
  "Creation d'Application Mobile : Native & Hybride",
  'Creation Graphique : Charte Graphique, Logo, Brochure',
  "Referencement d'un Site Web : SEO Naturel & Payant",
  'Strategie de Marketing : Publicite sur Google, Facebook',
  'Consulting : Formation, Conseil et Audit',
] as const;

export const technologies = ['Figma', 'Django', 'WordPress', 'WooCommerce', 'GitHub'] as const;

export const serviceShowcase = [
  {
    id: 'seo',
    title: 'Referencement Naturel SEO',
    description:
      'Ameliorez le retour de votre site web sur les moteurs de recherche avec des strategies durables et efficaces, naturelles ou payantes.',
    image: 'devlweb',
  },
  {
    id: 'digital-communication',
    title: 'Strategie de communication digitale',
    description:
      'Construire une strategie de marketing numerique pour faire de votre site web un levier de developpement a travers publicite, reseaux sociaux et campagnes ciblees.',
    image: 'site',
  },
  {
    id: 'visual-identity',
    title: 'Infographie & identite visuelle',
    description:
      'Creer une identite visuelle unique et sur mesure : logo, carte de visite, flyer, brochure et supports professionnels coherents.',
    image: 'branding',
  },
] as const;

export const accentColors: Record<AccentTone, string> = {
  accent: AppColors.accent,
  blue: AppColors.blue,
  amber: AppColors.amber,
};

export const accentSoftColors: Record<AccentTone, string> = {
  accent: AppColors.accentSoft,
  blue: 'rgba(59, 130, 246, 0.14)',
  amber: 'rgba(245, 158, 11, 0.14)',
};
