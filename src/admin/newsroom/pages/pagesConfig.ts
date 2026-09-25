import type { ComponentInfo } from '../hooks/useSingleType';
import { SINGLE_UID, type SingleTypeUID } from '../constants';

type Data = Record<string, any>;

export interface OutlineItem {
  key: string;
  icon?: string;
  title: string;
  summary: string[];
}

export interface PageDefinition {
  id: string;
  uid: SingleTypeUID;
  label: string;
  /** Path on the public website. */
  path: string;
  description: string;
  outline: (data: Data, components: Record<string, ComponentInfo>) => OutlineItem[];
}

const countOf = (value: unknown): number | null => {
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === 'object' && 'count' in value) return (value as { count: number }).count;
  return null;
};

/** Editor-facing names for fields, matching the labels in the page editor. */
const FIELD_NAMES: Record<string, string> = {
  blogs: 'articles',
  topBlogs: 'sidebar articles',
  mainArticle: 'main article',
  sideArticles: 'side articles',
  job_postings: 'job postings',
};

/** Hidden legacy fields that shouldn't appear in outlines (e.g. Main Header's old `blogs` list). */
const LEGACY_FIELDS: Record<string, string[]> = {
  'structure.main-header': ['blogs'],
};

const humanize = (key: string) =>
  FIELD_NAMES[key] ??
  key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase();

const TITLE_KEYS = ['title', 'Title', 'topTitle', 'name', 'Name', 'pageTitle', 'sectionTitle'];

/** One-line facts about a component instance: its title, related entries and counts. */
const summarize = (block: Data): string[] => {
  const facts: string[] = [];
  const title = TITLE_KEYS.map((key) => block[key]).find((value) => typeof value === 'string' && value.trim());
  if (title) facts.push(`“${title}”`);

  const skip = ['id', '__component', ...TITLE_KEYS, ...(LEGACY_FIELDS[block.__component] ?? [])];

  for (const [key, value] of Object.entries(block)) {
    if (skip.includes(key) || value == null) continue;

    const count = countOf(value);
    const name = typeof value === 'object' && !Array.isArray(value) ? (value.Name ?? value.name ?? value.Title) : undefined;

    if (name) {
      facts.push(`${humanize(key)}: ${name}`);
    } else if (count !== null) {
      facts.push(`${count} ${humanize(key)}`);
    }
  }

  return facts;
};

const componentItem = (
  key: string,
  uid: string,
  block: Data | null | undefined,
  components: Record<string, ComponentInfo>,
  summary?: string[]
): OutlineItem => ({
  key,
  icon: components[uid]?.info.icon,
  title: components[uid]?.info.displayName ?? uid,
  summary: block ? (summary ?? summarize(block)) : ['Not set up yet'],
});

export const PAGES: PageDefinition[] = [
  {
    id: 'home',
    uid: SINGLE_UID.homepage,
    label: 'Home Page',
    path: '/',
    description: 'The landing page, built from a stack of sections you can add, remove and reorder.',
    outline: (data, components) =>
      (data.content ?? []).map((block: Data, index: number) =>
        componentItem(`${block.__component}-${block.id ?? index}`, block.__component, block, components)
      ),
  },
  {
    id: 'crew',
    uid: SINGLE_UID.crew,
    label: 'Crew Page',
    path: '/crew',
    description: 'The team page: an intro header followed by the list of team members.',
    outline: (data, components) => [
      componentItem('header', 'structure.crew-header', data.header, components),
      componentItem('members', 'structure.crew-members', data.members, components, [
        `${countOf(data.members?.employee) ?? 0} team members`,
      ]),
    ],
  },
  {
    id: 'gigs',
    uid: SINGLE_UID.gigs,
    label: 'Gigs Page',
    path: '/gigs',
    description: 'The jobs page: page intro, a section heading and the job postings to feature.',
    outline: (data) => [
      {
        key: 'intro',
        icon: 'layout',
        title: 'Page intro',
        summary: data.pageTitle ? [`“${data.pageTitle}”`] : ['No page title yet'],
      },
      {
        key: 'listings',
        icon: 'briefcase',
        title: 'Job listings section',
        summary: [
          ...(data.sectionTitle ? [`“${data.sectionTitle}”`] : []),
          `${countOf(data.job_postings) ?? 0} featured postings`,
        ],
      },
    ],
  },
];

export const findPage = (id?: string) => PAGES.find((page) => page.id === id);
