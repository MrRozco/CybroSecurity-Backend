import * as React from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Flex, Typography } from '@strapi/design-system';
import { Pencil } from '@strapi/icons';

import { ColorDot } from '../components/cells';
import { EntryList } from '../components/EntryList';
import { SectionLayout, type NavSection } from '../components/SectionLayout';
import { articleColumns, relationQuickFilter, statusQuickFilter, taxonomyColumns, toOptions } from '../components/columns';
import { useCollection } from '../hooks/useCollection';
import { cmEditUrl, relationFilter } from '../utils/contentManager';
import { SECTION, UID } from '../constants';

const base = `/${SECTION.categories}`;

type Row = Record<string, any>;

const countOf = (value: unknown) =>
  Array.isArray(value) ? value.length : ((value as { count?: number } | null)?.count ?? 0);

const EditButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Button variant="secondary" startIcon={<Pencil />} onClick={onClick}>
    {label}
  </Button>
);

/** Articles that belong to the category (or tag) in the URL. */
const FilteredArticles = ({
  items,
  field,
  nameField,
  editUid,
  kind,
  authors,
}: {
  items: Row[];
  field: 'category' | 'tags';
  nameField: string;
  editUid: typeof UID.category | typeof UID.tag;
  kind: string;
  authors: Row[];
}) => {
  const { documentId = '' } = useParams();
  const navigate = useNavigate();
  const item = items.find((row) => row.documentId === documentId);
  const name = item?.[nameField] ?? kind;

  return (
    <EntryList
      key={documentId}
      uid={UID.article}
      title={field === 'tags' ? `#${name}` : name}
      columns={articleColumns}
      baseFilters={[relationFilter(field, documentId)]}
      quickFilters={[statusQuickFilter, relationQuickFilter('author', 'Any author', 'author', toOptions(authors, 'Name'))]}
      searchPlaceholder={`Search ${name} articles`}
      headerActions={<EditButton label={`Edit ${kind.toLowerCase()}`} onClick={() => navigate(cmEditUrl(editUid, documentId))} />}
    />
  );
};

const CategoriesPage = () => {
  const navigate = useNavigate();
  const categories = useCollection(UID.category, { pageSize: 100, sort: 'Name:ASC' });
  const tags = useCollection(UID.tag, { pageSize: 100, sort: 'Name:ASC' });
  const authors = useCollection(UID.author, { pageSize: 100, sort: 'Name:ASC' });

  const sections: NavSection[] = [
    {
      id: 'categories',
      label: 'Categories',
      isLoading: categories.isLoading,
      items: [
        { label: 'Manage categories', to: base, end: true },
        ...categories.results.map((category) => ({
          to: `${base}/category/${category.documentId}`,
          label: (
            <Flex gap={2} tag="span">
              <ColorDot color={category.color} />
              <Typography tag="span" ellipsis>
                {category.Name || 'Untitled'}
              </Typography>
            </Flex>
          ),
          endAction: <Badge>{countOf(category.blogs)}</Badge>,
        })),
      ],
    },
    {
      id: 'tags',
      label: 'Tags',
      isLoading: tags.isLoading,
      items: [
        { label: 'Manage tags', to: `${base}/tags`, end: true },
        ...tags.results.map((tag) => ({
          to: `${base}/tags/${tag.documentId}`,
          label: `#${tag.Name || 'untitled'}`,
          endAction: <Badge>{countOf(tag.blogs)}</Badge>,
        })),
      ],
    },
  ];

  return (
    <SectionLayout title="Categories" sections={sections}>
      <Routes>
        <Route
          index
          element={
            <EntryList
              uid={UID.category}
              title="Categories"
              subtitle="Click a category to see its articles, or use the pencil to edit it."
              columns={taxonomyColumns('Name', 'blogs', 'Articles', (row) => navigate(cmEditUrl(UID.category, row.documentId)))}
              defaultSort="Name:ASC"
              searchPlaceholder="Search categories"
              onRowClick={(row) => navigate(`${base}/category/${row.documentId}`)}
            />
          }
        />
        <Route
          path="category/:documentId"
          element={
            <FilteredArticles
              items={categories.results}
              field="category"
              nameField="Name"
              editUid={UID.category}
              kind="Category"
              authors={authors.results}
            />
          }
        />
        <Route
          path="tags"
          element={
            <EntryList
              uid={UID.tag}
              title="Tags"
              subtitle="Click a tag to see its articles, or use the pencil to edit it."
              columns={taxonomyColumns('Name', 'blogs', 'Articles', (row) => navigate(cmEditUrl(UID.tag, row.documentId)))}
              defaultSort="Name:ASC"
              searchPlaceholder="Search tags"
              onRowClick={(row) => navigate(`${base}/tags/${row.documentId}`)}
            />
          }
        />
        <Route
          path="tags/:documentId"
          element={
            <FilteredArticles
              items={tags.results}
              field="tags"
              nameField="Name"
              editUid={UID.tag}
              kind="Tag"
              authors={authors.results}
            />
          }
        />
      </Routes>
    </SectionLayout>
  );
};

export default CategoriesPage;
