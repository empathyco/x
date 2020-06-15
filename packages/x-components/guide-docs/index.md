## Integration and setup guide

This is an example template for x-components usage to generate the predictive layer with keyboard
navigation:

```vue
<template>
  <main>
    <OpenButton>Open search</OpenButton>
    <BaseModalContainer>
      <div class="modal-content">
        <CloseButton aria-label="Close search">x</CloseButton>
      </div>
    </BaseModalContainer>
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <NoSuggestions message="We couldn't find any suggestion. Try searching for {query}." />
    <BaseKeyboardNavigation>
      <div class="inline-flex">
        <h1>Query Suggestions</h1>
        <QuerySuggestions :animation="fadeAndSlide">
          <template #suggestion="{suggestion}">
            <QuerySuggestion
              :suggestion="suggestion"
              :aria-label="`Query suggestion: ${suggestion.query}`"
            />
          </template>
        </QuerySuggestions>
      </div>
      <div class="inline-flex">
        <h1>History</h1>
        <HistoryQueries :animation="fadeAndSlide">
          <template #suggestion-remove-content="{suggestion}">
            <span :aria-label="`Remove ${suggestion.query} from history`">x</span>
          </template>
        </HistoryQueries>
        <ClearHistoryQueries>Clear previous searches</ClearHistoryQueries>
      </div>
      <div class="inline-flex">
        <h1>Popular Searches</h1>
        <PopularSearches :animation="fadeAndSlide" />
      </div>
      <div class="inline-flex">
        <h1>Next Queries</h1>
        <NextQueries :animation="fadeAndSlide" :loadOnInit="loadOnInit" />
      </div>
      <div class="inline-flex">
        <h1>Related tags</h1>
        <RelatedTags :animation="fadeAndSlide" />
      </div>
      <div class="inline-flex">
        <h1>Recommendations</h1>
        <Recommendations :animation="fadeAndSlide">
          <template #default="{ recommendation }">
            <BaseResultLink :result="recommendation" class="x-result-link">
              <template #default="{ result }">
                <img
                  :src="result.images[0]"
                  :alt="result.name"
                  class="x-result_image inline-flex"
                />
                <span class="x-result__title">{{ result.name }}</span>
              </template>
            </BaseResultLink>
          </template>
        </Recommendations>
      </div>
    </BaseKeyboardNavigation>
  </main>
</template>
``` 

This is a list of link to differents components usage examples:

[Next Queries](./examples/next-queries.md)
