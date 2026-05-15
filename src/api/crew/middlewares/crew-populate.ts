import type { Core } from '@strapi/strapi';

const populate = {
  header: true,
  members: {
    populate: {
      employee: {
        populate: {
          profile: { fields: ['url', 'alternativeText', 'formats'] },
          socials: {
            populate: {
              mediaLogo: { fields: ['url', 'alternativeText'] },
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
