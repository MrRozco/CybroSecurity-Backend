import type { Core } from '@strapi/strapi';

const populate = {
  FeaturedImage: { fields: ['url', 'alternativeText', 'width', 'height', 'formats'] },
  category: { fields: ['Name', 'Slug', 'color'] },
  author: {
    fields: ['Name', 'Email'],
    populate: {
      Avatar: { fields: ['url', 'alternativeText', 'formats'] },
    },
  },
  tags: { fields: ['Name', 'Slug'] },
  seo: {
    populate: {
      ogImage: { fields: ['url', 'alternativeText'] },
    },
  },
};

export default (_config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    strapi.log.debug('Applying blog populate middleware');

    ctx.query = {
      ...ctx.query,
      populate: ctx.query?.populate ?? populate,
    };

    await next();
  };
};
