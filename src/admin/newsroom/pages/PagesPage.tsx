import * as React from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Layouts } from '@strapi/strapi/admin';
import { Box, Button, Flex, Grid, LinkButton, Loader, Typography } from '@strapi/design-system';
import * as Icons from '@strapi/icons';
import { ExternalLink, Pencil, WarningCircle } from '@strapi/icons';

import { DateCell, StatusCell } from '../components/cells';
import { SectionLayout, type NavSection } from '../components/SectionLayout';
import { useComponentInfo, useSingleType } from '../hooks/useSingleType';
import { cmSingleTypeUrl } from '../utils/contentManager';
import { SECTION, SINGLE_UID, SITE_URL } from '../constants';
import { PAGES, findPage, type PageDefinition } from './pagesConfig';

const base = `/${SECTION.pages}`;

/** Content-Type Builder icon names whose Strapi icon export has a different name. */
const ICON_ALIASES: Record<string, string> = { quote: 'Quotes', grid: 'GridFour' };

/** Renders a Content-Type Builder icon name (e.g. "bulletList") with the matching Strapi icon. */
const BlockIcon = ({ name }: { name?: string }) => {
  const key = name ? (ICON_ALIASES[name] ?? name.charAt(0).toUpperCase() + name.slice(1)) : '';
  const Icon = (Icons as Record<string, React.ComponentType<any>>)[key] ?? Icons.PuzzlePiece;

  return (
    <Flex
      width="3.2rem"
      height="3.2rem"
      shrink={0}
      justifyContent="center"
      hasRadius
      background="primary100"
      color="primary600"
    >
      <Icon width="1.6rem" height="1.6rem" fill="primary600" />
    </Flex>
  );
};

const siteLink = (page: PageDefinition) => `${SITE_URL}${page.path}`;

/* -------------------------------------------------------------------------------------------------
 * Overview — one card per page
 * -----------------------------------------------------------------------------------------------*/

const PageCard = ({ page }: { page: PageDefinition }) => {
  const navigate = useNavigate();
  const { data, isLoading } = useSingleType(page.uid);
  const components = useComponentInfo();
  const sections = data ? page.outline(data, components) : [];

  return (
    <Flex
      direction="column"
      alignItems="stretch"
      gap={4}
      padding={6}
      hasRadius
      background="neutral0"
      shadow="tableShadow"
      height="100%"
    >
      <Flex justifyContent="space-between" alignItems="flex-start" gap={2}>
        <Box>
          <Typography variant="delta" tag="h2" textColor="neutral800">
            {page.label}
          </Typography>
          <Typography variant="pi" textColor="neutral600">
            {page.path}
          </Typography>
        </Box>
        {data && <StatusCell status={data.status as any} />}
      </Flex>
      <Typography textColor="neutral600">{page.description}</Typography>
      {isLoading ? (
        <Loader small>Loading…</Loader>
      ) : (
        <Typography variant="pi" textColor="neutral600">
          {data ? (
            <>
              {sections.length} {sections.length === 1 ? 'section' : 'sections'} · last edited{' '}
              <DateCell value={data.updatedAt} />
            </>
          ) : (
            'Not created yet'
          )}
        </Typography>
      )}
      <Flex gap={2} marginTop="auto">
        <Button onClick={() => navigate(`${base}/${page.id}`)} variant="secondary">
          View outline
        </Button>
        <Button startIcon={<Pencil />} onClick={() => navigate(cmSingleTypeUrl(page.uid))}>
          Edit page
        </Button>
      </Flex>
    </Flex>
  );
};

const PagesOverview = () => (
  <>
    <Layouts.Header title="Pages" subtitle="Every page on the website that is built in the CMS." />
    <Layouts.Content>
      <Grid.Root gap={4}>
        {PAGES.map((page) => (
          <Grid.Item key={page.id} col={4} s={12} alignItems="stretch">
            <PageCard page={page} />
          </Grid.Item>
        ))}
      </Grid.Root>
    </Layouts.Content>
  </>
);

/* -------------------------------------------------------------------------------------------------
 * Detail — ordered outline of a page's sections
 * -----------------------------------------------------------------------------------------------*/

const PageOutline = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const page = findPage(pageId);
  const { data, isLoading, error } = useSingleType(page?.uid ?? SINGLE_UID.homepage);
  const components = useComponentInfo();

  if (!page) return <Navigate to={base} replace />;

  const sections = data ? page.outline(data, components) : [];
  const seoTitle = data?.seo?.metaTitle;

  return (
    <>
      <Layouts.Header
        title={page.label}
        subtitle={page.description}
        primaryAction={
          <Button startIcon={<Pencil />} onClick={() => navigate(cmSingleTypeUrl(page.uid))}>
            Edit page
          </Button>
        }
        secondaryAction={
          <LinkButton href={siteLink(page)} isExternal variant="tertiary" startIcon={<ExternalLink />}>
            View on site
          </LinkButton>
        }
      />
      <Layouts.Content>
        {isLoading ? (
          <Flex justifyContent="center" padding={8}>
            <Loader>Loading page…</Loader>
          </Flex>
        ) : error ? (
          <Typography textColor="danger600">Could not load this page. You may not have permission to read it.</Typography>
        ) : (
          <Flex direction="column" alignItems="stretch" gap={6}>
            <Flex gap={6} wrap="wrap">
              <Box>
                <Typography variant="sigma" textColor="neutral600">
                  Status
                </Typography>
                <Box paddingTop={1}>{data ? <StatusCell status={data.status as any} /> : '—'}</Box>
              </Box>
              <Box>
                <Typography variant="sigma" textColor="neutral600">
                  Last edited
                </Typography>
                <Box paddingTop={1}>
                  <DateCell value={data?.updatedAt} />
                </Box>
              </Box>
              {'seo' in (data ?? {}) || page.id === 'home' ? (
                <Box>
                  <Typography variant="sigma" textColor="neutral600">
                    Search title
                  </Typography>
                  <Flex paddingTop={1} gap={1}>
                    {!seoTitle && <WarningCircle fill="warning600" />}
                    <Typography textColor={seoTitle ? 'neutral800' : 'warning600'}>
                      {seoTitle ?? 'Not set — Google will guess one'}
                    </Typography>
                  </Flex>
                </Box>
              ) : null}
            </Flex>

            <Box>
              <Typography variant="delta" tag="h2" textColor="neutral800">
                Sections, top to bottom
              </Typography>
              <Box paddingTop={1} paddingBottom={4}>
                <Typography variant="pi" textColor="neutral600">
                  This is the order visitors see. To add, remove or reorder sections, click “Edit page” — drag a
                  section by its handle to move it.
                </Typography>
              </Box>
              {sections.length === 0 ? (
                <Box padding={6} hasRadius background="neutral0" shadow="tableShadow">
                  <Typography textColor="neutral600">This page has no sections yet.</Typography>
                </Box>
              ) : (
                <Flex direction="column" alignItems="stretch" gap={2} tag="ol">
                  {sections.map((section, index) => (
                    <Flex
                      key={section.key}
                      tag="li"
                      gap={4}
                      padding={4}
                      hasRadius
                      background="neutral0"
                      shadow="tableShadow"
                    >
                      <Typography variant="sigma" textColor="neutral500" style={{ width: '2rem' }}>
                        {index + 1}
                      </Typography>
                      <BlockIcon name={section.icon} />
                      <Box minWidth={0}>
                        <Typography fontWeight="bold" textColor="neutral800" tag="p">
                          {section.title}
                        </Typography>
                        <Typography variant="pi" textColor="neutral600" ellipsis>
                          {section.summary.join(' · ') || 'Empty section'}
                        </Typography>
                      </Box>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Box>
          </Flex>
        )}
      </Layouts.Content>
    </>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Section shell
 * -----------------------------------------------------------------------------------------------*/

const PagesPage = () => {
  const sections: NavSection[] = [
    {
      id: 'pages',
      label: 'Pages',
      items: [
        { label: 'All pages', to: base, end: true },
        ...PAGES.map((page) => ({ label: page.label, to: `${base}/${page.id}` })),
      ],
    },
    {
      id: 'site',
      label: 'Site-wide',
      items: [{ label: 'Global Settings', to: cmSingleTypeUrl(SINGLE_UID.global) }],
    },
  ];

  return (
    <SectionLayout title="Pages" sections={sections}>
      <Routes>
        <Route index element={<PagesOverview />} />
        <Route path=":pageId" element={<PageOutline />} />
      </Routes>
    </SectionLayout>
  );
};

export default PagesPage;
