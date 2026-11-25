/**
 * Defines the possible animation origins for the animation components (animate-clip-path,
 * animate-translate, animate-scale...).
 */
export type AnimationOrigin =
  | 'top'
  | 'bottom'
  | 'top-to-bottom'
  | 'bottom-to-top'
  | 'left'
  | 'right'
  | 'left-to-right'
  | 'right-to-left'

/**
 * Defines the possible animation origins for the translate animation: the {@link AnimationOrigin}
 * ones plus the logical `start`/`end` origins, which are the inline edges and are mirrored in
 * right-to-left documents (`dir="rtl"`).
 */
export type TranslateAnimationOrigin =
  | AnimationOrigin
  | 'start'
  | 'end'
  | 'start-to-end'
  | 'end-to-start'
