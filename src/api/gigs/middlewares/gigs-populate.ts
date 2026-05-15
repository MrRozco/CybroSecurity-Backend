import type { Core } from '@strapi/strapi';

const populate = {
  job_postings: {
    fields: ['title', 'description', 'posted', 'url', 'documentId'],
    populate: {
      logo: { fields: ['url', 'alternativeText'] },
      job_level: { fields: ['level', 'slug'] },
      job_category: { fields: ['name', 'slug'] },
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
