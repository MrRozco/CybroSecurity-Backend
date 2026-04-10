/**
 * `homepage-populate` middleware
 */

import type { Core } from '@strapi/strapi';

const populate = {
  content: {
    on: {
      'structure.navbar': {
        populate: '*',
      },
      'structure.main-header': {
        populate: {
          blogs: {
            populate: '*',
          },
        },
      },
      'structure.category-feed': {
        populate: '*',
      },
      'structure.footer': {
        populate: {
          socialMedias: {
            populate: '*',
          },
          links: {
            populate: '*',
          },
          logo: {
            populate: '*',
          },
        },
      },
      'structure.social-media-section': {
        populate: '*'
      }
    },
  },
};

export default (_config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    strapi.log.debug('Applying homepage populate middleware');

    ctx.query = {
      ...ctx.query,
      populate: ctx.query?.populate ?? populate,
    };

    await next();
  };
};
