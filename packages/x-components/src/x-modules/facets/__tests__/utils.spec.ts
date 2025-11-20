import { createHierarchicalFacetStub, createSimpleFacetStub } from '../../../__stubs__'
import { applyHierarchicalSelection, flatHierarchicalFilters, flattenAllFilters } from '../utils'

describe('testing flatHierarchicalFilters util', () => {
  const hierarchicalFilters = createHierarchicalFacetStub('hierarchical_category', createFilter => [
    createFilter('Vehículos y pistas', false, createFilter => [
      createFilter('Radiocontrol', false),
    ]),
    createFilter('Juguetes electrónicos', false, createFilter => [
      createFilter('Imagen y audio', false),
    ]),
    createFilter('Educativos', false, createFilter => [createFilter('Juguetes educativos', false)]),
  ]).filters

  it('returns an array with all filters flattened and does not duplicate the flattened filters', () => {
    const allFilters = [
      ...hierarchicalFilters,
      ...hierarchicalFilters[0].children!,
      ...hierarchicalFilters[2].children!,
      ...hierarchicalFilters[2].children!,
    ]
    const flattenedHierarchicalFilters = flatHierarchicalFilters(hierarchicalFilters)

    expect(allFilters).toHaveLength(6)
    expect(flattenedHierarchicalFilters).toHaveLength(6)
    allFilters.forEach(filter => {
      expect(flattenedHierarchicalFilters).toContain(filter)
    })
  })

  it('keeps the parent-children relations in the flattened filters', () => {
    flatHierarchicalFilters(hierarchicalFilters)

    expect(hierarchicalFilters).toHaveLength(3)
    expect(hierarchicalFilters[0].children).toHaveLength(1)
    expect(hierarchicalFilters[1].children).toHaveLength(1)
    expect(hierarchicalFilters[2].children).toHaveLength(1)
  })
})

describe('testing flattenAllFilters util', () => {
  const simpleFacet = createSimpleFacetStub('brand', createFilter => [
    createFilter('Nike', false),
    createFilter('Adidas', true),
    createFilter('Puma', false),
  ])

  const hierarchicalFacet = createHierarchicalFacetStub('category', createFilter => [
    createFilter('Electronics', false, createFilter => [
      createFilter('Smartphones', false),
      createFilter('Laptops', true),
    ]),
    createFilter('Clothing', false, createFilter => [createFilter('Shirts', false)]),
  ])

  it('flattens filters from simple facets', () => {
    const result = flattenAllFilters([simpleFacet])

    expect(result).toHaveLength(3)
    expect(result[0].id).toBe('brand:Nike')
    expect(result[1].id).toBe('brand:Adidas')
    expect(result[2].id).toBe('brand:Puma')
    expect(result[1].selected).toBe(true) // Adidas is selected
  })

  it('flattens filters from hierarchical facets including children', () => {
    const result = flattenAllFilters([hierarchicalFacet])

    expect(result).toHaveLength(5)
    const filterIds = result.map(filter => filter.id)
    expect(filterIds).toContain('category:Electronics')
    expect(filterIds).toContain('category:Smartphones')
    expect(filterIds).toContain('category:Laptops')
    expect(filterIds).toContain('category:Clothing')
    expect(filterIds).toContain('category:Shirts')

    // Check that the selected state is preserved
    const laptopsFilter = result.find(f => f.id === 'category:Laptops')
    expect(laptopsFilter?.selected).toBe(true)
  })

  it('flattens filters from mixed facet types', () => {
    const result = flattenAllFilters([simpleFacet, hierarchicalFacet])

    expect(result).toHaveLength(8)
    const filterIds = result.map(filter => filter.id)
    // Simple facet filters
    expect(filterIds).toContain('brand:Nike')
    expect(filterIds).toContain('brand:Adidas')
    expect(filterIds).toContain('brand:Puma')
    // Hierarchical facet filters
    expect(filterIds).toContain('category:Electronics')
    expect(filterIds).toContain('category:Smartphones')
    expect(filterIds).toContain('category:Laptops')
    expect(filterIds).toContain('category:Clothing')
    expect(filterIds).toContain('category:Shirts')
  })

  it('returns empty array when no facets provided', () => {
    const result = flattenAllFilters([])
    expect(result).toEqual([])
  })
})

describe('testing applyHierarchicalSelection util', () => {
  let hierarchicalFilters: any[]

  beforeEach(() => {
    hierarchicalFilters = createHierarchicalFacetStub('category', createFilter => [
      createFilter('Electronics', false, createFilter => [
        createFilter('Smartphones', false),
        createFilter('Laptops', false),
      ]),
      createFilter('Clothing', false, createFilter => [
        createFilter('Shirts', false),
        createFilter('Pants', false),
      ]),
      createFilter('Books', false),
    ]).filters
  })

  it('applies selection to filters based on selectedIds', () => {
    const selectedIds = new Set(['category:Smartphones', 'category:Pants'])

    applyHierarchicalSelection(hierarchicalFilters, selectedIds)

    // Check that the correct filters are selected
    expect(hierarchicalFilters[0].selected).toBe(true) // Electronics (parent of selected child)
    expect(hierarchicalFilters[0].children![0].selected).toBe(true) // Smartphones
    expect(hierarchicalFilters[0].children![1].selected).toBe(false) // Laptops

    expect(hierarchicalFilters[1].selected).toBe(true) // Clothing (parent of selected child)
    expect(hierarchicalFilters[1].children![0].selected).toBe(false) // Shirts
    expect(hierarchicalFilters[1].children![1].selected).toBe(true) // Pants

    expect(hierarchicalFilters[2].selected).toBe(false) // Books
  })

  it('selects parent when any child is selected', () => {
    const selectedIds = new Set(['category:Laptops'])

    applyHierarchicalSelection(hierarchicalFilters, selectedIds)

    expect(hierarchicalFilters[0].selected).toBe(true) // Electronics (parent should be selected)
    expect(hierarchicalFilters[0].children![0].selected).toBe(false) // Smartphones
    expect(hierarchicalFilters[0].children![1].selected).toBe(true) // Laptops
  })

  it('does not select parent when no children are selected', () => {
    const selectedIds = new Set(['category:Books'])

    applyHierarchicalSelection(hierarchicalFilters, selectedIds)

    expect(hierarchicalFilters[0].selected).toBe(false) // Electronics
    expect(hierarchicalFilters[1].selected).toBe(false) // Clothing
    expect(hierarchicalFilters[2].selected).toBe(true) // Books
  })

  it('handles empty selectedIds set', () => {
    const selectedIds = new Set<string>()

    applyHierarchicalSelection(hierarchicalFilters, selectedIds)

    // All filters should be unselected
    expect(hierarchicalFilters[0].selected).toBe(false)
    expect(hierarchicalFilters[0].children![0].selected).toBe(false)
    expect(hierarchicalFilters[0].children![1].selected).toBe(false)
    expect(hierarchicalFilters[1].selected).toBe(false)
    expect(hierarchicalFilters[1].children![0].selected).toBe(false)
    expect(hierarchicalFilters[1].children![1].selected).toBe(false)
    expect(hierarchicalFilters[2].selected).toBe(false)
  })

  it('handles filters without children', () => {
    const selectedIds = new Set(['category:Books'])

    applyHierarchicalSelection(hierarchicalFilters, selectedIds)

    expect(hierarchicalFilters[2].selected).toBe(true)
  })

  it('works with numeric ids', () => {
    // Create filters with numeric ids
    const numericFilters = createHierarchicalFacetStub('category', createFilter => [
      createFilter('Parent', false, createFilter => [createFilter('Child', false)]),
    ]).filters

    // Manually set numeric ids for testing
    numericFilters[0].id = 1
    numericFilters[0].children![0].id = 2

    const selectedIds = new Set([2])

    applyHierarchicalSelection(numericFilters, selectedIds)

    expect(numericFilters[0].selected).toBe(true) // Parent selected because child is selected
    expect(numericFilters[0].children![0].selected).toBe(true) // Child selected
  })
})
