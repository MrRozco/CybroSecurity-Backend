import type { Schema, Struct } from '@strapi/strapi';

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'How this page appears in Google and when shared on social media.';
    displayName: 'SEO Metadata';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
    preventIndexing: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface StructureCategoryFeed extends Struct.ComponentSchema {
  collectionName: 'components_structure_category_feeds';
  info: {
    description: 'Latest articles from one category, plus an optional sidebar of hand-picked articles.';
    displayName: 'Category Feed';
    icon: 'bulletList';
  };
  attributes: {
    category: Schema.Attribute.Relation<'oneToOne', 'api::category.category'>;
    color: Schema.Attribute.String;
    topBlogs: Schema.Attribute.Relation<'oneToMany', 'api::blog.blog'>;
    topTitle: Schema.Attribute.String;
  };
}

export interface StructureCrewHeader extends Struct.ComponentSchema {
  collectionName: 'components_structure_crew_headers';
  info: {
    description: 'Title and intro text at the top of the Crew page.';
    displayName: 'Crew Header';
    icon: 'layout';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface StructureCrewMembers extends Struct.ComponentSchema {
  collectionName: 'components_structure_crew_members';
  info: {
    description: 'The list of team members shown on the Crew page.';
    displayName: 'Crew Members';
    icon: 'user';
  };
  attributes: {
    employee: Schema.Attribute.Component<'structure.employee', true>;
  };
}

export interface StructureEmployee extends Struct.ComponentSchema {
  collectionName: 'components_structure_employees';
  info: {
    description: 'One person on the team: photo, name, job title, bio and social links.';
    displayName: 'Team Member';
    icon: 'user';
  };
  attributes: {
    bio: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    name: Schema.Attribute.String;
    profile: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    socials: Schema.Attribute.Component<'structure.social-medias', true>;
    title: Schema.Attribute.String;
  };
}

export interface StructureExcerptSection extends Struct.ComponentSchema {
  collectionName: 'components_structure_excerpt_sections';
  info: {
    description: 'Highlights an external link with a title, short summary and author.';
    displayName: 'Excerpt Section';
    icon: 'quote';
  };
  attributes: {
    author: Schema.Attribute.Relation<'oneToOne', 'api::author.author'>;
    summary: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface StructureFooter extends Struct.ComponentSchema {
  collectionName: 'components_structure_footers';
  info: {
    description: 'Site footer: logo, links and social media icons.';
    displayName: 'Footer';
    icon: 'layout';
  };
  attributes: {
    links: Schema.Attribute.Component<'structure.link', true>;
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    socialMedias: Schema.Attribute.Component<'structure.social-medias', true>;
  };
}

export interface StructureHamburgerLinks extends Struct.ComponentSchema {
  collectionName: 'components_structure_hamburger_links';
  info: {
    description: 'A link shown in the mobile (hamburger) menu.';
    displayName: 'Mobile Nav Link';
    icon: 'link';
  };
  attributes: {
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface StructureJobPostings extends Struct.ComponentSchema {
  collectionName: 'components_structure_job_postings';
  info: {
    description: 'A heading, intro text and a hand-picked list of job postings.';
    displayName: 'Job Listings Section';
    icon: 'briefcase';
  };
  attributes: {
    description: Schema.Attribute.Text;
    job_postings: Schema.Attribute.Relation<
      'oneToMany',
      'api::job-posting.job-posting'
    >;
    Title: Schema.Attribute.String;
  };
}

export interface StructureLink extends Struct.ComponentSchema {
  collectionName: 'components_structure_links';
  info: {
    description: 'A text link to a page or URL.';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface StructureMainHeader extends Struct.ComponentSchema {
  collectionName: 'components_structure_main_headers';
  info: {
    description: 'Top of the homepage: one big main article, with supporting articles listed beside it.';
    displayName: 'Main Header';
    icon: 'star';
  };
  attributes: {
    blogs: Schema.Attribute.Relation<'oneToMany', 'api::blog.blog'>;
    mainArticle: Schema.Attribute.Relation<'oneToOne', 'api::blog.blog'>;
    sideArticles: Schema.Attribute.Relation<'oneToMany', 'api::blog.blog'>;
    sideTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Top Stories'>;
  };
}

export interface StructureNavbar extends Struct.ComponentSchema {
  collectionName: 'components_structure_navbars';
  info: {
    description: 'Site header: logo, main links and the mobile menu links.';
    displayName: 'Navigation Bar';
    icon: 'grid';
  };
  attributes: {
    hamburgerLinks: Schema.Attribute.Component<
      'structure.hamburger-links',
      true
    >;
    links: Schema.Attribute.Component<'structure.link', true>;
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface StructureSocialMediaSection extends Struct.ComponentSchema {
  collectionName: 'components_structure_social_media_sections';
  info: {
    description: 'Embeds a social post (e.g. LinkedIn) with a title, summary and author.';
    displayName: 'Social Media Section';
    icon: 'cast';
  };
  attributes: {
    author: Schema.Attribute.Relation<'oneToOne', 'api::author.author'>;
    embed: Schema.Attribute.JSON &
      Schema.Attribute.CustomField<'plugin::oembed.oembed'>;
    summary: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface StructureSocialMedias extends Struct.ComponentSchema {
  collectionName: 'components_structure_social_medias';
  info: {
    description: 'An icon linking to a social media profile.';
    displayName: 'Social Media Link';
    icon: 'globe';
  };
  attributes: {
    mediaLink: Schema.Attribute.String;
    mediaLogo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.seo': SharedSeo;
      'structure.category-feed': StructureCategoryFeed;
      'structure.crew-header': StructureCrewHeader;
      'structure.crew-members': StructureCrewMembers;
      'structure.employee': StructureEmployee;
      'structure.excerpt-section': StructureExcerptSection;
      'structure.footer': StructureFooter;
      'structure.hamburger-links': StructureHamburgerLinks;
      'structure.job-postings': StructureJobPostings;
      'structure.link': StructureLink;
      'structure.main-header': StructureMainHeader;
      'structure.navbar': StructureNavbar;
      'structure.social-media-section': StructureSocialMediaSection;
      'structure.social-medias': StructureSocialMedias;
    }
  }
}
