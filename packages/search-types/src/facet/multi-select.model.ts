/**
 * @public
 * Different options for configuring the multi-selection of filters in a facet
 */
export enum MultiSelect {
  /**
   * Disable multiselection
   */
  Disabled = 'disabled',
  /**
   * Multi select query will be calculated on the frontend
   */
  OnFrontend = 'multi-select-on-frontend',
  /**
   * Multi select query will be calculated on the backend
   */
  OnBackend = 'multi-select-on-backend'
}
