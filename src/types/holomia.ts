export type AppRoute =
  | 'home'
  | 'platform'
  | 'solutions-event'
  | 'solutions-venue'
  | 'solutions-custom'
  | 'case-studies'
  | 'showroom'
  | 'about';

export type LeadModalType = 'pitch-deck' | 'agency-rate-card' | 'roi-excel' | null;

export type LeadTag =
  | 'pitch-deck-download'
  | 'agency-rate-card'
  | 'venue-roi-excel'
  | 'event-lead'
  | 'venue-lead'
  | 'custom-lead';

export type PlatformModeId = 'journey' | 'arena';

export type CaseCategory =
  | 'all'
  | 'event'
  | 'heritage'
  | 'venue';

export interface CaseStudy {
  id: string;
  category: Exclude<CaseCategory, 'all'>;
  categoryLabel: string;
  title: string;
  subtitle: string;
  location: string;
  headlineMetric: string;
  image: string;
  imageAlt: string;
  featuredSpan?: 'wide' | 'standard';
  problem: string;
  solution: string;
  results: string[];
}

export interface EventPackage {
  id: string;
  name: string;
  scale: string;
  capacityPerDay: string;
  staffing: string;
  contentIncluded: string;
  twoDayPrice: string;
  extraDayPrice: string;
  recommendedFor: string;
  highlighted?: boolean;
}

export interface InsightArticle {
  id: string;
  category: string;
  readTime: string;
  date: string;
  title: string;
  summary: string;
  keyTakeaways: string[];
  body: string[];
}
