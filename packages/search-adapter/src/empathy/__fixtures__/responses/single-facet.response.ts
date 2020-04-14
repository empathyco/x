import { EmpathyFacet } from '../../models';

export const deepFacet: EmpathyFacet = {
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
      'selected': true,
      'values': [
        {
          'value': 'Construye',
          'count': 39,
          'filter': '{!tag=hierarchical_category}hierarchical_category:"juegos_de_manualidades\\/construye"',
          'selected': false,
          'values': [
            {
              'value': 'Construye Hija',
              'count': 10,
              'filter': '{!tag=hierarchical_category}hierarchical_category:"juegos_de_manualidades\\/construye/construye-hija"',
              'selected': false
            }
          ]
        }
      ]
    }
  ]
};

export const deepFacetWithNoSelectedProperty: EmpathyFacet = {
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
          'value': 'Construye',
          'count': 39,
          'filter': '{!tag=hierarchical_category}hierarchical_category:"juegos_de_manualidades\\/construye"',
          'values': [
            {
              'value': 'Construye Hija',
              'count': 10,
              'filter': '{!tag=hierarchical_category}hierarchical_category:"juegos_de_manualidades\\/construye\\/construye-hija"'
            }
          ]
        }
      ]
    }
  ]
};

export const priceFacet = {
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
