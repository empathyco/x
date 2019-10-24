# Search Adapter Changelog

> ## 3.0.0
>
> EX-1443 Add new entity `showTagging` used for tracking when te response of a feature has been displayed to the user.
>
> EX-1380 Remove first filter auto-selection from `empathy-suggestion-facets.mapper`
>
> EX-1276 Add `checkout` to `TrackingResultConfig` interface
> 
> EX-1355 Removed `preselected` property 
>
> EX-1292 Added discovery wall features: `getClicksRecommendations`, `getQueriesRecommendations`, `getSectionRecommendations`, `getUserRecommendations`

> ## 2.1.0
>
> EX-1246 Cache API responses with a configurable TTL per feature and invalidation

> ## 2.0.0
>
> EX-1240 Remove `needsParentFilter` and `entityDetected` properties

> ## 1.1.0
>
> EX-1187 Fixed hierarchical filters not mapping parent selected property correctly
>
> EX-1203 Removed `toLowerCase` transformation from `rawResult.name` in `empathy-result.mapper`
>
> EX-1121 `RecommendationsRequest` now also extends `Partial<QueryableRequest>`
>
> EX-1221 `EmpathyFilterMapper` now maps selected state to ancestors if it is true.
>
> EX-1221 Now the filters selected state only relies on the previous filter selected state, not on the API response.
>
> EX-1221 Set `entityDetected` filters property to false, before removing it in a future PR.

> ## 1.0.2
>
> EX-1178 Made raw filters selected property optional

> ## 1.0.1
>
> EX-1159 Fixed feature-requestor not mapping falsy values

> ## 1.0.0
>
> EX-1017 First search adapter version
