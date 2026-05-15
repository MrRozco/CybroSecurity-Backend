import type { Core } from '@strapi/strapi';

const populate = {
  image: { fields: ['url', 'alternativeText', 'formats'] },
};

export default (_config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    strapi.log.debug('Applying category populate middleware');

    ctx.query = {
      ...ctx.query,
      populate: ctx.query?.populate ?? populate,
    };

    await next();
  };
};
