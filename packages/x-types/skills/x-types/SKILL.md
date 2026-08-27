---
name: x-types
description: "Use when importing, using, or debugging components from x-types."
---

# x-types

Tipos de modelo, type guards y schemas para usar de forma segura en el proyecto X. Define los contratos de datos (requests, responses, results, facets, filters, tagging...) que comparten los demás paquetes.

## Componentes disponibles

- Modelos de datos: `Result`, `Facet`, `Filter` (y sus variantes `SimpleFilter`, `HierarchicalFilter`, `BooleanFilter`, `NumberRangeFilter`, `EditableNumberRangeFilter`), `Suggestion`, `Query`, `NextQuery`, `RelatedTag`, `HistoryQuery`, `Banner`, `Sort`, `Tagging`/`Taggable`, requests y responses de cada endpoint.
- Type guards: `isSimpleFilter`, `isHierarchicalFilter`, `isBooleanFilter`, `isNumberRangeFilter`, `isEditableNumberRangeFilter`, `isSimpleFacet`, `isHierarchicalFacet`, `isBooleanFacet`, `isNumberRangeFacet`, `isEditableNumberRangeFacet`, `isRawFilter`, `isFacetFilter`, etc.
- Schemas de validación (submódulo `@empathyco/x-types/schemas`): `FilterSchema`, `FacetSchema`, `ResultSchema`, `RecommendationSchema`, `SuggestionSchema`, `RelatedTagSchema`, `TaggingSchema`, `NextQuerySchema`, etc., para validar objetos con Jest/Vitest.

## Instalación

```
npm install @empathyco/x-types
```
