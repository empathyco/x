import { mount } from '@cypress/vue';
import Vue from 'vue';
import { getNextQueriesStub, getSearchResponseStub } from '../../src/__stubs__';
import BaseGrid from '../../src/components/base-grid.vue';
import { BaseXBus } from '../../src/plugins/x-bus';
import { XPlugin } from '../../src/plugins/x-plugin';
import { ListItem } from '../../src/utils';
import { NextQueriesGroup } from '../../src/x-modules/next-queries/types';
import { e2eAdapter } from '../../src/adapter/e2e-adapter';

/**
 * Renders an {@link BaseGrid} component with the provided options.
 *
 * @param  options - Options to render {@link BaseGrid} with.
 * @returns Helper methods for the rendered {@link BaseGrid}.
 */
function renderBaseGrid({
  columns = 3,
  items,
  customItemSlot = `
    <template #banner="{ item }">
      <p data-test="banner-slot">{{ item.modelName }}</p>
    </template>
    <template #result="{ item }">
      <p data-test="result-slot">{{ item.modelName }}</p>
    </template>`,
  template = `
   <BaseGrid :items="items" :columns="columns">
      <template #default="{ item }">
        <p data-test="default-slot">{{ item.modelName }}</p>
      </template>
      ${customItemSlot ?? ''}
   </BaseGrid>`
}: BaseGridRenderOptions = {}): BaseGridComponentAPI {
  const searchResponse = getSearchResponseStub();
  const defaultItems = [
    ...searchResponse.banners!,
    ...searchResponse.promoteds!,
    ...searchResponse.results,
    {
      modelName: 'NextQueriesGroup',
      nextQueries: getNextQueriesStub()
    } as NextQueriesGroup
  ];

  mount(
    {
      components: {
        BaseGrid
      },
      props: ['items', 'columns'],
      template
    },
    {
      vue: Vue.extend({}),
      plugins: [[new XPlugin(new BaseXBus()), { adapter: e2eAdapter }]],
      propsData: {
        items: items ?? defaultItems,
        columns
      }
    }
  );

  return {
    getBaseGrid() {
      return cy.getByDataTest('grid');
    },
    getDefaultSlot() {
      return cy.getByDataTest('default-slot');
    },
    getScopedSlot(modelName: string) {
      return cy.getByDataTest(`${modelName}-slot`);
    }
  };
}

describe('testing BaseGrid', () => {
  it('allows configuring the number of columns and updates the css class accordingly', () => {
    const { getBaseGrid } = renderBaseGrid({ columns: 5 });
    getBaseGrid().should('have.class', 'x-grid--cols-5');
  });

  it('allows customizing the default slot', () => {
    const template = `
         <BaseGrid :items="items" :columns="columns">
           <template #default="{ item }">
             <p data-test="default-slot-overridden">{{ item.modelName }}</p>
           </template>
         </BaseGrid>`;
    renderBaseGrid({ template });
    cy.getByDataTest('default-slot-overridden').should('exist');
  });

  it('allows customizing named slots', () => {
    const customItemSlot = `
      <template #banner="{ item }">
        <p data-test="banner-slot">{{ item.modelName }}</p>
      </template>`;
    const { getDefaultSlot, getScopedSlot } = renderBaseGrid({
      customItemSlot
    });

    getDefaultSlot().should('exist');
    getScopedSlot('result').should('not.exist');
    getScopedSlot('banner').should('exist');
  });

  it('allows customizing named slots only using kebab case', () => {
    const { getScopedSlot } = renderBaseGrid({
      customItemSlot: `
        <template #banner="{ item }">
          <p data-test="banner-slot">{{ item.modelName }}</p>
        </template>
        <template #NextQueriesGroup="{ item }">
          <p data-test="NextQueriesGroup-slot">{{ item.modelName }}</p>
        </template>
        <template #next-queries-group="{ item }">
          <p data-test="next-queries-group-slot">{{ item.modelName }}</p>
        </template>`
    });

    getScopedSlot('banner').should('exist');
    getScopedSlot('NextQueriesGroup').should('not.exist');
    getScopedSlot('next-queries-group').should('exist');
  });
});

interface BaseGridRenderOptions {
  columns?: number;
  items?: ListItem[];
  customItemSlot?: string;
  template?: string;
}

interface BaseGridComponentAPI {
  getBaseGrid: () => Cypress.Chainable<JQuery>;
  getDefaultSlot: () => Cypress.Chainable<JQuery>;
  getScopedSlot: (modelName: string) => Cypress.Chainable<JQuery>;
}
