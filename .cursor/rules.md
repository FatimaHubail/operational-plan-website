Always use the existing project structure without any changes.

Use only components from shadcn/ui — do not use raw HTML elements like <button> or <input> unless there is no alternative.

Use Tailwind CSS utility classes for styling.

Only use color classes defined by shadcn/ui, such as:
text-primary, bg-primary, border-muted, bg-muted, text-muted-foreground, bg-secondary, hover:bg-accent, etc.

Never use hardcoded color values (e.g., #fff, #000, rgb(...), red, etc.).

Do not use inline styles; always use className.

Do not use other UI libraries like MUI, Chakra, Bootstrap, or raw HTML components.

Follow existing naming and folder structures exactly when creating files or components.

Use cn() helper function to conditionally merge Tailwind class names.

Keep logic and styling inside components — keep pages clean and declarative.

Never override the global theme or base styling set by shadcn/ui unless instructed.

Reuse existing components whenever possible — do not duplicate functionality.

Do not make any changes to the ShadCN components located in src/components/ui unless explicitly instructed to do so.

Do not add new components in src/components/ui unless explicitly instructed to do so.

Use the current Tailwind and shadcn setup without extending or changing the config.

Use shadcn components with @base-ui/react, not with radix ui, configure any component props according to base ui accepted props