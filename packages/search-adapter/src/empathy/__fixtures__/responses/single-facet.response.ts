import { EmpathyFacet } from '../../models';

export const hierarchicalRawFacet: EmpathyFacet = {
  'facet': 'hierarchical_category',
  'values': [
    {
      'value': 'Figuras de acción',
      'count': 2,
      'filter': '{!tag=hierarchical_category}hierarchical_category:"figuras_de_acción"',
      'selected': false
    },
    {
      'value': 'Juegos de manualidades',
      'count': 39,
      'filter': '{!tag=hierarchical_category}hierarchical_category:"juegos_de_manualidades"',
      'selected': false,
      'values': [
        {
          'value': 'Construye',
          'count': 39,
          'filter':
            '{!tag=hierarchical_category}hierarchical_category:"juegos_de_manualidades\\/construye"',
          'selected': false,
          'values': [
            {
              'value': 'Construye Hija',
              'count': 10,
              'filter':
                '{!tag=hierarchical_category}hierarchical_category:"juegos_de_manualidades\\/construye/construye-hija"',
              'selected': false
            }
          ]
        }
      ]
    }
  ]
};

export const hierarchicalRawFacetWithoutSelected: EmpathyFacet = {
  'facet': 'hierarchical_category',
  'values': [
    {
      'value': 'Figuras de acción',
      'count': 2,
      'filter': '{!tag=hierarchical_category}hierarchical_category:"figuras_de_acción"'
    },
    {
      'value': 'Juegos de manualidades',
      'count': 39,
      'filter': '{!tag=hierarchical_category}hierarchical_category:"juegos_de_manualidades"',
      'values': [
        {
          'value': 'Playmobil',
          'count': 4,
          'filter':
            '{!tag=hierarchical_category}hierarchical_category:"juegos_de_manualidades\\/playmobil"'
        },
        {
          'value': 'Construye',
          'count': 35,
          'filter':
            '{!tag=hierarchical_category}hierarchical_category:"juegos_de_manualidades\\/construye"',
          'values': [
            {
              'value': 'Construye Hija',
              'count': 10,
              'filter':
                '{!tag=hierarchical_category}hierarchical_category:"juegos_de_manualidades\\/construye\\/construye-hija"'
            }
          ]
        }
      ]
    }
  ]
};

export const simpleRawFacet: EmpathyFacet = {
  'facet': 'collection_facet',
  'values': [
    {
      'count': 33,
      'filter': '{!tag=collection_facet}collection_facet:"Hold"',
      'selected': false,
      'value': 'Hold'
    },
    {
      'count': 20,
      'filter': '{!tag=collection_facet}collection_facet:"Icon\\/Mesh"',
      'selected': false,
      'value': 'Icon Mesh'
    },
    {
      'count': 14,
      'filter': '{!tag=collection_facet}collection_facet:"Mesh\\/Color"',
      'selected': false,
      'value': 'Mesh Color'
    }
  ]
};

export const dynamicNumberRangeRawFacet: EmpathyFacet = {
  'facet': 'price_facet',
  'values': [
    {
      'value': '0:10',
      'count': 11,
      'filter': '{!tag=price_facet}priceSort:[0 TO 10]'
    },
    {
      'value': '10:20',
      'count': 14,
      'filter': '{!tag=price_facet}priceSort:[10 TO 20]'
    },
    {
      'value': '20:30',
      'count': 8,
      'filter': '{!tag=price_facet}priceSort:[20 TO 30]'
    },
    {
      'value': '30:40',
      'count': 1,
      'filter': '{!tag=price_facet}priceSort:[30 TO 40]'
    },
    {
      'value': '40:50',
      'count': 2,
      'filter': '{!tag=price_facet}priceSort:[40 TO 50]'
    },
    {
      'value': '50:70',
      'count': 1,
      'filter': '{!tag=price_facet}priceSort:[50 TO 70]'
    },
    {
      'value': '70:100',
      'count': 0,
      'filter': '{!tag=price_facet}priceSort:[70 TO 100]'
    },
    {
      'value': '100:*',
      'count': 0,
      'filter': '{!tag=price_facet}priceSort:[100 TO *]'
    }
  ]
};

export const noDynamicNumberRangeRawFacet: EmpathyFacet = {
  'facet': 'rating_facet',
  'values': [
    {
      'value': '1:5',
      'count': 11,
      'filter': '{!tag=rating_facet}rating:[1 TO 5]'
    },
    {
      'value': '5:10',
      'count': 14,
      'filter': '{!tag=rating_facet}rating:[5 TO 10]'
    }
  ]
};
