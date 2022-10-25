---
title: Interface X data privacy and browser local storage
tags:
  - x components
  - interface x
  - cookies
  - local storage
  - history queries
  - cookieless
---

Interface&nbsp;X for web **does not use cookies** for storing data. The
[Interface X Components](readme.md#interface-x-and-interface-x-for-apps-the-solution) use the web browser's local storage to save the technical data
required to provide the services associated with the search & discovery experience. The data remains
in the shopper's device until the expiration time is reached or the shopper chooses to delete it.

More specifically, Interface&nbsp;X&nbsp;Components store the following elements in the browser's
local storage:

| Key                    | Duration                                             | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `x-session-id`         | 30 minutes                                           | Short-term session ID to be sent to the Tagging API. It identifies short sessions in a device. It does not identify individual shoppers in any way. It's required for [Analytics](/explore-empathy-platform/understand-data-privacy/), [Next Queries](/explore-empathy-platform/features/history-queries-overview.html), and [Related Tags](/explore-empathy-platform/features/related-tags-overview.html) features |
| `x-session-time-stamp` | 30 minutes                                           | Timestamp for the current session ID                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `x-history-queries`    | Stored until the shopper clears/disables the feature | List of the searches performed that the shopper has chosen to store, which are shown in different steps of the search journey.                                                                                                                                                                                                                                                                                                                                                            |
