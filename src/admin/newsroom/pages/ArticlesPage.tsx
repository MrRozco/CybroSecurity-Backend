import * as React from 'react';
import { Route, Routes } from 'react-router-dom';

import { EntryList } from '../components/EntryList';
import { SectionLayout, type NavSection } from '../components/SectionLayout';
import { articleColumns, relationQuickFilter, statusQuickFilter, toOptions } from '../components/columns';
import { useCollection } from '../hooks/useCollection';
import { fieldFilter, statusFilter, type FilterClause } from '../utils/contentManager';
import { SECTION, UID } from '../constants';

const base = `/${SECTION.articles}`;

interface ArticleView {
  path: string;
  label: string;
  title: string;
  filters: FilterClause[];
  showStatusFilter: boolean;
}

const VIEWS: ArticleView[] = [
  { path: '', label: 'All articles', title: 'All articles', filters: [], showStatusFilter: true },
  { path: 'drafts', label: 'Drafts', title: 'Drafts', filters: [statusFilter('draft')], showStatusFilter: false },
  { path: 'published', label: 'Published', title: 'Published', filters: [statusFilter('published')], showStatusFilter: false },
  {
    path: 'pending-changes',
    label: 'Unpublished changes',
    title: 'Published with unpublished changes',
    filters: [statusFilter('published-modified')],
    showStatusFilter: false,
  },
  { path: 'featured', label: 'Featured', title: 'Featured articles', filters: [fieldFilter('isFeatured', true)], showStatusFilter: true },
];

const ArticlesPage = () => {
  const categories = useCollection(UID.category, { pageSize: 100, sort: 'Name:ASC' });
  const authors = useCollection(UID.author, { pageSize: 100, sort: 'Name:ASC' });

  const quickFilters = (showStatus: boolean) => [
    ...(showStatus ? [statusQuickFilter] : []),
    relationQuickFilter('category', 'Any category', 'category', toOptions(categories.results, 'Name')),
    relationQuickFilter('author', 'Any author', 'author', toOptions(authors.results, 'Name')),
  ];

  const toItem = (view: ArticleView) => ({
    label: view.label,
    to: view.path ? `${base}/${view.path}` : base,
    end: !view.path,
  });

  const sections: NavSection[] = [
    { id: 'articles', label: 'Articles', items: [toItem(VIEWS[0])] },
    { id: 'status', label: 'By status', items: VIEWS.slice(1, 4).map(toItem) },
    { id: 'highlights', label: 'Highlights', items: [toItem(VIEWS[4])] },
  ];

  return (
    <SectionLayout title="Articles" sections={sections}>
      <Routes>
        {VIEWS.map((view) => (
          <Route
            key={view.path || 'index'}
            {...(view.path ? { path: view.path } : { index: true })}
            element={
              <EntryList
                key={view.path}
                uid={UID.article}
                title={view.title}
                columns={articleColumns}
                baseFilters={view.filters}
                quickFilters={quickFilters(view.showStatusFilter)}
                defaultSort="updatedAt:DESC"
                searchPlaceholder="Search articles"
              />
            }
          />
        ))}
      </Routes>
    </SectionLayout>
  );
};

export default ArticlesPage;
