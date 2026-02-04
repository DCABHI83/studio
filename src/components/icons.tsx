import { UtensilsCrossed, Plane, Home, ShoppingBag, Receipt, Package, type LucideIcon } from 'lucide-react';
import type { Category } from '@/lib/types';

export const categoryIcons: Record<Category, LucideIcon> = {
  Food: UtensilsCrossed,
  Travel: Plane,
  Rent: Home,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Other: Package,
};

export const categoryStyles: Record<Category, { bg: string, text: string }> = {
    Food:     { bg: "bg-chart-1", text: "text-primary-foreground" },
    Travel:   { bg: "bg-chart-2", text: "text-primary-foreground" },
    Rent:     { bg: "bg-chart-3", text: "text-accent-foreground" },
    Shopping: { bg: "bg-chart-4", text: "text-accent-foreground" },
    Bills:    { bg: "bg-chart-5", text: "text-accent-foreground" },
    Other:    { bg: "bg-muted",   text: "text-muted-foreground" },
}
