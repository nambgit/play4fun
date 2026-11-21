import {
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Compass,
  Brush,
  Calculator,
  Crosshair,
  Flag,
  Footprints,
  Gamepad2,
  HeartHandshake,
  Inbox,
  Keyboard,
  Link2,
  Moon,
  SpellCheck,
  Trophy,
  UtensilsCrossed,
  VenetianMask,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { GameIcon as GameIconKey } from "@/lib/games";

const ICONS: Record<GameIconKey, LucideIcon> = {
  run: Footprints,
  inbox: Inbox,
  calculator: Calculator,
  crosshair: Crosshair,
  keyboard: Keyboard,
  briefcase: Briefcase,
  book: BookOpen,
  gamepad: Gamepad2,
  spy: VenetianMask,
  brush: Brush,
  trophy: Trophy,
  zap: Zap,
  brain: Brain,
  building: Building2,
  letters: SpellCheck,
  link: Link2,
  compass: Compass,
  bowl: UtensilsCrossed,
  flag: Flag,
  moon: Moon,
  hearts: HeartHandshake,
};

export function GameIcon({ name, className }: { name: GameIconKey; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
