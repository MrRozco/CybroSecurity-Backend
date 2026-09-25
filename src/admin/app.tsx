import type { StrapiApp } from '@strapi/strapi/admin';
import { Briefcase, ChartPie, Clock, Earth, File, Folder, Layout, Pencil, Shield } from '@strapi/icons';

import logo from './extensions/cybro-logo.png';
import { theme } from './theme';
import { SECTION, SINGLE_UID, UID, readPermission } from './newsroom/constants';

export default {
  config: {
    locales: [],
    theme,
    auth: { logo },
    menu: { logo },
    tutorials: false,
    notifications: { releases: false },
  },

  register(app: StrapiApp) {
    /* ---------------------------------------------------------------------------------------------
     * Main navigation — newsroom sections
     * -------------------------------------------------------------------------------------------*/

    app.addMenuLink({
      to: SECTION.articles,
      icon: File,
      intlLabel: { id: 'newsroom.menu.articles', defaultMessage: 'Articles' },
      permissions: [readPermission(UID.article)],
      position: 0.1,
      Component: () => import('./newsroom/pages/ArticlesPage'),
    });

    app.addMenuLink({
      to: SECTION.categories,
      icon: Folder,
      intlLabel: { id: 'newsroom.menu.categories', defaultMessage: 'Categories' },
      permissions: [readPermission(UID.category), readPermission(UID.tag)],
      position: 0.2,
      Component: () => import('./newsroom/pages/CategoriesPage'),
    });

    app.addMenuLink({
      to: SECTION.jobs,
      icon: Briefcase,
      intlLabel: { id: 'newsroom.menu.jobs', defaultMessage: 'Job Postings' },
      permissions: [readPermission(UID.jobPosting)],
      position: 0.3,
      Component: () => import('./newsroom/pages/JobsPage'),
    });

    app.addMenuLink({
      to: SECTION.pages,
      icon: Layout,
      intlLabel: { id: 'newsroom.menu.pages', defaultMessage: 'Pages' },
      permissions: [
        readPermission(SINGLE_UID.homepage),
        readPermission(SINGLE_UID.crew),
        readPermission(SINGLE_UID.gigs),
      ],
      position: 0.4,
      Component: () => import('./newsroom/pages/PagesPage'),
    });

    // Opens the Global Settings single type directly in the editor.
    app.addMenuLink({
      to: `content-manager/single-types/${SINGLE_UID.global}`,
      icon: Earth,
      intlLabel: { id: 'newsroom.menu.global', defaultMessage: 'Global Settings' },
      permissions: [readPermission(SINGLE_UID.global)],
      position: 0.5,
    });

    app.addMenuLink({
      to: SECTION.admin,
      icon: Shield,
      intlLabel: { id: 'newsroom.menu.admin', defaultMessage: 'Admin' },
      permissions: [readPermission(UID.author), readPermission(UID.user)],
      position: 1.5,
      Component: () => import('./newsroom/pages/AdminPage'),
    });

    /* ---------------------------------------------------------------------------------------------
     * Home page widgets
     * -------------------------------------------------------------------------------------------*/

    app.widgets.register([
      {
        id: 'newsroom-overview',
        icon: ChartPie,
        title: { id: 'newsroom.widget.overview', defaultMessage: 'Newsroom at a glance' },
        component: () => import('./newsroom/widgets').then((mod) => mod.OverviewWidget),
        permissions: [readPermission(UID.article)],
      },
      {
        id: 'newsroom-recent-drafts',
        icon: Pencil,
        title: { id: 'newsroom.widget.drafts', defaultMessage: 'Recent drafts' },
        link: {
          label: { id: 'newsroom.widget.drafts.link', defaultMessage: 'All drafts' },
          href: `/${SECTION.articles}/drafts`,
        },
        component: () => import('./newsroom/widgets').then((mod) => mod.RecentDraftsWidget),
        permissions: [readPermission(UID.article)],
      },
      {
        id: 'newsroom-categories',
        icon: Folder,
        title: { id: 'newsroom.widget.categories', defaultMessage: 'Articles per category' },
        link: {
          label: { id: 'newsroom.widget.categories.link', defaultMessage: 'Manage categories' },
          href: `/${SECTION.categories}`,
        },
        component: () => import('./newsroom/widgets').then((mod) => mod.CategoriesWidget),
        permissions: [readPermission(UID.category)],
      },
      {
        id: 'newsroom-latest-jobs',
        icon: Clock,
        title: { id: 'newsroom.widget.jobs', defaultMessage: 'Latest job postings' },
        link: {
          label: { id: 'newsroom.widget.jobs.link', defaultMessage: 'All job postings' },
          href: `/${SECTION.jobs}`,
        },
        component: () => import('./newsroom/widgets').then((mod) => mod.LatestJobsWidget),
        permissions: [readPermission(UID.jobPosting)],
      },
    ]);
  },

  bootstrap() {},
};
