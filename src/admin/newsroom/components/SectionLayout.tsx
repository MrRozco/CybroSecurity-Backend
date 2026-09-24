import * as React from 'react';
import { Layouts, Page, SubNav } from '@strapi/strapi/admin';
import { Divider, Flex, Loader, Typography } from '@strapi/design-system';

export interface NavItem {
  label: React.ReactNode;
  to: string;
  /** Only match the exact path (use for index links). */
  end?: boolean;
  endAction?: React.ReactNode;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
  isLoading?: boolean;
  emptyLabel?: string;
}

interface SectionLayoutProps {
  title: string;
  sections: NavSection[];
  children: React.ReactNode;
}

export const SectionLayout = ({ title, sections, children }: SectionLayoutProps) => (
  <Layouts.Root
    sideNav={
      <SubNav.Main aria-label={title}>
        <SubNav.Header label={title} />
        <Divider />
        <SubNav.Content>
          <SubNav.Sections>
            {sections.map((section) => (
              <SubNav.Section key={section.id} label={section.label}>
                {section.isLoading
                  ? [
                      <Flex key="loading" justifyContent="center" padding={2}>
                        <Loader small>Loading…</Loader>
                      </Flex>,
                    ]
                  : section.items.length === 0
                    ? [
                        <Typography key="empty" variant="pi" textColor="neutral500" paddingLeft={5}>
                          {section.emptyLabel ?? 'Nothing here yet'}
                        </Typography>,
                      ]
                    : section.items.map((item) => (
                        <SubNav.Link
                          key={item.to}
                          to={item.to}
                          end={item.end}
                          label={item.label}
                          endAction={item.endAction}
                        />
                      ))}
              </SubNav.Section>
            ))}
          </SubNav.Sections>
        </SubNav.Content>
      </SubNav.Main>
    }
  >
    <Page.Title>{title}</Page.Title>
    {children}
  </Layouts.Root>
);
