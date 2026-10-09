import type { ComputedRef } from 'vue'
import type { AriaLabels } from '../types/accessibility'
import { computed, inject } from 'vue'
import { ACCESSIBILITY_KEY } from '../types/accessibility'
import { deepMergeWithDefaults, DEFAULT_ARIA_LABELS } from '../utils'

/**
 * Resolves the aria labels for a given {@link AriaLabels} namespace, merging any labels provided
 * by the consumer under {@link ACCESSIBILITY_KEY} on top of the library defaults.
 *
 * The consumer only needs to `app.provide` a **partial** configuration (e.g. the labels
 * translated to its language): every entry that is not provided falls back to the library
 * default. Providing nothing is a regular use case (the components resolve the defaults), and
 * the `inject` fallback keeps Vue from logging an "injection not found" warning in that case.
 *
 * The resolved labels are reactive: if the consumer provides a reactive object (or re-provides
 * translated labels when the locale changes), the components pick the new values up.
 *
 * @example
 * ```vue
 * <script setup>
 *   const ariaLabels = useAccessibilityLabels('pageSelector')
 * </script>
 * <template>
 *   <nav :aria-label="ariaLabels.pagination">...</nav>
 * </template>
 * ```
 *
 * @param namespace - The {@link AriaLabels} namespace to resolve (the PascalCase component name).
 * @returns A reactive object with the resolved aria labels for the given namespace.
 *
 * @public
 */
export function useAccessibilityLabels<N extends keyof AriaLabels>(
  namespace: N,
): ComputedRef<NonNullable<AriaLabels[N]>> {
  const injected = inject(ACCESSIBILITY_KEY, {})
  return computed(
    () =>
      deepMergeWithDefaults(DEFAULT_ARIA_LABELS, injected)[namespace] as NonNullable<AriaLabels[N]>,
  )
}
