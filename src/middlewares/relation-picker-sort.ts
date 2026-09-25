import type { Core } from '@strapi/strapi';

/**
 * Newest-first ordering for relation pickers in the admin.
 *
 * Strapi sorts the "Add or create a relation" dropdown alphabetically by the
 * target's display field. For articles (and job postings) editors want the
 * latest ones first, so when that dropdown targets one of the types below and
 * the request doesn't already ask for a sort, we add one.
 *
 * Only the "available relations" endpoint is touched:
 *   GET /content-manager/relations/:model/:targetField
 * The endpoint listing already-selected relations (…/:model/:id/:targetField)
 * is left alone, so the order editors drag relations into is never changed.
 *
 * Drafts are what the picker lists, and drafts have no `publishedAt` in
 * Strapi 5, so we sort by the article's own date field instead.
 */
const SORT_BY_TARGET: Record<string, string[]> = {
  'api::blog.blog': ['PublishedDate:desc', 'createdAt:desc'],
  'api::job-posting.job-posting': ['posted:desc', 'createdAt:desc'],
};

const AVAILABLE_RELATIONS_PATH = /^\/content-manager\/relations\/([^/]+)\/([^/]+)\/?$/;

export default (_config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    const match = ctx.method === 'GET' ? AVAILABLE_RELATIONS_PATH.exec(ctx.path) : null;

    if (match) {
      const [, model, targetField] = match.map(decodeURIComponent);
      const attribute = (strapi.getModel(model as any) as any)?.attributes?.[targetField];
      const sort = attribute?.type === 'relation' ? SORT_BY_TARGET[attribute.target] : undefined;

      if (sort && !new URLSearchParams(ctx.querystring).has('sort') && !ctx.querystring.includes('sort%5B') && !ctx.querystring.includes('sort[')) {
        const extra = sort.map((value, index) => `sort[${index}]=${encodeURIComponent(value)}`).join('&');
        ctx.querystring = ctx.querystring ? `${ctx.querystring}&${extra}` : extra;
      }
    }

    await next();
  };
};
