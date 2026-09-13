import {
  Backpack,
  FlaskConical,
  Footprints,
  Gem,
  Ghost,
  Hand,
  HardHat,
  Moon,
  Shield,
  ShieldCheck,
  Sparkles,
  Sword,
  Wand2,
  type LucideIcon,
} from "lucide-react";

interface ProductVisual {
  icon: LucideIcon;
  /** Tailwind gradient utility classes — literal strings so the JIT scanner picks
   * them up (dynamically built class names would be invisible to it). */
  gradient: string;
}

const KEYWORD_VISUALS: Array<{ keywords: string[]; visual: ProductVisual }> = [
  { keywords: ["sword"], visual: { icon: Sword, gradient: "from-rose-500 to-red-700" } },
  { keywords: ["shield", "aegis"], visual: { icon: Shield, gradient: "from-sky-500 to-blue-700" } },
  {
    keywords: ["potion", "healing"],
    visual: { icon: FlaskConical, gradient: "from-emerald-500 to-green-700" },
  },
  { keywords: ["wand", "mystic"], visual: { icon: Wand2, gradient: "from-fuchsia-500 to-purple-700" } },
  { keywords: ["ring", "invisib"], visual: { icon: Ghost, gradient: "from-slate-500 to-slate-700" } },
  { keywords: ["helmet", "courage"], visual: { icon: HardHat, gradient: "from-amber-500 to-orange-700" } },
  {
    keywords: ["armor", "fortitude"],
    visual: { icon: ShieldCheck, gradient: "from-zinc-500 to-stone-700" },
  },
  { keywords: ["boot", "speed"], visual: { icon: Footprints, gradient: "from-cyan-500 to-teal-700" } },
  { keywords: ["glove", "dexterity"], visual: { icon: Hand, gradient: "from-orange-500 to-amber-700" } },
  { keywords: ["cape", "shadow"], visual: { icon: Moon, gradient: "from-indigo-500 to-violet-800" } },
];

const FALLBACK_ICONS = [Gem, Sparkles, Backpack];
const FALLBACK_GRADIENTS = [
  "from-violet-500 to-purple-700",
  "from-amber-500 to-orange-700",
  "from-teal-500 to-emerald-700",
  "from-rose-500 to-pink-700",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Deterministic icon + gradient for a product title — keyword-matched against
 * common fantasy item names, falling back to a hash-derived pick so any title
 * still gets a stable (not random-per-render), reasonably distinct look. */
export function getProductVisual(title: string): ProductVisual {
  const lower = title.toLowerCase();
  const match = KEYWORD_VISUALS.find(({ keywords }) => keywords.some((keyword) => lower.includes(keyword)));
  if (match) return match.visual;

  const hash = hashString(title);
  return {
    icon: FALLBACK_ICONS[hash % FALLBACK_ICONS.length],
    gradient: FALLBACK_GRADIENTS[hash % FALLBACK_GRADIENTS.length],
  };
}
