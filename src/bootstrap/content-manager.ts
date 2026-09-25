import type { Core } from '@strapi/strapi';

/**
 * Editor-friendly Content Manager configuration, applied on every startup.
 *
 * Everything here only replaces values that are still on Strapi's defaults, so
 * anything an editor changes later via "Configure the view" is left alone.
 */

/* -------------------------------------------------------------------------------------------------
 * Entry titles & default sort
 * -----------------------------------------------------------------------------------------------*/

/**
 * The mainField is what the admin shows as an entry's title (edit view header,
 * relation pickers, "Last edited" widgets). Several types defaulted to
 * `documentId`, which shows random IDs to editors.
 */
const DISPLAY_SETTINGS: Record<string, { mainField: string; defaultSortBy?: string; defaultSortOrder?: 'ASC' | 'DESC' }> = {
  // Single types: `id` makes the editor header show the page name ("Home Page") instead of an ID.
  'api::homepage.homepage': { mainField: 'id' },
  'api::crew.crew': { mainField: 'id' },
  'api::blog.blog': { mainField: 'Title', defaultSortBy: 'updatedAt', defaultSortOrder: 'DESC' },
  'api::category.category': { mainField: 'Name', defaultSortBy: 'Name', defaultSortOrder: 'ASC' },
  'api::tag.tag': { mainField: 'Name', defaultSortBy: 'Name', defaultSortOrder: 'ASC' },
  'api::author.author': { mainField: 'Name', defaultSortBy: 'Name', defaultSortOrder: 'ASC' },
  'api::job-posting.job-posting': { mainField: 'title', defaultSortBy: 'posted', defaultSortOrder: 'DESC' },
  'api::job-category.job-category': { mainField: 'name', defaultSortBy: 'name', defaultSortOrder: 'ASC' },
  'api::job-level.job-level': { mainField: 'level', defaultSortBy: 'level', defaultSortOrder: 'ASC' },
};

const PLACEHOLDER_FIELDS = new Set(['id', 'documentId']);

/** Field used as the title of a collapsed component / page-builder section. */
const COMPONENT_MAIN_FIELDS: Record<string, string> = {
  'structure.category-feed': 'topTitle',
  'structure.excerpt-section': 'title',
  'structure.social-media-section': 'title',
  'structure.crew-header': 'title',
  'structure.employee': 'name',
  'structure.job-postings': 'Title',
  'structure.link': 'text',
  'structure.hamburger-links': 'text',
  'structure.social-medias': 'mediaLink',
  'shared.seo': 'metaTitle',
};

/* -------------------------------------------------------------------------------------------------
 * Field labels & help text (edit view)
 * -----------------------------------------------------------------------------------------------*/

interface FieldHelp {
  label?: string;
  description?: string;
  placeholder?: string;
}

const PAGE_FIELDS: Record<string, Record<string, FieldHelp>> = {
  'api::homepage.homepage': {
    content: {
      label: 'Page sections',
      description: 'The blocks on the homepage, top to bottom. Use “Add a component” to add a section, and drag a section by its handle to reorder.',
    },
    seo: { label: 'SEO', description: 'How the homepage appears in Google and when shared on social media.' },
  },
  'api::crew.crew': {
    header: { label: 'Page header' },
    members: { label: 'Team members' },
  },
  'api::gigs.gigs': {
    pageTitle: { label: 'Page title' },
    pageDescription: { label: 'Page intro' },
    sectionTitle: { label: 'Listings heading' },
    sectionDescription: { label: 'Listings intro' },
    job_postings: { label: 'Job postings', description: 'The job postings to feature on the Gigs page.' },
  },
  'api::global.global': {
    siteName: { label: 'Site name' },
    siteDescription: { label: 'Site description' },
    siteLogo: { label: 'Site logo' },
    favicon: { label: 'Favicon', description: 'The small icon shown in the browser tab.' },
    navbar: { label: 'Navigation bar', description: 'The site header: logo, main links and mobile menu.' },
    footer: { label: 'Footer', description: 'The site footer: logo, links and social icons.' },
    defaultSeo: { label: 'Default SEO', description: 'Fallback search & social settings for the site.' },
  },
};

const COMPONENT_FIELDS: Record<string, Record<string, FieldHelp>> = {
  'structure.main-header': {
    blogs: { label: 'Articles', description: 'The first article is the large lead story; the rest are listed beside it.' },
  },
  'structure.category-feed': {
    category: { label: 'Category', description: 'The section shows the latest articles from this category.' },
    topTitle: { label: 'Sidebar title' },
    topBlogs: { label: 'Sidebar articles', description: 'Hand-picked articles listed in the sidebar.' },
    color: {
      label: 'Sidebar colour',
      description: 'Hex colour, e.g. #ff6316. Leave empty to use the category’s colour.',
      placeholder: '#ff6316',
    },
  },
  'structure.excerpt-section': {
    url: {
      label: 'Link URL',
      description: 'The page this section links to. Its title and preview image are fetched automatically.',
      placeholder: 'https://',
    },
    title: { label: 'Title' },
    summary: { label: 'Summary' },
    author: { label: 'Author' },
  },
  'structure.social-media-section': {
    embed: { label: 'Social post', description: 'Paste the URL of the post you want to embed (e.g. a LinkedIn post).' },
    title: { label: 'Title' },
    summary: { label: 'Summary' },
    author: { label: 'Author' },
  },
  'structure.crew-header': {
    title: { label: 'Title' },
    description: { label: 'Intro text' },
  },
  'structure.crew-members': {
    employee: { label: 'Team members', description: 'Drag to change the order people appear in.' },
  },
  'structure.employee': {
    profile: { label: 'Photo' },
    name: { label: 'Name' },
    title: { label: 'Job title' },
    bio: { label: 'Bio' },
    socials: { label: 'Social links' },
  },
  'structure.job-postings': {
    Title: { label: 'Heading' },
    description: { label: 'Intro text' },
    job_postings: { label: 'Job postings' },
  },
  'structure.navbar': {
    logo: { label: 'Logo' },
    links: { label: 'Main links' },
    hamburgerLinks: { label: 'Mobile menu links' },
  },
  'structure.footer': {
    logo: { label: 'Logo' },
    links: { label: 'Footer links' },
    socialMedias: { label: 'Social media icons' },
  },
  'structure.link': {
    text: { label: 'Link text' },
    url: { label: 'URL', placeholder: '/about or https://…' },
  },
  'structure.hamburger-links': {
    text: { label: 'Link text' },
    url: { label: 'URL', placeholder: '/about or https://…' },
  },
  'structure.social-medias': {
    mediaLogo: { label: 'Icon' },
    mediaLink: { label: 'Profile URL', placeholder: 'https://' },
  },
  'shared.seo': {
    metaTitle: { label: 'Search title', description: 'Shown as the headline in Google. Up to 60 characters.' },
    metaDescription: { label: 'Search description', description: 'Shown under the headline in Google. Up to 160 characters.' },
    keywords: { label: 'Keywords' },
    canonicalURL: { label: 'Canonical URL', description: 'Only needed if this content is also published at another URL.' },
    ogImage: { label: 'Social share image', description: 'Shown when the page is shared on social media.' },
    preventIndexing: { label: 'Hide from search engines' },
  },
};

/* -------------------------------------------------------------------------------------------------
 * Apply
 * -----------------------------------------------------------------------------------------------*/

type Metadatas = Record<string, { edit?: Record<string, any>; list?: Record<string, any> }>;

/** Returns updated metadatas, or null when nothing needed changing. */
const withFieldHelp = (metadatas: Metadatas, fields: Record<string, FieldHelp>): Metadatas | null => {
  let changed = false;
  const next: Metadatas = { ...metadatas };

  for (const [field, help] of Object.entries(fields)) {
    const edit = next[field]?.edit;
    if (!edit) continue;

    const updated = { ...edit };
    // Strapi's default label is the raw field name; only replace that.
    if (help.label && edit.label === field) updated.label = help.label;
    if (help.description && !edit.description) updated.description = help.description;
    if (help.placeholder && !edit.placeholder) updated.placeholder = help.placeholder;

    if (JSON.stringify(updated) !== JSON.stringify(edit)) {
      next[field] = { ...next[field], edit: updated };
      changed = true;
    }
  }

  return changed ? next : null;
};

export const applyContentManagerConfig = async (strapi: Core.Strapi) => {
  const contentTypes = strapi.plugin('content-manager').service('content-types');
  const components = strapi.plugin('content-manager').service('components');
  const updated: string[] = [];

  const contentTypeUids = new Set([...Object.keys(DISPLAY_SETTINGS), ...Object.keys(PAGE_FIELDS)]);

  for (const uid of contentTypeUids) {
    if (!strapi.contentTypes[uid as keyof typeof strapi.contentTypes]) continue;

    const { settings, metadatas } = await contentTypes.findConfiguration({ uid });
    const patch: Record<string, unknown> = {};

    const wanted = DISPLAY_SETTINGS[uid];
    if (wanted) {
      const nextSettings = { ...settings };
      if (PLACEHOLDER_FIELDS.has(settings.mainField)) nextSettings.mainField = wanted.mainField;
      if (wanted.defaultSortBy && PLACEHOLDER_FIELDS.has(settings.defaultSortBy)) {
        nextSettings.defaultSortBy = wanted.defaultSortBy;
        nextSettings.defaultSortOrder = wanted.defaultSortOrder;
      }
      if (nextSettings.mainField !== settings.mainField || nextSettings.defaultSortBy !== settings.defaultSortBy) {
        patch.settings = nextSettings;
      }
    }

    const nextMetadatas = PAGE_FIELDS[uid] && withFieldHelp(metadatas, PAGE_FIELDS[uid]);
    if (nextMetadatas) patch.metadatas = nextMetadatas;

    if (Object.keys(patch).length) {
      await contentTypes.updateConfiguration({ uid }, patch);
      updated.push(uid);
    }
  }

  const componentUids = new Set([...Object.keys(COMPONENT_FIELDS), ...Object.keys(COMPONENT_MAIN_FIELDS)]);

  for (const uid of componentUids) {
    const component = components.findComponent(uid);
    if (!component) continue;

    const { settings, metadatas } = await components.findConfiguration(component);
    const patch: Record<string, unknown> = {};

    const mainField = COMPONENT_MAIN_FIELDS[uid];
    if (mainField && PLACEHOLDER_FIELDS.has(settings.mainField)) {
      patch.settings = { ...settings, mainField };
    }

    const nextMetadatas = COMPONENT_FIELDS[uid] && withFieldHelp(metadatas, COMPONENT_FIELDS[uid]);
    if (nextMetadatas) patch.metadatas = nextMetadatas;

    if (Object.keys(patch).length) {
      await components.updateConfiguration(component, patch);
      updated.push(uid);
    }
  }

  if (updated.length) {
    strapi.log.info(`[admin] Editor labels & display settings updated for: ${updated.join(', ')}`);
  }
};
