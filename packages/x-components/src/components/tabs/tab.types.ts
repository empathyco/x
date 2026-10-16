/**
 * The shape of a single item rendered by {@link Tabs}.
 *
 * @public
 */
export interface Tab {
  /** The unique id of the tab. */
  id: string
  /** Text label rendered inside the tab. */
  label: string
  /** Callback invoked when the tab is clicked. */
  click: () => void
  /** Tab selected state. */
  selected?: boolean
}
