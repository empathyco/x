# Search Adapter Changelog

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
