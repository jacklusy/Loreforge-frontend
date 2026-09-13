/**
 * Optional painted artwork for catalogue items.
 *
 * The source data ships no images, so every item falls back to a generated art
 * plate (see `ItemArt`). Real artwork can be dropped in without touching any
 * component: save the file as `public/items/<slug>.jpg` and add its slug below.
 *
 * The list is explicit rather than probed at request time on purpose — guessing
 * a URL and reacting to the 404 would cost one failed round-trip per card on
 * every listing render.
 */
const ITEMS_WITH_ART = new Set<string>([
  // "sword-of-valor",
  // "shield-of-aegis",
  // "potion-of-healing",
  // "mystic-wand",
  // "ring-of-invisibility",
  // "helmet-of-courage",
  // "armor-of-fortitude",
  // "boots-of-speed",
  // "gloves-of-dexterity",
  // "cape-of-shadows",
]);

/** `"Sword of Valor"` → `"sword-of-valor"`. */
export function itemSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Public path to an item's artwork, or `null` when it has none yet. */
export function getItemImage(title: string): string | null {
  const slug = itemSlug(title);
  return ITEMS_WITH_ART.has(slug) ? `/items/${slug}.jpg` : null;
}
