import {
  Facet,
  HierarchicalFacet,
  HierarchicalFilter,
  NumberRangeFacet,
  SimpleFacet,
  SimpleFilter
} from '@empathy/search-types';
import { arrayToObject } from '../utils';
import { Dictionary } from '../utils/types';
import {
  createCategorySimpleFilter,
  CreateHierarchicalFilter,
  createHierarchicalFilterFactory
} from './filters-stubs.factory';

/**
 * Creates {@link @empathy/search-types#SimpleFacet | SimpleFacet} stub.
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
        value: '"LEGO\\ CITY"',
        totalResults: 64,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ STAR\\ WARS"',
        label: 'LEGO STAR WARS',
        selected: false,
        value: '"LEGO\\ STAR\\ WARS"',
        totalResults: 58,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ FRIENDS"',
        label: 'LEGO FRIENDS',
        selected: false,
        value: '"LEGO\\ FRIENDS"',
        totalResults: 57,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ DUPLO"',
        label: 'LEGO DUPLO',
        selected: false,
        value: '"LEGO\\ DUPLO"',
        totalResults: 50,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ NINJAGO"',
        label: 'LEGO NINJAGO',
        selected: false,
        value: '"LEGO\\ NINJAGO"',
        totalResults: 47,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ CREATOR"',
        label: 'LEGO CREATOR',
        selected: false,
        value: '"LEGO\\ CREATOR"',
        totalResults: 33,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ MARVEL"',
        label: 'LEGO MARVEL',
        selected: false,
        value: '"LEGO\\ MARVEL"',
        totalResults: 18,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ TECHNIC"',
        label: 'LEGO TECHNIC',
        selected: false,
        value: '"LEGO\\ TECHNIC"',
        totalResults: 16,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ HARRY\\ POTTER"',
        label: 'LEGO HARRY POTTER',
        selected: false,
        value: '"LEGO\\ HARRY\\ POTTER"',
        totalResults: 13,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ CLASSIC"',
        label: 'LEGO CLASSIC',
        selected: false,
        value: '"LEGO\\ CLASSIC"',
        totalResults: 12,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ DISNEY\\ PRINCESS"',
        label: 'LEGO DISNEY PRINCESS',
        selected: false,
        value: '"LEGO\\ DISNEY\\ PRINCESS"',
        totalResults: 9,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ JUNIORS"',
        label: 'LEGO JUNIORS',
        selected: false,
        value: '"LEGO\\ JUNIORS"',
        totalResults: 8,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ MINECRAFT"',
        label: 'LEGO MINECRAFT',
        selected: false,
        value: '"LEGO\\ MINECRAFT"',
        totalResults: 8,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ SPEED\\ CHAMPION"',
        label: 'LEGO SPEED CHAMPION',
        selected: false,
        value: '"LEGO\\ SPEED\\ CHAMPION"',
        totalResults: 8,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ ARCHITECTURE"',
        label: 'LEGO ARCHITECTURE',
        selected: false,
        value: '"LEGO\\ ARCHITECTURE"',
        totalResults: 7,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ SUPERHEROES"',
        label: 'LEGO SUPERHEROES',
        selected: false,
        value: '"LEGO\\ SUPERHEROES"',
        totalResults: 6,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO"',
        label: 'LEGO',
        selected: false,
        value: '"LEGO"',
        totalResults: 5,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ JURASSIC\\ W"',
        label: 'LEGO JURASSIC W',
        selected: false,
        value: '"LEGO\\ JURASSIC\\ W"',
        totalResults: 5,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ TOY\\ STORY"',
        label: 'LEGO TOY STORY',
        selected: false,
        value: '"LEGO\\ TOY\\ STORY"',
        totalResults: 5,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ THE\\ MOVIE"',
        label: 'LEGO THE MOVIE',
        selected: false,
        value: '"LEGO\\ THE\\ MOVIE"',
        totalResults: 4,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ DC\\ COMICS"',
        label: 'LEGO DC COMICS',
        selected: false,
        value: '"LEGO\\ DC\\ COMICS"',
        totalResults: 3,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ BATMAN"',
        label: 'LEGO BATMAN',
        selected: false,
        value: '"LEGO\\ BATMAN"',
        totalResults: 2,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"CONSTRUCCIÓN"',
        label: 'CONSTRUCCIÓN',
        selected: false,
        value: '"CONSTRUCCIÓN"',
        totalResults: 1,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      },
      {
        facetId: 'brand_facet',
        id: 'brand_facet:"LEGO\\ COLECCIONISTA"',
        label: 'LEGO COLECCIONISTA',
        selected: false,
        value: '"LEGO\\ COLECCIONISTA"',
        totalResults: 1,
        callbackInfo: {},
        modelName: 'SimpleFilter'
      }
    ]
  };
}

/**
 * Creates {@link @empathy/search-types#HierarchicalFacet | HierarchicalFacet} stub.
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
      {
        facetId: 'hierarchical_category',
        parentId: null,
        id: 'hierarchical_category:"rompecabezas"',
        label: 'Rompecabezas',
        selected: false,
        value: '"rompecabezas"',
        totalResults: 1,
        callbackInfo: {},
        modelName: 'HierarchicalFilter',
        children: [
          {
            facetId: 'hierarchical_category',
            parentId: 'hierarchical_category:"rompecabezas"',
            id: 'hierarchical_category:"rompecabezas-faciles"',
            label: 'Rompecabezas difíciles',
            selected: false,
            value: '"rompecabezas-faciles"',
            totalResults: 1,
            callbackInfo: {},
            modelName: 'HierarchicalFilter',
            children: []
          },
          {
            facetId: 'hierarchical_category',
            parentId: 'hierarchical_category:"rompecabezas"',
            id: 'hierarchical_category:"rompecabezas-dificiles"',
            label: 'Rompecabezas fáciles',
            selected: false,
            value: '"rompecabezas-dificiles"',
            totalResults: 1,
            callbackInfo: {},
            modelName: 'HierarchicalFilter',
            children: []
          }
        ]
      },
      {
        facetId: 'hierarchical_category',
        parentId: null,
        id: 'hierarchical_category:"infantiles_\\(hasta_48_piezas\\)"',
        label: 'Infantiles (hasta 48 piezas)',
        selected: false,
        value: '"infantiles_\\(hasta_48_piezas\\)"',
        totalResults: 1,
        callbackInfo: {},
        modelName: 'HierarchicalFilter',
        children: []
      },
      {
        facetId: 'hierarchical_category',
        parentId: null,
        id: 'hierarchical_category:"construcción_por_bloques"',
        label: 'Construcción por bloques',
        selected: false,
        value: '"construcción_por_bloques"',
        totalResults: 314,
        callbackInfo: {},
        modelName: 'HierarchicalFilter',
        children: []
      },
      {
        facetId: 'hierarchical_category',
        parentId: null,
        id: 'hierarchical_category:"series_y_péliculas"',
        label: 'Series y péliculas',
        selected: false,
        value: '"series_y_péliculas"',
        totalResults: 17,
        callbackInfo: {},
        modelName: 'HierarchicalFilter',
        children: []
      },
      {
        facetId: 'hierarchical_category',
        parentId: null,
        id: 'hierarchical_category:"packs_con_personajes"',
        label: 'Packs con personajes',
        selected: false,
        value: '"packs_con_personajes"',
        totalResults: 2,
        callbackInfo: {},
        modelName: 'HierarchicalFilter',
        children: []
      },
      {
        facetId: 'hierarchical_category',
        parentId: null,
        id: 'hierarchical_category:"grandes_\\(hasta_250_piezas\\)"',
        label: 'Grandes (hasta 250 piezas)',
        selected: false,
        value: '"grandes_\\(hasta_250_piezas\\)"',
        totalResults: 2,
        callbackInfo: {},
        modelName: 'HierarchicalFilter',
        children: []
      },
      {
        facetId: 'hierarchical_category',
        parentId: null,
        id: 'hierarchical_category:"amigos_y_familia"',
        label: 'Amigos y familia',
        selected: false,
        value: '"amigos_y_familia"',
        totalResults: 2,
        callbackInfo: {},
        modelName: 'HierarchicalFilter',
        children: []
      },
      {
        facetId: 'hierarchical_category',
        parentId: null,
        id: 'hierarchical_category:"niños"',
        label: 'Niños',
        selected: false,
        value: '"niños"',
        totalResults: 3,
        callbackInfo: {},
        modelName: 'HierarchicalFilter',
        children: []
      },
      {
        facetId: 'hierarchical_category',
        parentId: null,
        id: 'hierarchical_category:"construye"',
        label: 'Construye',
        selected: false,
        value: '"construye"',
        totalResults: 167,
        callbackInfo: {},
        modelName: 'HierarchicalFilter',
        children: []
      },
      {
        facetId: 'hierarchical_category',
        parentId: null,
        id: 'hierarchical_category:"mi_primera_construcción"',
        label: 'Mi primera construcción',
        selected: false,
        value: '"mi_primera_construcción"',
        totalResults: 4,
        callbackInfo: {},
        modelName: 'HierarchicalFilter',
        children: []
      }
    ]
  };
}

/**
 * Creates {@link @empathy/search-types#NumberRangeFacet | NumberRangeFacet} stub.
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
        value: { min: null, max: 10 },
        totalResults: 23,
        callbackInfo: {},
        modelName: 'NumberRangeFilter'
      },
      {
        facetId: 'price_facet',
        id: 'price_facet:10 TO 20',
        label: '10:20',
        selected: false,
        value: { min: 10, max: 20 },
        totalResults: 150,
        callbackInfo: {},
        modelName: 'NumberRangeFilter'
      },
      {
        facetId: 'price_facet',
        id: 'price_facet:20 TO 30',
        label: '20:30',
        selected: false,
        value: { min: 20, max: 30 },
        totalResults: 164,
        callbackInfo: {},
        modelName: 'NumberRangeFilter'
      },
      {
        facetId: 'price_facet',
        id: 'price_facet:30 TO 40',
        label: '30:40',
        selected: false,
        value: { min: 30, max: 40 },
        totalResults: 58,
        callbackInfo: {},
        modelName: 'NumberRangeFilter'
      },
      {
        facetId: 'price_facet',
        id: 'price_facet:40 TO 50',
        label: '40:50',
        selected: false,
        value: { min: 40, max: 50 },
        totalResults: 38,
        callbackInfo: {},
        modelName: 'NumberRangeFilter'
      },
      {
        facetId: 'price_facet',
        id: 'price_facet:50 TO 70',
        label: '50:70',
        selected: false,
        value: { min: 50, max: 70 },
        totalResults: 44,
        callbackInfo: {},
        modelName: 'NumberRangeFilter'
      },
      {
        facetId: 'price_facet',
        id: 'price_facet:70 TO 100',
        label: '70:100',
        selected: false,
        value: { min: 70, max: 100 },
        totalResults: 24,
        callbackInfo: {},
        modelName: 'NumberRangeFilter'
      },
      {
        facetId: 'price_facet',
        id: 'price_facet:100 TO *',
        label: '100:*',
        selected: false,
        value: { min: 100, max: null },
        totalResults: 22,
        callbackInfo: {},
        modelName: 'NumberRangeFilter'
      }
    ]
  };
}

/**
 * Creates {@link @empathy/search-types#Facet | facets} stub.
 *
 * @returns Array of facets stub.
 *
 * @internal
 */
export function getFacetsStub(): Facet[] {
  return [getSimpleFacetStub(), getHierarchicalFacetStub(), getNumberRangeFacetStub()];
}

/**
 * Creates {@link @empathy/search-types#Facet | facets} stub.
 *
 * @returns Dictionary of facets stub.
 *
 * @internal
 */
export function getFacetsDictionaryStub(): Dictionary<Facet> {
  return arrayToObject(getFacetsStub(), 'id');
}

/**
 * Creates a simple facet given a label and its children. It uses the `label` properties for
 * generating the ids and the value of the filters.
 *
 * @param label - The facet label, also used for generating the facet id.
 * @param createChildren - A function to create the child filters. This function is invoked with
 * a factory to create each child filter, only providing the filter `label` and `selected`
 * properties.
 * @returns A simple facet for use in tests.
 */
export function createSimpleFacet(
  label: string,
  createChildren: (
    createSimpleFilter: (label: string, selected: boolean) => SimpleFilter
  ) => SimpleFilter[]
): SimpleFacet {
  const facetId = label.toLowerCase();
  return {
    modelName: 'SimpleFacet',
    id: facetId,
    label,
    filters: createChildren((label, selected) => {
      return {
        id: `${facetId}:${label.toLowerCase()}`,
        facetId: facetId,
        selected,
        label,
        totalResults: 0,
        callbackInfo: {},
        value: label.toLowerCase().replace(/\s+/g, '-'),
        modelName: 'SimpleFilter'
      };
    })
  };
}

/**
 * Creates a hierarchical facet given a label and its children. It uses the `label` properties for
 * generating the ids and the value of the filters.
 *
 * @param label - The facet label, also used for generating the facet id.
 * @param createChildren - A function to create the children filters. This function is invoked with
 * a factory to create each child filter, only providing the filter `label` and `selected`
 * properties.
 * @returns A hierarchical facet for use in tests.
 */
export function createHierarchicalFacet(
  label: string,
  createChildren: (createHierarchicalFilter: CreateHierarchicalFilter) => HierarchicalFilter[]
): HierarchicalFacet {
  const facetId = label.toLowerCase();
  return {
    modelName: 'HierarchicalFacet',
    id: facetId,
    label,
    filters: createChildren(createHierarchicalFilterFactory(facetId))
  };
}

/**
 * Creates a simple facet given a label and its children. It uses the `label` properties for
 * generating the ids and the value of the filters.
 *
 * @param label - The facet label, also used for generating the facet id.
 * @param createChildren - A function to create the child filters. This function is invoked with
 * a factory to create each child filter, only providing the filter `label` and `selected`
 * properties.
 * @returns A simple facet for use in tests.
 */
export function createSimpleFacetStub(
  label: string,
  createChildren: (
    createSimpleFilter: (label: string, selected: boolean) => SimpleFilter
  ) => SimpleFilter[]
): SimpleFacet {
  const facetId = label.toLowerCase();
  return {
    modelName: 'SimpleFacet',
    id: facetId,
    label,
    filters: createChildren((label, selected) => {
      return {
        id: `${facetId}:${label.toLowerCase()}`,
        facetId: facetId,
        selected,
        label,
        totalResults: 0,
        callbackInfo: {},
        value: label.toLowerCase().replace(/\s+/g, '-'),
        modelName: 'SimpleFilter'
      };
    })
  };
}

/**
 * Creates a hierarchical facet without filters, allowing to override some fields.
 *
 * @param facet - A partial facet to override the default fields.
 * @returns A SimpleFacet.
 */
export function createHierarchicalFacetStub(
  facet: Partial<Exclude<HierarchicalFacet, 'modelName'>> = {}
): HierarchicalFacet {
  return {
    modelName: 'HierarchicalFacet',
    id: 'category',
    label: 'Category',
    filters: [],
    ...facet
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
    filters: [createCategorySimpleFilter(category)],
    label: 'category'
  };
}
