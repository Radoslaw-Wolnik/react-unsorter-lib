/**
 * Tiny class-name joiner. Equivalent to the popular `clsx` package for cases
 * where you don't need Tailwind-merge conflict resolution.
 *
 * Use `clsx` + `tailwind-merge` if you ever hit specificity conflicts from
 * conditional Tailwind classes (e.g. passing `className` overrides into a
 * component that already sets a bg color).
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
