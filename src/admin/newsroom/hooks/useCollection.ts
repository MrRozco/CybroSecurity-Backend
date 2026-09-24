import * as React from 'react';
import { useFetchClient } from '@strapi/strapi/admin';

import { cmApiUrl, toQueryString, type FilterClause } from '../utils/contentManager';
import type { ContentTypeUID } from '../constants';

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface CollectionQuery {
  page?: number | string;
  pageSize?: number | string;
  sort?: string;
  search?: string;
  filters?: FilterClause[];
}

interface State<T> {
  results: T[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetches a page of documents from the Content Manager admin API.
 * Uses the admin session, so it only returns what the current role may read.
 */
export const useCollection = <T = Record<string, any>>(
  uid: ContentTypeUID,
  { page = 1, pageSize = 10, sort, search, filters = [] }: CollectionQuery = {},
  { enabled = true }: { enabled?: boolean } = {}
) => {
  const { get } = useFetchClient();
  const [state, setState] = React.useState<State<T>>({
    results: [],
    pagination: null,
    isLoading: enabled,
    error: null,
  });

  const queryString = toQueryString({
    page,
    pageSize,
    sort,
    _q: search,
    filters: filters.length ? { $and: filters } : undefined,
  });

  const [reloadKey, setReloadKey] = React.useState(0);
  const refetch = React.useCallback(() => setReloadKey((key) => key + 1), []);

  React.useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    get<{ results: T[]; pagination: Pagination }>(`${cmApiUrl(uid)}?${queryString}`)
      .then(({ data }) => {
        if (!cancelled) {
          setState({ results: data.results, pagination: data.pagination, isLoading: false, error: null });
        }
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ results: [], pagination: null, isLoading: false, error });
      });

    return () => {
      cancelled = true;
    };
    // `get` is stable per session; the query string captures every input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, queryString, enabled, reloadKey]);

  return { ...state, refetch };
};

/** Total count for a filtered query — fetches a single row and reads pagination.total. */
export const useCount = (uid: ContentTypeUID, filters: FilterClause[] = [], options?: { enabled?: boolean }) => {
  const { pagination, isLoading, error } = useCollection(uid, { page: 1, pageSize: 1, filters }, options);
  return { count: pagination?.total ?? 0, isLoading, error };
};
