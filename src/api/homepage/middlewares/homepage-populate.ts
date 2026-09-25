import type { Core } from '@strapi/strapi';

/** Everything an article card in the Main Header needs. */
const headerArticle = {
  fields: ['Title', 'Slug', 'Excerpt'],
  populate: {
    FeaturedImage: { fields: ['url', 'alternativeText', 'formats'] },
    author: { fields: ['Name'] },
    category: { fields: ['Name', 'Slug'] },
  },
};

const populate = {
  seo: {
    populate: {
      ogImage: { fields: ['url', 'alternativeText'] },
    },
  },
  content: {
    on: {
      'structure.main-header': {
        populate: {
          mainArticle: headerArticle,
          sideArticles: headerArticle,
          // Legacy list (first = main). Kept so older data still renders until migrated.
          blogs: headerArticle,
        },
      },
      'structure.category-feed': {
        populate: {
          category: { fields: ['Name', 'Slug', 'color'] },
          topBlogs: { fields: ['Title', 'Slug', 'Excerpt'] },
        },
      },
      'structure.social-media-section': {
        populate: {
          author: { fields: ['Name', 'Email'] },
        },
      },
      'structure.excerpt-section': {
        populate: {
          author: { fields: ['Name', 'Email'] },
        },
      },
    },
  },
};

export default (_config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    strapi.log.debug('Applying homepage populate middleware');

    const incomingPopulate = ctx.query?.populate;
    const hasEmptyPopulateObject =
      incomingPopulate &&
      typeof incomingPopulate === 'object' &&
      !Array.isArray(incomingPopulate) &&
      Object.keys(incomingPopulate).length === 0;
    const shouldApplyDefaultPopulate = !incomingPopulate || hasEmptyPopulateObject;

    ctx.query = {
      ...ctx.query,
      populate: shouldApplyDefaultPopulate ? populate : incomingPopulate,
    };

    await next();
  };
};
