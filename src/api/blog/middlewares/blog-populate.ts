/**
 * `blog-populate` middleware
 */

import type { Core } from '@strapi/strapi';

export default (_config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    strapi.log.debug('Applying blog populate middleware');

    ctx.query = {
      ...ctx.query,
      populate: ctx.query?.populate ?? '*',
    };

    await next();
  };
};
