import * as React from 'react';
import { useFetchClient } from '@strapi/strapi/admin';

interface State<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetches a single type's draft document from the Content Manager admin API,
 * plus the status of its versions (draft / published / modified).
 */
export const useSingleType = <T = Record<string, any>>(uid: string) => {
  const { get } = useFetchClient();
  const [state, setState] = React.useState<State<T & { status?: string }>>({ data: null, isLoading: true, error: null });

  React.useEffect(() => {
    let cancelled = false;
    setState({ data: null, isLoading: true, error: null });

    get<{ data: T & { status?: string } }>(`/content-manager/single-types/${uid}`)
      .then(({ data }) => {
        if (!cancelled) setState({ data: data.data, isLoading: false, error: null });
      })
      .catch((error: Error & { status?: number; response?: { status?: number } }) => {
        if (cancelled) return;
        // A single type that has never been saved returns 404 — treat it as "empty", not an error.
        const status = error.status ?? error.response?.status;
        setState({ data: null, isLoading: false, error: status === 404 ? null : error });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  return state;
};

export interface ComponentInfo {
  uid: string;
  info: { displayName: string; icon?: string; description?: string };
}

let componentCache: Promise<Record<string, ComponentInfo>> | null = null;

/** Component display names / icons from the Content Manager, so outlines match the schema. */
export const useComponentInfo = () => {
  const { get } = useFetchClient();
  const [components, setComponents] = React.useState<Record<string, ComponentInfo>>({});

  React.useEffect(() => {
    componentCache ??= get<{ data: { components: ComponentInfo[] } }>('/content-manager/init')
      .then(({ data }) => Object.fromEntries(data.data.components.map((c) => [c.uid, c])))
      .catch(() => {
        componentCache = null;
        return {};
      });

    let cancelled = false;
    componentCache.then((map) => !cancelled && setComponents(map));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return components;
};
