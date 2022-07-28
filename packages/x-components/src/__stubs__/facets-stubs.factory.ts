import {
  EditableNumberRangeFacet,
  EditableNumberRangeFilter,
  Facet,
  HierarchicalFacet,
  HierarchicalFilter,
  NumberRangeFacet,
  NumberRangeFilter,
  RangeValue,
  SimpleFacet,
  SimpleFilter
} from '@empathyco/x-types';
import {
  createEditableNumberRangeFilter,
  CreateHierarchicalFilter,
  createHierarchicalFilterFactory,
  createNumberRangeFilter,
  createSimpleFilter,
  getHierarchicalFilterStub
} from './filters-stubs.factory';

/**
 * Creates a {@link @empathyco/x-types#SimpleFacet | SimpleFacet} stub.
 *
 * @returns A SimpleFacet.
 *
 * @internal
 */
export function getSimpleFacetStub(): SimpleFacet {
  return {
    id: 'brand_facet',
    modelName: 'SimpleFacet',
    label: 'brand_facet',
    filters: [
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ CITY"',
        label: 'LEGO CITY',
        selected: false,
        totalResults: 64,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ STAR\\ WARS"',
        label: 'LEGO STAR WARS',
        selected: false,
        totalResults: 58,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ FRIENDS"',
        label: 'LEGO FRIENDS',
        selected: false,
        totalResults: 57,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ DUPLO"',
        label: 'LEGO DUPLO',
        selected: false,
        totalResults: 50,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ NINJAGO"',
        label: 'LEGO NINJAGO',
        selected: false,
        totalResults: 47,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ CREATOR"',
        label: 'LEGO CREATOR',
        selected: false,
        totalResults: 33,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ MARVEL"',
        label: 'LEGO MARVEL',
        selected: false,
        totalResults: 18,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ TECHNIC"',
        label: 'LEGO TECHNIC',
        selected: false,
        totalResults: 16,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ HARRY\\ POTTER"',
        label: 'LEGO HARRY POTTER',
        selected: false,
        totalResults: 13,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ CLASSIC"',
        label: 'LEGO CLASSIC',
        selected: false,
        totalResults: 12,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ DISNEY\\ PRINCESS"',
        label: 'LEGO DISNEY PRINCESS',
        selected: false,
        totalResults: 9,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ JUNIORS"',
        label: 'LEGO JUNIORS',
        selected: false,
        totalResults: 8,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ MINECRAFT"',
        label: 'LEGO MINECRAFT',
        selected: false,
        totalResults: 8,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ SPEED\\ CHAMPION"',
        label: 'LEGO SPEED CHAMPION',
        selected: false,
        totalResults: 8,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ ARCHITECTURE"',
        label: 'LEGO ARCHITECTURE',
        selected: false,
        totalResults: 7,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ SUPERHEROES"',
        label: 'LEGO SUPERHEROES',
        selected: false,
        totalResults: 6,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO"',
        label: 'LEGO',
        selected: false,
        totalResults: 5,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ JURASSIC\\ W"',
        label: 'LEGO JURASSIC W',
        selected: false,
        totalResults: 5,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ TOY\\ STORY"',
        label: 'LEGO TOY STORY',
        selected: false,
        totalResults: 5,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ THE\\ MOVIE"',
        label: 'LEGO THE MOVIE',
        selected: false,
        totalResults: 4,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ DC\\ COMICS"',
        label: 'LEGO DC COMICS',
        selected: false,
        totalResults: 3,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ BATMAN"',
        label: 'LEGO BATMAN',
        selected: false,
        totalResults: 2,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"CONSTRUCCIÓN"',
        label: 'CONSTRUCCIÓN',
        selected: false,
        totalResults: 1,
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ COLECCIONISTA"',
        label: 'LEGO COLECCIONISTA',
        selected: false,
        totalResults: 1,
        modelName: 'SimpleFilter'
      }
    ]
  };
}

/**
 * Creates a {@link @empathyco/x-types#HierarchicalFacet | HierarchicalFacet} stub.
 *
 * @returns A HierarchicalFacet.
 *
 * @internal
 */
export function getHierarchicalFacetStub(): HierarchicalFacet {
  return {
    id: 'hierarchical_category',
    modelName: 'HierarchicalFacet',
    label: 'hierarchical_category',
    filters: [
      getHierarchicalFilterStub({
        facetId: 'hierarchical_category',
        id: 'hierarchical_category:"rompecabezas"',
        label: 'Rompecabezas',
        totalResults: 1,
        children: [
          getHierarchicalFilterStub({
            facetId: 'hierarchical_category',
            parentId: 'hierarchical_category:"rompecabezas"',
            id: 'hierarchical_category:"rompecabezas-faciles"',
            label: 'Rompecabezas fáciles'
          }),
          getHierarchicalFilterStub({
            facetId: 'hierarchical_category',
            parentId: 'hierarchical_category:"rompecabezas"',
            id: 'hierarchical_category:"rompecabezas-dificiles"',
            label: 'Rompecabezas difíciles'
          })
        ]
      }),
      getHierarchicalFilterStub({
        facetId: 'hierarchical_category',
        id: 'hierarchical_category:"infantiles_\\(hasta_48_piezas\\)"',
        label: 'Infantiles (hasta 48 piezas)',
        totalResults: 1
      }),
      getHierarchicalFilterStub({
        facetId: 'hierarchical_category',
        id: 'hierarchical_category:"construcción_por_bloques"',
        label: 'Construcción por bloques',
        totalResults: 314
      }),
      getHierarchicalFilterStub({
        facetId: 'hierarchical_category',
        id: 'hierarchical_category:"series_y_péliculas"',
        label: 'Series y péliculas',
        totalResults: 17
      }),
      getHierarchicalFilterStub({
        facetId: 'hierarchical_category',
        id: 'hierarchical_category:"packs_con_personajes"',
        label: 'Packs con personajes',
        totalResults: 2
      }),
      getHierarchicalFilterStub({
        facetId: 'hierarchical_category',
        id: 'hierarchical_category:"grandes_\\(hasta_250_piezas\\)"',
        label: 'Grandes (hasta 250 piezas)',
        totalResults: 2
      }),
      getHierarchicalFilterStub({
        facetId: 'hierarchical_category',
        id: 'hierarchical_category:"amigos_y_familia"',
        label: 'Amigos y familia',
        totalResults: 2
      }),
      getHierarchicalFilterStub({
        facetId: 'hierarchical_category',
        id: 'hierarchical_category:"niños"',
        label: 'Niños',
        totalResults: 3
      }),
      getHierarchicalFilterStub({
        facetId: 'hierarchical_category',
        id: 'hierarchical_category:"construye"',
        label: 'Construye',
        totalResults: 167
      }),
      getHierarchicalFilterStub({
        facetId: 'hierarchical_category',
        id: 'hierarchical_category:"mi_primera_construcción"',
        label: 'Mi primera construcción',
        totalResults: 4
      })
    ]
  };
}

/**
 * Creates a {@link @empathyco/x-types#NumberRangeFacet | NumberRangeFacet} stub.
 *
 * @returns A NumberRangeFacet.
 *
 * @internal
 */
export function getNumberRangeFacetStub(): NumberRangeFacet {
  return {
    id: 'price_facet',
    modelName: 'NumberRangeFacet',
    label: 'price_facet',
    filters: [
      {
        facetId: 'price_facet',
        id: 'price_facet:0 TO 10',
        label: '0:10',
        selected: false,
        range: { min: null, max: 10 },
        totalResults: 23,
        modelName: 'NumberRangeFilter'
      },
      {
        facetId: 'price_facet',
        id: 'price_facet:10 TO 20',
        label: '10:20',
        selected: false,
        range: { min: 10, max: 20 },
        totalResults: 150,
        modelName: 'NumberRangeFilter'
      },
      {
        facetId: 'price_facet',
        id: 'price_facet:20 TO 30',
        label: '20:30',
        selected: false,
        range: { min: 20, max: 30 },
        totalResults: 164,
        modelName: 'NumberRangeFilter'
      },
      {
        facetId: 'price_facet',
        id: 'price_facet:30 TO 40',
        label: '30:40',
        selected: false,
        range: { min: 30, max: 40 },
        totalResults: 58,
        modelName: 'NumberRangeFilter'
      },
      {
        facetId: 'price_facet',
        id: 'price_facet:40 TO 50',
        label: '40:50',
        selected: false,
        range: { min: 40, max: 50 },
        totalResults: 38,
        modelName: 'NumberRangeFilter'
      },
      {
        facetId: 'price_facet',
        id: 'price_facet:50 TO 70',
        label: '50:70',
        selected: false,
        range: { min: 50, max: 70 },
        totalResults: 44,
        modelName: 'NumberRangeFilter'
      },
      {
        facetId: 'price_facet',
        id: 'price_facet:70 TO 100',
        label: '70:100',
        selected: false,
        range: { min: 70, max: 100 },
        totalResults: 24,
        modelName: 'NumberRangeFilter'
      },
      {
        facetId: 'price_facet',
        id: 'price_facet:100 TO *',
        label: '100:*',
        selected: false,
        range: { min: 100, max: null },
        totalResults: 22,
        modelName: 'NumberRangeFilter'
      }
    ]
  };
}

/**
 * Creates a {@link @empathyco/x-types#Facet | facets} stub.
 *
 * @returns Array of facets stub.
 *
 * @internal
 */
export function getFacetsStub(): Facet[] {
  return [getSimpleFacetStub(), getHierarchicalFacetStub(), getNumberRangeFacetStub()];
}

/**
 * Creates a number facet given a label and its children. It uses the `label` properties for
 * generating the ids of the filters.
 *
 * @param label - The facet label, also used for generating the facet id.
 * @param createChildren - A function to create the child filters. This function is invoked with
 * a factory to create each child filter, only providing the filter `value` and `selected`
 * properties.
 * @returns A number range facet for use in tests.
 */
export function createNumberRangeFacet(
  label: string,
  createChildren: (
    createNumberRangeFilter: (range: RangeValue, selected: boolean) => NumberRangeFilter
  ) => NumberRangeFilter[]
): NumberRangeFacet {
  const facetId = label.toLowerCase();
  return {
    modelName: 'NumberRangeFacet',
    id: facetId,
    label,
    filters: createChildren((range, selected) => {
      const { min, max } = range;

      return {
        id: `${facetId}:${min ?? '*'}-${max ?? '*'}`,
        facetId: facetId,
        selected,
        label: `${min ?? '0'} - ${max ?? 'None'}`,
        totalResults: 10,
        range,
        modelName: 'NumberRangeFilter'
      };
    })
  };
}

/**
 * Function to create a single facet with one filter.
 *
 * @param category - Category to be used in the filter creation.
 * @returns Facet with the filter added.
 */
export function createFacetWithFilter(category: string): SimpleFacet {
  return {
    id: 'category',
    modelName: 'SimpleFacet',
    filters: [createSimpleFilter('category', category)],
    label: 'category'
  };
}

/* Next Facets */

/**
 * Creates a simple facet with the given parameters.
 *
 * @param label - Used for the facet `id` and `label` properties.
 * @param createChildren - A function that returns the facet filters.
 * @returns A simple facet.
 */
export function createSimpleFacetStub(
  label: string,
  createChildren: (
    createChild: (label: string, selected?: boolean, totalResults?: number) => SimpleFilter
  ) => SimpleFilter[]
): SimpleFacet {
  const facetId = label.toLowerCase();
  return {
    modelName: 'SimpleFacet',
    id: facetId,
    label,
    filters: createChildren((label, selected, totalResults) =>
      createSimpleFilter(facetId, label, selected, totalResults)
    )
  };
}

/**
 * Creates a number range facet with the given parameters.
 *
 * @param label - Used for the facet `id` and `label` properties.
 * @param createChildren - A function that returns the facet filters.
 * @returns A number range facet.
 */
export function createNumberRangeFacetStub(
  label: string,
  createChildren: (
    createChild: (range: RangeValue, selected?: boolean) => NumberRangeFilter
  ) => NumberRangeFilter[]
): NumberRangeFacet {
  const facetId = label.toLowerCase();
  return {
    modelName: 'NumberRangeFacet',
    id: facetId,
    label,
    filters: createChildren((range, selected) => createNumberRangeFilter(facetId, range, selected))
  };
}

/**
 * Creates an editable number range facet with the given parameters.
 *
 * @param label - Used for the facet `id` and `label` properties.
 * @param createChildren - A function that returns the facet filters.
 * @returns An editable number range facet.
 */
export function createEditableNumberRangeFacetStub(
  label: string,
  createChildren: (
    createChild: (range: RangeValue, selected?: boolean) => EditableNumberRangeFilter
  ) => EditableNumberRangeFilter
): EditableNumberRangeFacet {
  const facetId = label.toLowerCase();
  return {
    modelName: 'EditableNumberRangeFacet',
    id: facetId,
    label,
    filters: [
      createChildren((range, selected) => createEditableNumberRangeFilter(facetId, range, selected))
    ]
  };
}

/**
 * Creates a hierarchical facet with the given parameters.
 *
 * @param label - Used for the facet `id` and `label` properties.
 * @param createChildren - A function that returns the facet filters.
 * @returns A hierarchical facet.
 */
export function createHierarchicalFacetStub(
  label: string,
  createChildren: (createChild: CreateHierarchicalFilter) => HierarchicalFilter[]
): HierarchicalFacet {
  const facetId = label.toLowerCase();
  return {
    modelName: 'HierarchicalFacet',
    id: facetId,
    label,
    filters: createChildren(createHierarchicalFilterFactory(facetId))
  };
}
