import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layouts,
  Pagination,
  SearchInput,
  Table,
  useQueryParams,
} from '@strapi/strapi/admin';
import {
  Box,
  Button,
  Flex,
  LinkButton,
  SingleSelect,
  SingleSelectOption,
  Typography,
} from '@strapi/design-system';
import { ExternalLink, Plus } from '@strapi/icons';
import { Link as RouterLink } from 'react-router-dom';

import { useCollection } from '../hooks/useCollection';
import { cmCreateUrl, cmEditUrl, cmListUrl, type FilterClause } from '../utils/contentManager';
import type { ContentTypeUID } from '../constants';

export interface Column<T = Record<string, any>> {
  name: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface QuickFilter {
  /** URL query param used to remember the selection. */
  param: string;
  label: string;
  options: { label: string; value: string }[];
  toFilter: (value: string) => FilterClause;
}

interface EntryListProps<T> {
  uid: ContentTypeUID;
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  /** Filters that always apply to this view (e.g. "category = Tech"). */
  baseFilters?: FilterClause[];
  /** User-selectable dropdown filters shown above the table. */
  quickFilters?: QuickFilter[];
  defaultSort?: string;
  searchPlaceholder?: string;
  /** Where a row click goes. Defaults to the Content Manager edit view. */
  onRowClick?: (row: T) => void;
  canCreate?: boolean;
  headerActions?: React.ReactNode;
}

type ListQuery = Record<string, string | undefined> & {
  page?: string;
  pageSize?: string;
  sort?: string;
  _q?: string;
};

export const EntryList = <T extends { id: number; documentId: string }>({
  uid,
  title,
  subtitle,
  columns,
  baseFilters = [],
  quickFilters = [],
  defaultSort = 'updatedAt:DESC',
  searchPlaceholder = 'Search…',
  onRowClick,
  canCreate = true,
  headerActions,
}: EntryListProps<T>) => {
  const navigate = useNavigate();
  const [{ query }, setQuery] = useQueryParams<ListQuery>();

  const activeQuickFilters = quickFilters
    .filter((qf) => query[qf.param])
    .map((qf) => qf.toFilter(query[qf.param] as string));

  const filters = [...baseFilters, ...activeQuickFilters];

  const { results, pagination, isLoading, error } = useCollection<T>(uid, {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
    sort: query.sort ?? defaultSort,
    search: query._q,
    filters,
  });

  const handleRowClick = (row: T) =>
    onRowClick ? onRowClick(row) : navigate(cmEditUrl(uid, row.documentId));

  const headers = columns.map(({ name, label, sortable }) => ({ name, label, sortable: !!sortable }));

  return (
    <>
      <Layouts.Header
        title={title}
        subtitle={subtitle ?? (pagination ? `${pagination.total} ${pagination.total === 1 ? 'entry' : 'entries'}` : undefined)}
        primaryAction={
          canCreate ? (
            <Button startIcon={<Plus />} onClick={() => navigate(cmCreateUrl(uid))}>
              Create new
            </Button>
          ) : undefined
        }
        secondaryAction={
          <Flex gap={2}>
            {headerActions}
            <LinkButton
              tag={RouterLink}
              to={cmListUrl(uid, filters, query.sort ?? defaultSort)}
              variant="tertiary"
              startIcon={<ExternalLink />}
            >
              Bulk edit
            </LinkButton>
          </Flex>
        }
      />
      <Layouts.Action
        startActions={
          <Flex gap={2} wrap="wrap">
            <SearchInput label={searchPlaceholder} placeholder={searchPlaceholder} trackedEvent={null} />
            {quickFilters.map((qf) => (
              <Box key={qf.param} minWidth="18rem">
                <SingleSelect
                  aria-label={qf.label}
                  placeholder={qf.label}
                  size="S"
                  value={query[qf.param] ?? ''}
                  onClear={() => setQuery({ [qf.param]: undefined, page: '1' } as ListQuery)}
                  onChange={(value) => setQuery({ [qf.param]: String(value), page: '1' } as ListQuery)}
                >
                  {qf.options.map((option) => (
                    <SingleSelectOption key={option.value} value={option.value}>
                      {option.label}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
              </Box>
            ))}
          </Flex>
        }
      />
      <Layouts.Content>
        {error ? (
          <Box padding={6} background="neutral0" hasRadius shadow="tableShadow">
            <Typography textColor="danger600">
              Could not load entries. You may not have permission to read this content type.
            </Typography>
          </Box>
        ) : (
          <Flex direction="column" alignItems="stretch" gap={4}>
            <Table.Root rows={results} headers={headers} isLoading={isLoading}>
              <Table.Content>
                <Table.Head>
                  {headers.map((header) => (
                    <Table.HeaderCell key={header.name} {...header} />
                  ))}
                </Table.Head>
                <Table.Body>
                  <Table.Loading />
                  <Table.Empty />
                  {results.map((row) => (
                    <Table.Row
                      key={row.id}
                      cursor="pointer"
                      onClick={() => handleRowClick(row)}
                    >
                      {columns.map((column) => (
                        <Table.Cell key={column.name}>
                          {column.render ? (
                            column.render(row)
                          ) : (
                            <Typography textColor="neutral800" ellipsis>
                              {formatValue((row as Record<string, unknown>)[column.name])}
                            </Typography>
                          )}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.Root>
            {pagination && pagination.total > 0 && (
              <Pagination.Root pageCount={pagination.pageCount} total={pagination.total}>
                <Pagination.PageSize />
                <Pagination.Links />
              </Pagination.Root>
            )}
          </Flex>
        )}
      </Layouts.Content>
    </>
  );
};

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};
