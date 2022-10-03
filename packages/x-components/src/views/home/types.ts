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
  adapter: {
    useE2EAdapter: boolean;
  };
}
