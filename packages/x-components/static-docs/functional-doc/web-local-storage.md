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

The X Components _don't use cookies_ for storing data. Instead of that use Browser Local Storage to
save technical data to provide the needed services associated to the Search Experience.

The following table describes the data stored and the purpose of each piece:

| key                  | duration                            | Purpose                                                                                                                                                                                      |
| -------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| x-session-id         | 30 minutes                          | Short term session identifier to be sent to the Tagging API. It doesn't identifiy a shopper, just a short session in a device. Required for analytics, next queries and related tags service |
| x-session-time-stamp | 30 minutes                          | Time stamp for current session id.                                                                                                                                                           |
| x-history-queries    | Until cleared /disabled by the user | List of stored searches done by the shopper that are shown to the shopper in different steps of the search journey.                                                                           |
