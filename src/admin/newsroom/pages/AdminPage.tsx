import * as React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Avatar, Flex, IconButton, Typography } from '@strapi/design-system';
import { Feather } from '@strapi/icons';

import { CountCell, StatusCell } from '../components/cells';
import { EntryList, type Column } from '../components/EntryList';
import { SectionLayout, type NavSection } from '../components/SectionLayout';
import { SECTION, UID } from '../constants';

const base = `/${SECTION.admin}`;

type Row = Record<string, any>;

const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

const YesNo = ({ value, yes, no, danger }: { value?: boolean; yes: string; no: string; danger?: boolean }) => (
  <Typography textColor={value ? (danger ? 'danger600' : 'success600') : 'neutral600'}>{value ? yes : no}</Typography>
);

const AdminPage = () => {
  const navigate = useNavigate();

  const authorColumns: Column<Row>[] = [
    {
      name: 'Name',
      label: 'Name',
      sortable: true,
      render: (row) => (
        <Flex gap={3}>
          {row.Avatar?.url ? (
            <Avatar.Item src={row.Avatar.url} alt="" fallback={initials(row.Name)} />
          ) : (
            <Avatar.Item fallback={initials(row.Name)} />
          )}
          <Typography textColor="neutral800" fontWeight="semiBold">
            {row.Name || 'Unnamed'}
          </Typography>
        </Flex>
      ),
    },
    { name: 'Email', label: 'Email', sortable: true },
    { name: 'blogs', label: 'Articles', render: (row) => <CountCell value={row.blogs} /> },
    { name: 'status', label: 'Status', render: (row) => <StatusCell status={row.status} /> },
    {
      name: 'actions',
      label: 'View',
      render: (row) => (
        <IconButton
          label={`View articles by ${row.Name ?? 'this author'}`}
          variant="ghost"
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            navigate(`/${SECTION.articles}?author=${row.documentId}`);
          }}
        >
          <Feather />
        </IconButton>
      ),
    },
  ];

  const userColumns: Column<Row>[] = [
    { name: 'username', label: 'Username', sortable: true },
    { name: 'email', label: 'Email', sortable: true },
    { name: 'role', label: 'Role', render: (row) => <Typography textColor="neutral800">{row.role?.name ?? '—'}</Typography> },
    { name: 'confirmed', label: 'Confirmed', render: (row) => <YesNo value={row.confirmed} yes="Confirmed" no="Pending" /> },
    { name: 'blocked', label: 'Access', render: (row) => <YesNo value={row.blocked} yes="Blocked" no="Active" danger /> },
  ];

  const sections: NavSection[] = [
    {
      id: 'people',
      label: 'People',
      items: [
        { label: 'Authors', to: base, end: true },
        { label: 'Users', to: `${base}/users` },
      ],
    },
    {
      id: 'access',
      label: 'Access',
      items: [
        { label: 'Admin panel accounts', to: '/settings/users' },
        { label: 'User roles & permissions', to: '/settings/users-permissions/roles' },
      ],
    },
  ];

  return (
    <SectionLayout title="Admin" sections={sections}>
      <Routes>
        <Route
          index
          element={
            <EntryList
              key="authors"
              uid={UID.author}
              title="Authors"
              columns={authorColumns}
              defaultSort="Name:ASC"
              searchPlaceholder="Search authors"
            />
          }
        />
        <Route
          path="users"
          element={
            <EntryList
              key="users"
              uid={UID.user}
              title="Users"
              subtitle="Website accounts (not admin panel accounts)."
              columns={userColumns}
              defaultSort="createdAt:DESC"
              searchPlaceholder="Search users"
            />
          }
        />
      </Routes>
    </SectionLayout>
  );
};

export default AdminPage;
