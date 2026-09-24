import type { Core } from '@strapi/strapi';

/**
 * Human-readable display fields for the Content Manager.
 *
 * The mainField is what the admin shows as an entry's title (edit view header,
 * relation pickers, "Last edited" widgets). Several types defaulted to
 * `documentId`, which shows random IDs to editors.
 */
const DISPLAY_SETTINGS: Record<string, { mainField: string; defaultSortBy: string; defaultSortOrder: 'ASC' | 'DESC' }> = {
  'api::blog.blog': { mainField: 'Title', defaultSortBy: 'updatedAt', defaultSortOrder: 'DESC' },
  'api::category.category': { mainField: 'Name', defaultSortBy: 'Name', defaultSortOrder: 'ASC' },
  'api::tag.tag': { mainField: 'Name', defaultSortBy: 'Name', defaultSortOrder: 'ASC' },
  'api::author.author': { mainField: 'Name', defaultSortBy: 'Name', defaultSortOrder: 'ASC' },
  'api::job-posting.job-posting': { mainField: 'title', defaultSortBy: 'posted', defaultSortOrder: 'DESC' },
  'api::job-category.job-category': { mainField: 'name', defaultSortBy: 'name', defaultSortOrder: 'ASC' },
  'api::job-level.job-level': { mainField: 'level', defaultSortBy: 'level', defaultSortOrder: 'ASC' },
};

/** Only overwrite values that are still on an unhelpful default, so choices made in the UI stick. */
const PLACEHOLDER_FIELDS = new Set(['id', 'documentId']);

const applyDisplaySettings = async (strapi: Core.Strapi) => {
  const contentTypes = strapi.plugin('content-manager').service('content-types');

  for (const [uid, wanted] of Object.entries(DISPLAY_SETTINGS)) {
    if (!strapi.contentTypes[uid as keyof typeof strapi.contentTypes]) continue;

    const { settings } = await contentTypes.findConfiguration({ uid });
    const next = { ...settings };

    if (PLACEHOLDER_FIELDS.has(settings.mainField)) next.mainField = wanted.mainField;
    if (PLACEHOLDER_FIELDS.has(settings.defaultSortBy)) {
      next.defaultSortBy = wanted.defaultSortBy;
      next.defaultSortOrder = wanted.defaultSortOrder;
    }

    if (next.mainField !== settings.mainField || next.defaultSortBy !== settings.defaultSortBy) {
      await contentTypes.updateConfiguration({ uid }, { settings: next });
      strapi.log.info(`[admin] Display settings updated for ${uid} (mainField: ${next.mainField})`);
    }
  }
};

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
      await applyDisplaySettings(strapi);
    } catch (error) {
      // Never block startup over an admin cosmetic setting.
      strapi.log.warn(`[admin] Could not apply display settings: ${(error as Error).message}`);
    }
  },
};
