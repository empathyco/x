import { mount } from '@cypress/vue';
// eslint-disable-next-line max-len
import BaseColumnPickerDropdown from '../../src/components/column-picker/base-column-picker-dropdown.vue';
import BaseColumnPickerList from '../../src/components/column-picker/base-column-picker-list.vue';
import { BaseXBus } from '../../src/plugins/x-bus';
import { XPlugin } from '../../src/plugins/x-plugin';
import { e2eAdapter } from '../../src/adapter/e2e-adapter';

/**
 * Mounts a {@link BaseColumnPickerList} and {@link BaseColumnPickerDropdown} component with the
 * provided options and offers an API to easily test it.
 *
 * @param options - The options to render the component with.
 * @returns An API to test the component.
 */
function mountBaseColumnPickerComponents({
  columns = [2, 4, 6],
  selectedColumns = 4
}: BaseColumnPickerRenderOptions = {}): BaseColumnPickerComponentAPI {
  cy.viewport(1920, 200);
  mount(
    {
      components: {
        BaseColumnPickerList,
        BaseColumnPickerDropdown
      },
      template: `
        <div>
          <BaseColumnPickerList
            v-model="selectedColumns"
            :columns="columns"
            #default="{ column, isSelected }"
          >
            <span>{{ column }} {{ isSelected ? '🟢' : '' }}</span>
          </BaseColumnPickerList>
          <BaseColumnPickerDropdown v-model="selectedColumns" :columns="columns">
            <template #toggle="{ item, isOpen }">
              Selected: {{ item }} {{ isOpen ? '🔼' : '🔽' }}
              ️</template>
            <template #item="{ item, isSelected, isHighlighted }">
              <span v-if="isHighlighted">🟢</span>
              <span v-if="isSelected">✅</span>
              <span data-test="column-picker-dropdown-columns">{{ item }}</span>
            </template>
          </BaseColumnPickerDropdown>
        </div>
      `,
      data() {
        return { columns, selectedColumns };
      }
    },
    {
      plugins: [[new XPlugin(new BaseXBus()), { adapter: e2eAdapter }]],
      propsData: { columns, selectedColumns }
    }
  );

  return {
    clickListNthItem(columns: number) {
      cy.getByDataTest('column-picker-list')
        .children(`.x-column-picker-list__item--${columns}-cols`)
        .click();
    },
    getListNthItem(columns: number) {
      return cy
        .getByDataTest('column-picker-list')
        .children(`.x-column-picker-list__item--${columns}-cols`)
        .getByDataTest('column-picker-button');
    },
    clickDropdownNthItem(index: number) {
      cy.getByDataTest('dropdown-toggle').click();
      cy.getByDataTest('dropdown-item').eq(index).click();
    },
    getDropdownNthItem(index: number) {
      cy.getByDataTest('dropdown-toggle').click();
      return cy.getByDataTest('dropdown-item').eq(index);
    },
    closeDropdown() {
      cy.get(`.x-dropdown--is-open`).getByDataTest('dropdown-toggle').click();
    }
  };
}

describe('testing Base Column Picker List and Dropdown', () => {
  it('Selects  different options from the column picker list', () => {
    const { clickListNthItem, getListNthItem } = mountBaseColumnPickerComponents();
    getListNthItem(4).should('have.attr', 'aria-selected', 'true');

    clickListNthItem(2);
    getListNthItem(2).should('have.attr', 'aria-selected', 'true');
    cy.getByDataTest('dropdown-toggle').should('contain', '2');

    clickListNthItem(6);
    getListNthItem(6).should('have.attr', 'aria-selected', 'true');
    cy.getByDataTest('dropdown-toggle').should('contain', '6');
  });

  it('Selects different options from the column picker dropdown', () => {
    const { clickDropdownNthItem, getDropdownNthItem, closeDropdown } =
      mountBaseColumnPickerComponents();
    getDropdownNthItem(1).should('have.attr', 'aria-selected', 'true');
    closeDropdown();

    clickDropdownNthItem(2);
    getDropdownNthItem(2).should('have.attr', 'aria-selected', 'true');
    closeDropdown();

    clickDropdownNthItem(0);
    getDropdownNthItem(0).should('have.attr', 'aria-selected', 'true');
  });
});

interface BaseColumnPickerRenderOptions {
  /** The number of columns to be rendered. */
  columns?: number[];
  /** The initial selected column value. */
  selectedColumns?: number;
}

interface BaseColumnPickerComponentAPI {
  /** Clicks the event button in the column picker list and waits for the view to update. */
  clickListNthItem: (index: number) => void;
  /** Gets the selected item in the column picker list. */
  getListNthItem: (index: number) => Cypress.Chainable<JQuery>;
  /** Clicks the event button in the column picker dropdown and waits for the view to update. */
  clickDropdownNthItem: (index: number) => void;
  /** Gets the selected item in the column picker dropdown. */
  getDropdownNthItem: (index: number) => Cypress.Chainable<JQuery>;
  /** Closes the dropdown menu. */
  closeDropdown: () => void;
}
