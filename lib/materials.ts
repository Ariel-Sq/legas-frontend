/**
 * Materials exposed by the shop filter.
 *
 * The catalogue is built from two woods, so the facet offers exactly two
 * options — never combinations. Stored variation values like "Petiribí
 * macizo", "Enchapado petiribí" or "Petiribí + microcemento" all collapse into
 * "Petiribí".
 *
 * Resolution order:
 *  1. The variation's `material` attribute, when it names one of the two woods.
 *  2. The product name — petiribí is always spelled out there, so anything that
 *     does not mention it is álamo.
 *
 * Kept outside `lib/products.ts` because that module is `'use server'` and may
 * only export async functions.
 */
export const SHOP_MATERIALS = ['Álamo', 'Petiribí'] as const;

export type ShopMaterial = (typeof SHOP_MATERIALS)[number];

/** Resolves the shop filter material for a product. */
export function getShopMaterial(
  name: string,
  materialAttribute?: string | null
): ShopMaterial {
  const attr = (materialAttribute ?? '').toLowerCase();
  if (attr.includes('petirib')) return 'Petiribí';
  if (attr.includes('álamo') || attr.includes('alamo')) return 'Álamo';
  return /petirib/i.test(name) ? 'Petiribí' : 'Álamo';
}
