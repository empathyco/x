---
title: Interface X browser stored data and purposes
tags:
  - x components
  - interface x
  - cookies
  - local storage
  - history queries
---

# Interface X browser stored data and purposes

The X Components _don't use cookies_ for storing data. Instead of that, use Browser Local Storage to
save technical data to provide the needed services associated to the Search Experience.

The following table describes the data stored and the purpose of each piece:

| key                  | duration                            | Purpose                                                                                                                                                                                      |
| -------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `x-session-id`         | 30 minutes                          | Short-term session ID to be sent to the Tagging API. It identifies short sessions in a device. It does not identify individual shoppers in any way. It is required for [Analytics](https://docs.empathy.co/explore-empathy-platform/understand-data-privacy/), [Next Queries](https://docs.empathy.co/explore-empathy-platform/features/history-queries-overview.html), and [Related Tags](https://docs.empathy.co/explore-empathy-platform/features/related-tags-overview.html) features |
| x-session-time-stamp | 30 minutes                          | Time stamp for current session id.                                                                                                                                                           |
| `x-history-queries`    | Stored until the shopper clears/disables the feature | List of the searches performed that the shopper has chosen to store, which are shown in different steps of the search journey.                                                                           |
