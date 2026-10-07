---
name: x-components
description: 'Use when importing, using, or debugging components from x-components.'
---

# x-components

Biblioteca de componentes Vue 3 para combinar y crear tu propia experiencia de búsqueda (o cualquier otra interfaz). También se documenta en https://docs.empathy.co (build search UI → web x components).

## Componentes disponibles

- `AutoProgressBar` — barra de progreso automática para peticiones en curso.
- `BaseDropdown` — dropdown reutilizable con items.
- `BaseEventButton` — botón que emite eventos al hacer clic.
- `BaseGrid` — grid para mostrar una lista de results.
- `BaseKeyboardNavigation` — navegación por teclado dentro de un componente.
- `BaseRating` — valoración tipo estrellas.
- `BaseSlider` — slider (basado en noUiSlider) para rangos numéricos.
- `BaseSwitch` — switch/toggle accesible.
- `BaseTeleport` — wrapper para teleportar contenido.
- `BaseVariableColumnGrid` — grid con número de columnas variable.
- `BaseColumnPickerDropdown` / `BaseColumnPickerList` — selectores de columnas del grid.
- `BaseCurrency` — formatea un precio en la divisa configurada.
- `Highlight` — resalta el texto de una query dentro de un resultado.
- `ItemsList` — lista básica de items (suggestions, etc.).
- `Message` — mensaje de estado (loading, error, vacío).
- `PageLoaderButton` — botón para cargar la siguiente página.
- `PageSelector` — selector de página del paginador.
- `SlidingPanel` — panel lateral deslizante.
- `BaseTogglePanel` / `BaseHeaderTogglePanel` / `BaseTabsPanel` / `BaseIdTogglePanel` — paneles colapsables y por pestañas.
- `BaseModal` / `MainModal` — modales con eventos de abrir/cerrar.
- `SortDropdown` / `SortList` / `SortPickerList` — selectores de ordenación.
- `BaseSuggestions` / `BaseSuggestion` — lista e item de sugerencias.
- `BaseResult*` — piezas del resultado: `image`, `fallback-image`, `placeholder-image`, `current-price`, `previous-price`, `rating`, `link`, `add-to-cart`.
- `ResultVariantSelector` / `ResultVariantsProvider` — selección de variantes de producto.
- `BaseScroll` — scroll con estado de posición.
- `SnippetCallbacks` — callbacks de ciclo de vida del snippet.
- `LocationProvider` / `DisplayClickProvider` / `DisplayEmitter` — providers/emitter de contexto.
- `GlobalXBus` — instancia global del X-Bus de eventos.
- `Icons` — iconos SVG inline (search, cart, chevron, sort, etc.).
- `Animations` — animaciones reutilizables (fade, cross-fade, collapse, staggered, etc.).

## Instalación

```
npm install @empathyco/x-components
```
