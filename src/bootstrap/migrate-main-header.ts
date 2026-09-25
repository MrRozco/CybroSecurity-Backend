import type { Core } from '@strapi/strapi';

/**
 * One-off data move for the Main Header component.
 *
 * Before: a single `blogs` list where position 1 was silently the main article.
 * After:  `mainArticle` (one) + `sideArticles` (ordered list).
 *
 * For every Main Header (draft and published versions alike) that still has
 * `blogs` links and nothing in the new fields, the first blog becomes the main
 * article and the rest become side articles, in the same order. The old links
 * are then removed so the legacy field can't resurface.
 *
 * Idempotent: once a header has been moved, its `blogs` list is empty and it is skipped.
 */

const COMPONENT_UID = 'structure.main-header';

interface JoinTable {
  name: string;
  joinColumn: { name: string };
  inverseJoinColumn: { name: string };
  orderColumnName?: string;
}

const joinTableOf = (strapi: Core.Strapi, attribute: string): JoinTable | undefined => {
  const meta = strapi.db.metadata.get(COMPONENT_UID) as { attributes: Record<string, { joinTable?: JoinTable }> };
  return meta?.attributes?.[attribute]?.joinTable;
};

export const migrateMainHeaderArticles = async (strapi: Core.Strapi) => {
  const legacy = joinTableOf(strapi, 'blogs');
  const main = joinTableOf(strapi, 'mainArticle');
  const side = joinTableOf(strapi, 'sideArticles');

  if (!legacy || !main || !side) {
    strapi.log.warn('[migrate] Main Header: relation tables not found, skipping article migration');
    return;
  }

  const knex = strapi.db.connection;
  const owner = legacy.joinColumn.name; // e.g. main_header_id
  const target = legacy.inverseJoinColumn.name; // e.g. blog_id

  const legacyRows: Record<string, number>[] = await knex(legacy.name)
    .select(owner, target, ...(legacy.orderColumnName ? [legacy.orderColumnName] : []))
    .orderBy([{ column: owner }, ...(legacy.orderColumnName ? [{ column: legacy.orderColumnName }] : []), { column: 'id' }]);

  if (legacyRows.length === 0) return;

  const byHeader = new Map<number, number[]>();
  for (const row of legacyRows) {
    const list = byHeader.get(row[owner]) ?? [];
    list.push(row[target]);
    byHeader.set(row[owner], list);
  }

  let moved = 0;

  await knex.transaction(async (trx) => {
    for (const [headerId, blogIds] of byHeader) {
      const [{ count: mainCount }] = await trx(main.name).where(main.joinColumn.name, headerId).count({ count: '*' });
      const [{ count: sideCount }] = await trx(side.name).where(side.joinColumn.name, headerId).count({ count: '*' });

      // Already using the new fields — never overwrite an editor's choices.
      if (Number(mainCount) > 0 || Number(sideCount) > 0) continue;

      const [mainId, ...sideIds] = blogIds;

      await trx(main.name).insert({
        [main.joinColumn.name]: headerId,
        [main.inverseJoinColumn.name]: mainId,
      });

      if (sideIds.length) {
        await trx(side.name).insert(
          sideIds.map((blogId, index) => ({
            [side.joinColumn.name]: headerId,
            [side.inverseJoinColumn.name]: blogId,
            ...(side.orderColumnName ? { [side.orderColumnName]: index + 1 } : {}),
          }))
        );
      }

      await trx(legacy.name).where(owner, headerId).delete();
      moved += 1;
    }
  });

  if (moved) {
    strapi.log.info(`[migrate] Main Header: moved articles into "Main article" / "Side articles" for ${moved} header(s)`);
  }
};
