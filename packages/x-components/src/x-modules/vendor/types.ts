import type { Banner, NamedModel, RelatedPrompt, Result } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'

export interface VendorResultTagging {
  mountedUrl: string
  viewUrl: string
  clickUrl: string
  add2cartUrl: string
}

/**
 * The tagging info for a vendor banner.
 *
 * @public
 */
export interface VendorBannerTagging {
  mountedUrl: string
  clickUrl: string
  viewUrl: string
}

/**
 * The interface for a vendor result, extending the base Result interface.
 */
export interface VendorResult
  extends Omit<Result, 'modelName' | 'tagging'>, NamedModel<'VendorResult'> {
  position: number
  tagging?: VendorResultTagging
}

/**
 * The interface for a vendor banner, extending the base Banner interface.
 * The optional position means:
 * - If the position is defined, the banner will be displayed in that position inside the grid.
 * - If the position is undefined, the banner will be displayed on top of the grid and full width.
 */
export interface VendorBanner
  extends Omit<Banner, 'modelName' | 'tagging'>, NamedModel<'VendorBanner'> {
  position?: number
  tagging?: VendorBannerTagging
}

/**
 * The tagging info for a vendor related prompt.
 *
 * @public
 */
export interface VendorRelatedPromptTagging {
  mountedUrl: string
  viewUrl: string
  clickUrl: string
}

/**
 * The interface for a vendor related prompt, extending the base RelatedPrompt interface.
 *
 * @public
 */
export interface VendorRelatedPrompt
  extends
    Omit<RelatedPrompt, 'modelName' | 'tagging' | 'toolingDisplayTagging'>,
    NamedModel<'VendorRelatedPrompt'> {
  /** The vendor tagging URLs of the related prompt. */
  tagging?: VendorRelatedPromptTagging
  /** Free data provided by the vendor, sent back in the events (e.g. a product or campaign id). */
  metadata?: Dictionary<unknown>
}

/**
 * A group of vendor related prompts, rendered as a full-width item that starts the given grid
 * row.
 *
 * @public
 */
export interface VendorRelatedPromptsGroup extends NamedModel<'VendorRelatedPromptsGroup'> {
  /** The unique id of the group. */
  id: string
  /** The grid row (1-based) where the group is inserted. */
  row: number
  /** An optional title for the group (e.g. a sponsored label). */
  title?: string
  /** The related prompts of the group. */
  relatedPrompts: VendorRelatedPrompt[]
  /** Free data provided by the vendor (e.g. a campaign id). */
  metadata?: Dictionary<unknown>
}

/**
 * The input of a vendor related prompts group, as provided by the x consumer. The `modelName`
 * fields are excluded since they are internal and assigned under the hood.
 *
 * @public
 */
export interface VendorRelatedPromptsGroupInput extends Omit<
  VendorRelatedPromptsGroup,
  'modelName' | 'relatedPrompts'
> {
  /** The related prompts of the group, without the `modelName` field. */
  relatedPrompts: Omit<VendorRelatedPrompt, 'modelName'>[]
}
