import { h } from 'vue'
import BaseColumnPickerDropdown from '../../src/components/column-picker/base-column-picker-dropdown.vue'
import BaseColumnPickerList from '../../src/components/column-picker/base-column-picker-list.vue'

function render(columns = [2, 4, 6], selectedColumns = 4) {
  cy.mount(() => [
    h(BaseColumnPickerList, { columns, modelValue: selectedColumns }),
    h(BaseColumnPickerDropdown, { columns, modelValue: selectedColumns }),
  ])

  const getListNthItem = (columns: number) =>
    cy
      .getByDataTest('column-picker-list')
      .children(`.x-column-picker-list__button--${columns}-cols`)

  const getDropdownNthItem = (index: number) => {
    cy.getByDataTest('dropdown-toggle').click()
    return cy.getByDataTest('dropdown-item').eq(index)
  }

  return {
    getListNthItem,
    clickListNthItem: (columns: number) => getListNthItem(columns).click(),
    getDropdownNthItem,
    clickDropdownNthItem: (index: number) => getDropdownNthItem(index).click(),
    closeDropdown: () => cy.get(`.x-dropdown--is-open`).getByDataTest('dropdown-toggle').click(),
  }
}

describe.skip('testing Base Column Picker List and Dropdown', () => {
  it('selects different options from the column picker list', () => {
    const { clickListNthItem, getListNthItem } = render()
    getListNthItem(4).should('have.attr', 'aria-pressed', 'true')

    clickListNthItem(2)
    getListNthItem(2).should('have.attr', 'aria-pressed', 'true')
    cy.getByDataTest('dropdown-toggle').should('contain', '2')

    clickListNthItem(6)
    getListNthItem(6).should('have.attr', 'aria-pressed', 'true')
    cy.getByDataTest('dropdown-toggle').should('contain', '6')
  })

  it('selects different options from the column picker dropdown', () => {
    const { clickDropdownNthItem, getDropdownNthItem, closeDropdown } = render()
    getDropdownNthItem(1).should('have.attr', 'aria-selected', 'true')
    closeDropdown()

    clickDropdownNthItem(2)
    getDropdownNthItem(2).should('have.attr', 'aria-selected', 'true')
    closeDropdown()

    clickDropdownNthItem(0)
    getDropdownNthItem(0).should('have.attr', 'aria-selected', 'true')
  })
})
