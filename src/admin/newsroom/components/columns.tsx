import * as React from 'react';
import { Flex, IconButton, Typography } from '@strapi/design-system';
import { Pencil } from '@strapi/icons';

import { ColorDot, CountCell, DateCell, RelationCell, StatusCell, TitleCell } from './cells';
import type { Column, QuickFilter } from './EntryList';
import { relationFilter, statusFilter, type FilterClause } from '../utils/contentManager';
import type { StatusFilter } from '../constants';

type Row = Record<string, any>;

export const articleColumns: Column<Row>[] = [
  {
    name: 'Title',
    label: 'Title',
    sortable: true,
    render: (row) => <TitleCell title={row.Title} featured={row.isFeatured} />,
  },
  {
    name: 'category',
    label: 'Category',
    render: (row) =>
      row.category ? (
        <Flex gap={2}>
          <ColorDot color={row.category.color} />
          <RelationCell value={row.category} field="Name" />
        </Flex>
      ) : (
        <RelationCell value={null} field="Name" />
      ),
  },
  { name: 'author', label: 'Author', render: (row) => <RelationCell value={row.author} field="Name" /> },
  { name: 'PublishedDate', label: 'Publish date', sortable: true, render: (row) => <DateCell value={row.PublishedDate} /> },
  { name: 'updatedAt', label: 'Last edited', sortable: true, render: (row) => <DateCell value={row.updatedAt} /> },
  { name: 'status', label: 'Status', render: (row) => <StatusCell status={row.status} /> },
];

export const taxonomyColumns = (
  nameField: string,
  countField: string,
  countLabel: string,
  onEdit?: (row: Row) => void
): Column<Row>[] => [
  {
    name: nameField,
    label: 'Name',
    sortable: true,
    render: (row) => (
      <Flex gap={2}>
        {'color' in row && <ColorDot color={row.color} />}
        <Typography textColor="neutral800" fontWeight="semiBold">
          {row[nameField] || 'Untitled'}
        </Typography>
      </Flex>
    ),
  },
  { name: 'slug', label: 'Slug', render: (row) => <Typography textColor="neutral600">{row.Slug ?? row.slug ?? '—'}</Typography> },
  { name: countField, label: countLabel, render: (row) => <CountCell value={row[countField]} /> },
  { name: 'status', label: 'Status', render: (row) => <StatusCell status={row.status} /> },
  ...(onEdit
    ? [
        {
          name: 'actions',
          label: 'Edit',
          render: (row: Row) => (
            <IconButton
              label={`Edit ${row[nameField] ?? ''}`}
              variant="ghost"
              onClick={(event: React.MouseEvent) => {
                // Keep the row click (which opens the filtered list) from firing too.
                event.stopPropagation();
                onEdit(row);
              }}
            >
              <Pencil />
            </IconButton>
          ),
        },
      ]
    : []),
];

export const jobPostingColumns: Column<Row>[] = [
  {
    name: 'title',
    label: 'Title',
    sortable: true,
    render: (row) => (
      <Typography textColor="neutral800" fontWeight="semiBold" ellipsis>
        {row.title || 'Untitled'}
      </Typography>
    ),
  },
  { name: 'job_category', label: 'Category', render: (row) => <RelationCell value={row.job_category} field="name" /> },
  { name: 'job_level', label: 'Level', render: (row) => <RelationCell value={row.job_level} field="level" /> },
  { name: 'posted', label: 'Posted', sortable: true, render: (row) => <DateCell value={row.posted} /> },
  { name: 'status', label: 'Status', render: (row) => <StatusCell status={row.status} /> },
];

export const statusQuickFilter: QuickFilter = {
  param: 'status',
  label: 'Any status',
  options: [
    { label: 'Draft (never published)', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Published, with unpublished changes', value: 'published-modified' },
  ],
  toFilter: (value) => statusFilter(value as StatusFilter),
};

/** Dropdown filter over a relation, e.g. "Category: Tech". */
export const relationQuickFilter = (
  param: string,
  label: string,
  field: string,
  options: { label: string; value: string }[]
): QuickFilter => ({
  param,
  label,
  options,
  toFilter: (documentId): FilterClause => relationFilter(field, documentId),
});

export const toOptions = (rows: Row[], labelField: string) =>
  rows.map((row) => ({ label: row[labelField] || 'Untitled', value: row.documentId as string }));
