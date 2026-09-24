import type { ContentTypeUID, StatusFilter } from '../constants';

type QueryValue = string | number | boolean | null | undefined | QueryObject | QueryValue[];
interface QueryObject {
  [key: string]: QueryValue;
}

/**
 * Serialises nested objects into Strapi's bracket query format,
 * e.g. { filters: { $and: [{ category: { id: { $eq: 3 } } }] } }
 *   -> filters[$and][0][category][id][$eq]=3
 */
export const toQueryString = (obj: QueryObject): string => {
  const parts: string[] = [];

  const walk = (value: QueryValue, prefix: string) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, `${prefix}[${index}]`));
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([key, child]) => walk(child, prefix ? `${prefix}[${key}]` : key));
    } else {
      parts.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(String(value))}`);
    }
  };

  walk(obj, '');
  return parts.join('&');
};

/** A single `$and` clause for the Content Manager `filters` param. */
export type FilterClause = QueryObject;

/**
 * Filter by a related document. Uses `documentId` (not `id`) because draft and
 * published versions of the same document have different row ids in Strapi 5.
 */
export const relationFilter = (field: string, documentId: string): FilterClause => ({
  [field]: { documentId: { $eq: documentId } },
});

export const statusFilter = (status: StatusFilter): FilterClause => ({
  __status: { $eq: status },
});

export const fieldFilter = (field: string, value: string | number | boolean): FilterClause => ({
  [field]: { $eq: value },
});

/** Link to the native Content Manager list, pre-filtered — useful for bulk actions. */
export const cmListUrl = (uid: ContentTypeUID, filters: FilterClause[] = [], sort?: string) => {
  const query = toQueryString({
    page: 1,
    pageSize: 25,
    sort,
    filters: filters.length ? { $and: filters } : undefined,
  });

  return `/content-manager/collection-types/${uid}?${query}`;
};

export const cmEditUrl = (uid: ContentTypeUID, documentId: string) =>
  `/content-manager/collection-types/${uid}/${documentId}`;

export const cmCreateUrl = (uid: ContentTypeUID) => `/content-manager/collection-types/${uid}/create`;

/** Admin API endpoint that backs the Content Manager list view (respects RBAC). */
export const cmApiUrl = (uid: ContentTypeUID) => `/content-manager/collection-types/${uid}`;
