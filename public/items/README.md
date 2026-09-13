# Item artwork

Drop painted artwork for a catalogue item here and the whole app picks it up —
product cards, the detail page and its thumbnails, and order rows.

1. Save the image as `<slug>.jpg`, where the slug is the item title lowercased
   with non-alphanumerics replaced by hyphens (`Sword of Valor` →
   `sword-of-valor.jpg`).
2. Uncomment (or add) that slug in
   [`src/lib/item-images.ts`](../../src/lib/item-images.ts).

Square images work best — the card crops to 4:3 and the detail panel to 1:1.
Around 800×800 is plenty.

Items without a file here fall back to a generated art plate, so the catalogue
never shows a broken or empty image.
