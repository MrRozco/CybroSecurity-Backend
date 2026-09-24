import * as React from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Badge, Button } from '@strapi/design-system';
import { Pencil } from '@strapi/icons';

import { EntryList } from '../components/EntryList';
import { SectionLayout, type NavSection } from '../components/SectionLayout';
import { jobPostingColumns, relationQuickFilter, statusQuickFilter, taxonomyColumns, toOptions } from '../components/columns';
import { useCollection } from '../hooks/useCollection';
import { cmEditUrl, relationFilter, statusFilter } from '../utils/contentManager';
import { SECTION, UID } from '../constants';

const base = `/${SECTION.jobs}`;

type Row = Record<string, any>;

const countOf = (value: unknown) =>
  Array.isArray(value) ? value.length : ((value as { count?: number } | null)?.count ?? 0);

/** Postings for the job category / job level in the URL. */
const FilteredPostings = ({
  items,
  field,
  nameField,
  editUid,
  kind,
  otherFilter,
}: {
  items: Row[];
  field: 'job_category' | 'job_level';
  nameField: string;
  editUid: typeof UID.jobCategory | typeof UID.jobLevel;
  kind: string;
  otherFilter: ReturnType<typeof relationQuickFilter>;
}) => {
  const { documentId = '' } = useParams();
  const navigate = useNavigate();
  const name = items.find((row) => row.documentId === documentId)?.[nameField] ?? kind;

  return (
    <EntryList
      key={documentId}
      uid={UID.jobPosting}
      title={name}
      columns={jobPostingColumns}
      baseFilters={[relationFilter(field, documentId)]}
      quickFilters={[statusQuickFilter, otherFilter]}
      defaultSort="posted:DESC"
      searchPlaceholder={`Search ${name} postings`}
      headerActions={
        <Button variant="secondary" startIcon={<Pencil />} onClick={() => navigate(cmEditUrl(editUid, documentId))}>
          Edit {kind.toLowerCase()}
        </Button>
      }
    />
  );
};

const JobsPage = () => {
  const navigate = useNavigate();
  const jobCategories = useCollection(UID.jobCategory, { pageSize: 100, sort: 'name:ASC' });
  const jobLevels = useCollection(UID.jobLevel, { pageSize: 100, sort: 'level:ASC' });

  const categoryFilter = relationQuickFilter('jobCategory', 'Any job category', 'job_category', toOptions(jobCategories.results, 'name'));
  const levelFilter = relationQuickFilter('jobLevel', 'Any job level', 'job_level', toOptions(jobLevels.results, 'level'));

  const sections: NavSection[] = [
    {
      id: 'postings',
      label: 'Job postings',
      items: [
        { label: 'All postings', to: base, end: true },
        { label: 'Drafts', to: `${base}/drafts` },
        { label: 'Published', to: `${base}/published` },
      ],
    },
    {
      id: 'job-categories',
      label: 'Job categories',
      isLoading: jobCategories.isLoading,
      items: [
        { label: 'Manage job categories', to: `${base}/categories`, end: true },
        ...jobCategories.results.map((row) => ({
          to: `${base}/categories/${row.documentId}`,
          label: row.name || 'Untitled',
          endAction: <Badge>{countOf(row.job_postings)}</Badge>,
        })),
      ],
    },
    {
      id: 'job-levels',
      label: 'Job levels',
      isLoading: jobLevels.isLoading,
      items: [
        { label: 'Manage job levels', to: `${base}/levels`, end: true },
        ...jobLevels.results.map((row) => ({
          to: `${base}/levels/${row.documentId}`,
          label: row.level || 'Untitled',
          endAction: <Badge>{countOf(row.job_postings)}</Badge>,
        })),
      ],
    },
  ];

  const postingsList = (key: string, title: string, filters = [] as ReturnType<typeof statusFilter>[], withStatus = true) => (
    <EntryList
      key={key}
      uid={UID.jobPosting}
      title={title}
      columns={jobPostingColumns}
      baseFilters={filters}
      quickFilters={[...(withStatus ? [statusQuickFilter] : []), categoryFilter, levelFilter]}
      defaultSort="posted:DESC"
      searchPlaceholder="Search job postings"
    />
  );

  return (
    <SectionLayout title="Job postings" sections={sections}>
      <Routes>
        <Route index element={postingsList('all', 'All job postings')} />
        <Route path="drafts" element={postingsList('drafts', 'Draft job postings', [statusFilter('draft')], false)} />
        <Route path="published" element={postingsList('published', 'Published job postings', [statusFilter('published')], false)} />
        <Route
          path="categories"
          element={
            <EntryList
              uid={UID.jobCategory}
              title="Job categories"
              subtitle="Click a job category to see its postings, or use the pencil to edit it."
              columns={taxonomyColumns('name', 'job_postings', 'Postings', (row) => navigate(cmEditUrl(UID.jobCategory, row.documentId)))}
              defaultSort="name:ASC"
              searchPlaceholder="Search job categories"
              onRowClick={(row) => navigate(`${base}/categories/${row.documentId}`)}
            />
          }
        />
        <Route
          path="categories/:documentId"
          element={
            <FilteredPostings
              items={jobCategories.results}
              field="job_category"
              nameField="name"
              editUid={UID.jobCategory}
              kind="Job category"
              otherFilter={levelFilter}
            />
          }
        />
        <Route
          path="levels"
          element={
            <EntryList
              uid={UID.jobLevel}
              title="Job levels"
              subtitle="Click a job level to see its postings, or use the pencil to edit it."
              columns={taxonomyColumns('level', 'job_postings', 'Postings', (row) => navigate(cmEditUrl(UID.jobLevel, row.documentId)))}
              defaultSort="level:ASC"
              searchPlaceholder="Search job levels"
              onRowClick={(row) => navigate(`${base}/levels/${row.documentId}`)}
            />
          }
        />
        <Route
          path="levels/:documentId"
          element={
            <FilteredPostings
              items={jobLevels.results}
              field="job_level"
              nameField="level"
              editUid={UID.jobLevel}
              kind="Job level"
              otherFilter={categoryFilter}
            />
          }
        />
      </Routes>
    </SectionLayout>
  );
};

export default JobsPage;
