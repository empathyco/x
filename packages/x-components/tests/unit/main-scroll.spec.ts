import { mount } from '@cypress/vue';
import 'reflect-metadata';
import Vue from 'vue';
import { mockedAdapter } from '../../src/adapter/mocked-adapter';
import Scroll from '../../src/x-modules/scroll/components/scroll.vue';
import MainScrollItem from '../../src/x-modules/scroll/components/main-scroll-item.vue';
import MainScroll from '../../src/x-modules/scroll/components/main-scroll.vue';
import { XPlugin, xPlugin } from '../../src/plugins/x-plugin';
import { UrlParams } from '../../src/types/url-params';

/**
 * Renders a {@link MainScroll} component with the provided options.
 *
 * @param options - The options to render this component with.
 * @returns An API to test the {@link MainScroll} component.
 */
function renderMainScroll({ itemsCount = 10 }: RenderMainScrollOptions = {}): RenderMainScrollAPI {
  cy.spy(XPlugin.bus, 'emit');

  return mount(
    {
      components: {
        Scroll,
        MainScroll,
        MainScrollItem
      },
      template: `
        <MainScroll style="height:200px">
          <Scroll>
            <MainScrollItem
              v-for="item in items"
              tag="article"
              :item="item"
              :data-test="item.id"
              style="height:50px">
              {{ item.id }}
            </MainScrollItem>
          </Scroll>
        </MainScroll>
      `,
      data() {
        return {
          items: Array.from({ length: itemsCount }, (_, index) => ({ id: `item-${index}` }))
        };
      }
    },
    {}
  );
  return {};
}

before(() => {
  Vue.use(xPlugin, { adapter: mockedAdapter });
});

/* eslint-disable @typescript-eslint/unbound-method */
describe('testing MainScroll component', () => {
  it('emits the first visible element', () => {
    renderMainScroll();
    cy.wrap(XPlugin.bus.emit)
      .should('have.been.calledOnce')
      .should('have.been.calledWith', 'UserScrolledToElement', 'item-0');
    cy.getByDataTest('item-5').scrollIntoView({ easing: 'linear', duration: 100 });
    cy.wrap(XPlugin.bus.emit).should('have.been.calledWith', 'UserScrolledToElement', 'item-5');
  });

  it('restores the scroll', () => {
    renderMainScroll();
    XPlugin.bus.emit('ParamsLoadedFromUrl', <UrlParams>{ scroll: 'item-5' });
    cy.getByDataTest('item-5')
      .scrollIntoView({ easing: 'linear', duration: 100 })
      .should('be.visible');
    cy.getByDataTest('base-scroll').then($scroll => {
      cy.getByDataTest('item-5').should($item5 => {
        expect($item5.position().top).to.be.gte($scroll.position().top);
      });
      cy.getByDataTest('item-4').should($item4 => {
        const item4Bottom = $item4.position().top + $item4.outerHeight()!;
        expect(item4Bottom).to.be.lte($scroll.position().top);
      });
    });
  });
});

/**
 * Options to render the {@link MainScroll} component with.
 */
interface RenderMainScrollOptions {
  itemsCount?: number;
}

/**
 * Test API for the {@link MainScroll} component.
 */
interface RenderMainScrollAPI {}
