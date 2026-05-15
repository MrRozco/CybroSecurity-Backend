import type { Core } from '@strapi/strapi';

const populate = {
  siteLogo: { fields: ['url', 'alternativeText', 'formats'] },
  favicon: { fields: ['url', 'alternativeText'] },
  navbar: {
    populate: {
      logo: { fields: ['url', 'alternativeText', 'formats'] },
      links: true,
      hamburgerLinks: true,
    },
  },
  footer: {
    populate: {
      logo: { fields: ['url', 'alternativeText', 'formats'] },
      links: true,
      socialMedias: {
        populate: {
          mediaLogo: { fields: ['url', 'alternativeText'] },
        },
      },
    },
  },
  defaultSeo: {
    populate: {
      ogImage: { fields: ['url', 'alternativeText'] },
    },
  },
};

export default (_config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    strapi.log.debug('Applying global populate middleware');

    ctx.query = {
      ...ctx.query,
      populate: ctx.query?.populate ?? populate,
    };

    await next();
  };
};
