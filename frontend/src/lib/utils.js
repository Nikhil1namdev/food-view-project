import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// cn utility combines and resolves conflicting Tailwind CSS classes dynamically
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
