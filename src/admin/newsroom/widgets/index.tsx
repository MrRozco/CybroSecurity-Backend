import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Widget } from '@strapi/strapi/admin';
import { Box, Flex, Grid, Typography } from '@strapi/design-system';

import { ColorDot, DateCell, StatusCell } from '../components/cells';
import { useCollection, useCount } from '../hooks/useCollection';
import { cmEditUrl, statusFilter } from '../utils/contentManager';
import { SECTION, UID, type ContentTypeUID } from '../constants';

type Row = Record<string, any>;

/* -------------------------------------------------------------------------------------------------
 * Newsroom at a glance
 * -----------------------------------------------------------------------------------------------*/

const StatTile = ({ label, uid, filters, to }: { label: string; uid: ContentTypeUID; filters: ReturnType<typeof statusFilter>[]; to: string }) => {
  const { count, isLoading } = useCount(uid, filters);

  return (
    <Box
      tag={RouterLink}
      to={to}
      padding={4}
      hasRadius
      background="neutral100"
      borderColor="neutral150"
      width="100%"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <Typography variant="alpha" textColor="primary600" tag="p">
        {isLoading ? '…' : count}
      </Typography>
      <Typography variant="pi" textColor="neutral600">
        {label}
      </Typography>
    </Box>
  );
};

export const OverviewWidget = () => (
  <Grid.Root gap={3}>
    <Grid.Item col={6} s={12}>
      <StatTile label="Published articles" uid={UID.article} filters={[statusFilter('published')]} to={`/${SECTION.articles}/published`} />
    </Grid.Item>
    <Grid.Item col={6} s={12}>
      <StatTile label="Drafts" uid={UID.article} filters={[statusFilter('draft')]} to={`/${SECTION.articles}/drafts`} />
    </Grid.Item>
    <Grid.Item col={6} s={12}>
      <StatTile
        label="Unpublished changes"
        uid={UID.article}
        filters={[statusFilter('published-modified')]}
        to={`/${SECTION.articles}/pending-changes`}
      />
    </Grid.Item>
    <Grid.Item col={6} s={12}>
      <StatTile label="Live job postings" uid={UID.jobPosting} filters={[statusFilter('published')]} to={`/${SECTION.jobs}/published`} />
    </Grid.Item>
  </Grid.Root>
);

/* -------------------------------------------------------------------------------------------------
 * Shared list widget
 * -----------------------------------------------------------------------------------------------*/

const EntryRows = ({
  uid,
  rows,
  isLoading,
  error,
  titleField,
  dateField,
  emptyLabel,
}: {
  uid: ContentTypeUID;
  rows: Row[];
  isLoading: boolean;
  error: Error | null;
  titleField: string;
  dateField: string;
  emptyLabel: string;
}) => {
  if (isLoading) return <Widget.Loading />;
  if (error) return <Widget.Error />;
  if (rows.length === 0) return <Widget.NoData>{emptyLabel}</Widget.NoData>;

  return (
    <Flex direction="column" alignItems="stretch" gap={1}>
      {rows.map((row) => (
        <Flex
          key={row.documentId}
          tag={RouterLink}
          to={cmEditUrl(uid, row.documentId)}
          justifyContent="space-between"
          gap={3}
          padding={2}
          hasRadius
          style={{ textDecoration: 'none' }}
        >
          <Box minWidth={0} flex={1}>
            <Typography textColor="neutral800" fontWeight="semiBold" ellipsis tag="p">
              {row[titleField] || 'Untitled'}
            </Typography>
            <DateCell value={row[dateField]} />
          </Box>
          <StatusCell status={row.status} />
        </Flex>
      ))}
    </Flex>
  );
};

export const RecentDraftsWidget = () => {
  const { results, isLoading, error } = useCollection(UID.article, {
    pageSize: 5,
    sort: 'updatedAt:DESC',
    filters: [statusFilter('draft')],
  });

  return (
    <EntryRows
      uid={UID.article}
      rows={results}
      isLoading={isLoading}
      error={error}
      titleField="Title"
      dateField="updatedAt"
      emptyLabel="No drafts — everything is published."
    />
  );
};

export const LatestJobsWidget = () => {
  const { results, isLoading, error } = useCollection(UID.jobPosting, { pageSize: 5, sort: 'updatedAt:DESC' });

  return (
    <EntryRows
      uid={UID.jobPosting}
      rows={results}
      isLoading={isLoading}
      error={error}
      titleField="title"
      dateField="updatedAt"
      emptyLabel="No job postings yet."
    />
  );
};

/* -------------------------------------------------------------------------------------------------
 * Articles per category
 * -----------------------------------------------------------------------------------------------*/

export const CategoriesWidget = () => {
  const { results, isLoading, error } = useCollection(UID.category, { pageSize: 100, sort: 'Name:ASC' });

  if (isLoading) return <Widget.Loading />;
  if (error) return <Widget.Error />;
  if (results.length === 0) return <Widget.NoData>No categories yet.</Widget.NoData>;

  const counts = results.map((row) => ({
    row,
    count: Array.isArray(row.blogs) ? row.blogs.length : (row.blogs?.count ?? 0),
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));

  return (
    <Flex direction="column" alignItems="stretch" gap={3}>
      {counts.map(({ row, count }) => (
        <Box
          key={row.documentId}
          tag={RouterLink}
          to={`/${SECTION.categories}/category/${row.documentId}`}
          style={{ textDecoration: 'none', display: 'block' }}
        >
          <Flex justifyContent="space-between" gap={2} paddingBottom={1}>
            <Flex gap={2}>
              <ColorDot color={row.color} />
              <Typography textColor="neutral800">{row.Name || 'Untitled'}</Typography>
            </Flex>
            <Typography textColor="neutral600" variant="pi">
              {count}
            </Typography>
          </Flex>
          <Box background="neutral150" hasRadius height="0.6rem" overflow="hidden">
            <Box
              height="100%"
              hasRadius
              background="primary600"
              style={{ width: `${(count / max) * 100}%`, ...(row.color ? { background: row.color } : {}) }}
            />
          </Box>
        </Box>
      ))}
    </Flex>
  );
};
