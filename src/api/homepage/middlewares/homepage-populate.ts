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
        populate: {
          author: true,
        }
      },
      'structure.excerpt-section': {
        populate: {
          author: true,
        }
      }
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
