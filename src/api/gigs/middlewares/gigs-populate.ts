/**
 * `gigs-populate` middleware
 */

import type { Core } from '@strapi/strapi';

const populate = {
  content: {
    on: {
      'structure.job-postings': {
        populate: {
          job_postings: {
            fields: ['title', 'description', 'posted', 'url', 'documentId', 'createdAt', 'updatedAt', 'publishedAt'],
            populate: {
              logo: {
                populate: '*',
              },
              job_level: {
                populate: '*',
              },
              job_category: {
                populate: '*',
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
    strapi.log.debug('Applying gigs populate middleware');

    ctx.query = {
      ...ctx.query,
      populate: ctx.query?.populate ?? populate,
    };

    await next();
  };
};
