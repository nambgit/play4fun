import {
  BookOpen,
  Briefcase,
  Brush,
  Calculator,
  Crosshair,
  Footprints,
  Gamepad2,
  Inbox,
  Keyboard,
  Trophy,
  VenetianMask,
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
};

export function GameIcon({ name, className }: { name: GameIconKey; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
