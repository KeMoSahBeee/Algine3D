import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to merge and conditionally apply Tailwind CSS classes.
 * @param inputs - A list of class values (strings, arrays, or objects).
 * @returns A single string of combined and deduplicated class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
