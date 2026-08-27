---
name: x-adapter-platform
description: "Use when importing, using, or debugging components from x-adapter-platform."
---

# x-adapter-platform

Adapter para la Empathy Platform API construido sobre `x-adapter`: contiene la configuración, mappers y schemas de los endpoints de la plataforma. Es el adapter por defecto usado en `x-archetype`.

## Componentes disponibles

- `platformAdapter` — objeto con todos los `EndpointAdapter` de la plataforma:
  - `search` — búsqueda de resultados.
  - `browse` — browsing sin query.
  - `facets` — facets disponibles para la query.
  - `popularSearches` — búsquedas populares.
  - `recommendations` — productos más clicados.
  - `nextQueries` — queries que suelen hacerse a continuación.
  - `querySuggestions` — sugerencias de query.
  - `relatedTags` — tags para refinar la query.
  - `relatedPrompts` — prompts relacionados.
  - `semanticQueries` — queries semánticas.
  - `identifierResults` — búsqueda por identificador (SKU).
  - `experienceControls` — experience controls del snippet.
  - `aiSuggestions` / `aiSuggestionsSearch` — sugerencias AI.
  - `tagging` — envío de eventos de métricas.
- `resultSchema`, `facetsSchema`, etc. — `MutableSchemas` de request/response que se pueden modificar con `$extends`, `$override` y `$replace`.
- `mapFilters`, `getFacetConfig`, `extractUrlParameters`, `getTaggingInfoFromUrl` — helpers de mapeo y utilidades.

## Instalación

```
npm install @empathyco/x-adapter-platform
```
