/**
 * Content-type UIDs used by the newsroom admin sections.
 * These must match the schemas in src/api/* — they are not renamed anywhere.
 */
export const UID = {
  article: 'api::blog.blog',
  category: 'api::category.category',
  tag: 'api::tag.tag',
  author: 'api::author.author',
  jobPosting: 'api::job-posting.job-posting',
  jobCategory: 'api::job-category.job-category',
  jobLevel: 'api::job-level.job-level',
  user: 'plugin::users-permissions.user',
} as const;

export type ContentTypeUID = (typeof UID)[keyof typeof UID];

/** Single types (pages + site-wide settings). */
export const SINGLE_UID = {
  homepage: 'api::homepage.homepage',
  crew: 'api::crew.crew',
  gigs: 'api::gigs.gigs',
  global: 'api::global.global',
} as const;

export type SingleTypeUID = (typeof SINGLE_UID)[keyof typeof SINGLE_UID];

/** Top-level routes registered in the main left navigation. */
export const SECTION = {
  articles: 'newsroom-articles',
  categories: 'newsroom-categories',
  jobs: 'newsroom-jobs',
  pages: 'newsroom-pages',
  admin: 'newsroom-admin',
} as const;

/** Public website, used for "View on site" links. Override with STRAPI_ADMIN_SITE_URL. */
export const SITE_URL = (process.env.STRAPI_ADMIN_SITE_URL || 'https://www.cybrosecurity.com').replace(/\/+$/, '');

/** Publication status filter values understood by the Content Manager API. */
export type StatusFilter = 'draft' | 'published' | 'published-modified';

export const readPermission = (subject: ContentTypeUID | SingleTypeUID) => ({
  action: 'plugin::content-manager.explorer.read',
  subject,
});
