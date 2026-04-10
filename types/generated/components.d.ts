import type { Schema, Struct } from '@strapi/strapi';

export interface StructureCategoryFeed extends Struct.ComponentSchema {
  collectionName: 'components_structure_category_feeds';
  info: {
    displayName: 'category feed';
  };
  attributes: {
    category: Schema.Attribute.Relation<'oneToOne', 'api::category.category'>;
    topBlogs: Schema.Attribute.Relation<'oneToMany', 'api::blog.blog'>;
    topTitle: Schema.Attribute.String;
  };
}

export interface StructureCrewHeader extends Struct.ComponentSchema {
  collectionName: 'components_structure_crew_headers';
  info: {
    displayName: 'crew header';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface StructureCrewMembers extends Struct.ComponentSchema {
  collectionName: 'components_structure_crew_members';
  info: {
    displayName: 'crew members';
  };
  attributes: {
    employee: Schema.Attribute.Component<'structure.employee', true>;
  };
}

export interface StructureEmployee extends Struct.ComponentSchema {
  collectionName: 'components_structure_employees';
  info: {
    displayName: 'employee';
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
    title: Schema.Attribute.String;
  };
}

export interface StructureFooter extends Struct.ComponentSchema {
  collectionName: 'components_structure_footers';
  info: {
    displayName: 'footer';
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
    displayName: 'hamburgerLinks';
  };
  attributes: {
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface StructureLink extends Struct.ComponentSchema {
  collectionName: 'components_structure_links';
  info: {
    displayName: 'link';
  };
  attributes: {
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface StructureMainHeader extends Struct.ComponentSchema {
  collectionName: 'components_structure_main_headers';
  info: {
    displayName: 'main header';
  };
  attributes: {
    blogs: Schema.Attribute.Relation<'oneToMany', 'api::blog.blog'>;
  };
}

export interface StructureNavbar extends Struct.ComponentSchema {
  collectionName: 'components_structure_navbars';
  info: {
    displayName: 'navbar';
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
    displayName: 'Social Media Section';
  };
  attributes: {
    embed: Schema.Attribute.JSON &
      Schema.Attribute.CustomField<'plugin::oembed.oembed'>;
    summary: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface StructureSocialMedias extends Struct.ComponentSchema {
  collectionName: 'components_structure_social_medias';
  info: {
    displayName: 'social medias';
  };
  attributes: {
    mediaLink: Schema.Attribute.String;
    mediaLogo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'structure.category-feed': StructureCategoryFeed;
      'structure.crew-header': StructureCrewHeader;
      'structure.crew-members': StructureCrewMembers;
      'structure.employee': StructureEmployee;
      'structure.footer': StructureFooter;
      'structure.hamburger-links': StructureHamburgerLinks;
      'structure.link': StructureLink;
      'structure.main-header': StructureMainHeader;
      'structure.navbar': StructureNavbar;
      'structure.social-media-section': StructureSocialMediaSection;
      'structure.social-medias': StructureSocialMedias;
    }
  }
}
