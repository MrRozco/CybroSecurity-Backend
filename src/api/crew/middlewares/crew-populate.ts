/**
 * `crew-populate` middleware
 */

import type { Core } from '@strapi/strapi';

const populate = {
  content: {
    on: {
      'structure.crew-header': {
        populate: '*',
      },
      'structure.crew-members': {
        populate: {
          employee: {
            populate: {
              profile: true,
              socials: {
                populate: {
                  mediaLogo: true,
                },
              },
            },
          },
        },
      },
    },
  },
};

export default (_config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    strapi.log.debug('Applying crew populate middleware');

    ctx.query = {
      ...ctx.query,
      populate: ctx.query?.populate ?? populate,
    };

    await next();
  };
};
