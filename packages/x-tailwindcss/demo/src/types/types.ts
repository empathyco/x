/**
 * The type of the `sections` prop that XdsBaseShowcase component receives.
 */
export type ShowcaseSections<T extends string = string> = Record<T, string[]>;

/**
 * The type of the `sectionsClasses` prop that XdsBaseShowcase component receives.
 */
export type ShowcaseSectionsClasses<T extends string = string> = Partial<Record<T, string>>;
