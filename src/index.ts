import type { Core } from '@strapi/strapi';

import { applyContentManagerConfig } from './bootstrap/content-manager';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await applyContentManagerConfig(strapi);
    } catch (error) {
      // Never block startup over admin labels / display settings.
      strapi.log.warn(`[admin] Could not apply Content Manager config: ${(error as Error).message}`);
    }
  },
};
