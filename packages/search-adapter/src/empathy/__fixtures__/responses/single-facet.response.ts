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
              'filter': '{!tag=hierarchical_category}hierarchical_category:"juegos_de_manualidades\\/construye/construye-hija"'
            }
          ]
        }
      ]
    }
  ]
};
