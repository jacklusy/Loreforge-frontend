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
  /** Tailwind gradient utility classes for the plate behind the item. Literal
   * strings so the JIT scanner picks them up — dynamically built class names
   * would be invisible to it. */
  gradient: string;
  /** Colour of the radial "glow" behind the icon, as a Tailwind class. */
  glow: string;
  /** Tint for the ornate inner frame. */
  frame: string;
}

const KEYWORD_VISUALS: Array<{ keywords: string[]; visual: ProductVisual }> = [
  {
    keywords: ["sword"],
    visual: {
      icon: Sword,
      gradient: "from-rose-900 via-red-950 to-stone-950",
      glow: "bg-rose-500/30",
      frame: "ring-rose-400/25",
    },
  },
  {
    keywords: ["shield", "aegis"],
    visual: {
      icon: Shield,
      gradient: "from-sky-900 via-blue-950 to-stone-950",
      glow: "bg-sky-400/30",
      frame: "ring-sky-300/25",
    },
  },
  {
    keywords: ["potion", "healing"],
    visual: {
      icon: FlaskConical,
      gradient: "from-emerald-900 via-green-950 to-stone-950",
      glow: "bg-emerald-400/30",
      frame: "ring-emerald-300/25",
    },
  },
  {
    keywords: ["wand", "mystic"],
    visual: {
      icon: Wand2,
      gradient: "from-fuchsia-900 via-purple-950 to-stone-950",
      glow: "bg-fuchsia-400/30",
      frame: "ring-fuchsia-300/25",
    },
  },
  {
    keywords: ["ring", "invisib"],
    visual: {
      icon: Ghost,
      gradient: "from-slate-800 via-slate-900 to-stone-950",
      glow: "bg-slate-300/25",
      frame: "ring-slate-300/20",
    },
  },
  {
    keywords: ["helmet", "courage"],
    visual: {
      icon: HardHat,
      gradient: "from-amber-800 via-orange-950 to-stone-950",
      glow: "bg-amber-400/30",
      frame: "ring-amber-300/25",
    },
  },
  {
    keywords: ["armor", "fortitude"],
    visual: {
      icon: ShieldCheck,
      gradient: "from-zinc-800 via-stone-900 to-stone-950",
      glow: "bg-zinc-300/25",
      frame: "ring-zinc-300/20",
    },
  },
  {
    keywords: ["boot", "speed"],
    visual: {
      icon: Footprints,
      gradient: "from-cyan-900 via-teal-950 to-stone-950",
      glow: "bg-cyan-400/30",
      frame: "ring-cyan-300/25",
    },
  },
  {
    keywords: ["glove", "dexterity"],
    visual: {
      icon: Hand,
      gradient: "from-orange-900 via-amber-950 to-stone-950",
      glow: "bg-orange-400/30",
      frame: "ring-orange-300/25",
    },
  },
  {
    keywords: ["cape", "shadow"],
    visual: {
      icon: Moon,
      gradient: "from-indigo-900 via-violet-950 to-stone-950",
      glow: "bg-indigo-400/30",
      frame: "ring-indigo-300/25",
    },
  },
];

const FALLBACKS: ProductVisual[] = [
  {
    icon: Gem,
    gradient: "from-violet-900 via-purple-950 to-stone-950",
    glow: "bg-violet-400/30",
    frame: "ring-violet-300/25",
  },
  {
    icon: Sparkles,
    gradient: "from-amber-900 via-yellow-950 to-stone-950",
    glow: "bg-amber-400/30",
    frame: "ring-amber-300/25",
  },
  {
    icon: Backpack,
    gradient: "from-teal-900 via-emerald-950 to-stone-950",
    glow: "bg-teal-400/30",
    frame: "ring-teal-300/25",
  },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Deterministic art treatment for a product title — keyword-matched against
 * common fantasy item names, falling back to a hash-derived pick so any title
 * still gets a stable (not random-per-render), reasonably distinct look. */
export function getProductVisual(title: string): ProductVisual {
  const lower = title.toLowerCase();
  const match = KEYWORD_VISUALS.find(({ keywords }) =>
    keywords.some((keyword) => lower.includes(keyword))
  );
  if (match) return match.visual;

  return FALLBACKS[hashString(title) % FALLBACKS.length];
}
