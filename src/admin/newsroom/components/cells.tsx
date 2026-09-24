import * as React from 'react';
import { Box, Flex, Status, Typography } from '@strapi/design-system';
import { Star } from '@strapi/icons';

type DocumentStatus = 'draft' | 'published' | 'modified';

const STATUS_STYLE: Record<DocumentStatus, { label: string; variant: 'secondary' | 'success' | 'alternative' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  published: { label: 'Published', variant: 'success' },
  modified: { label: 'Modified', variant: 'alternative' },
};

export const StatusCell = ({ status }: { status?: DocumentStatus }) => {
  const style = STATUS_STYLE[status ?? 'draft'] ?? STATUS_STYLE.draft;

  return (
    <Status variant={style.variant} size="XS" width="min-content">
      <Typography tag="span" variant="omega" fontWeight="bold">
        {style.label}
      </Typography>
    </Status>
  );
};

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

export const DateCell = ({ value }: { value?: string | null }) => (
  <Typography textColor="neutral800">{value ? dateFormatter.format(new Date(value)) : '—'}</Typography>
);

/** Renders the display field of a populated to-one relation. */
export const RelationCell = ({ value, field }: { value?: Record<string, any> | null; field: string }) => (
  <Typography textColor={value ? 'neutral800' : 'neutral500'} ellipsis>
    {value?.[field] ?? '—'}
  </Typography>
);

export const ColorDot = ({ color }: { color?: string | null }) => (
  <Box
    width="1rem"
    height="1rem"
    shrink={0}
    borderRadius="50%"
    background="neutral300"
    style={color ? { background: color } : undefined}
  />
);

export const TitleCell = ({ title, featured }: { title?: string; featured?: boolean }) => (
  <Flex gap={2}>
    {featured && <Star fill="primary600" aria-label="Featured" />}
    <Typography textColor="neutral800" fontWeight="semiBold" ellipsis>
      {title || 'Untitled'}
    </Typography>
  </Flex>
);

/** Count shown for to-many relations (the CM list API returns `{ count }`). */
export const CountCell = ({ value }: { value?: { count?: number } | unknown[] | null }) => {
  const count = Array.isArray(value) ? value.length : (value as { count?: number } | null)?.count ?? 0;
  return <Typography textColor="neutral800">{count}</Typography>;
};
