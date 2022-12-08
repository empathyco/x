export interface HomeControls {
  searchInput: {
    instant: boolean;
    instantDebounceInMs: number;
  };
  popularSearches: {
    maxItemsToRender: number;
  };
  slicedFilters: {
    max: number;
  };
  historyQueries: {
    maxItemsToRender: number;
  };
  nextQueriesPreview: {
    maxItemsToRender: number;
  };
  nextQueriesList: {
    showOnlyAfterOffset: boolean;
  };
  adapter: {
    useE2EAdapter: boolean;
  };
}
