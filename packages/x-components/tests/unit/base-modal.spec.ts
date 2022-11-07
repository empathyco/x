import { mount } from '@cypress/vue';
import Vue from 'vue';
import BaseModal from '../../src/components/modals/base-modal.vue';
import { BaseXBus } from '../../src/plugins/x-bus';
import { XPlugin } from '../../src/plugins/x-plugin';
import { e2eAdapter } from '../../src/adapter/e2e-adapter';

/**
 * Renders an {@link BaseModal} component with the provided options.
 *
 * @param  options - Options to render {@link BaseModal} with.
 * @returns Helper methods for the rendered {@link BaseModal}.
 */
function renderBaseModal({
  clientHeaderSelector = '',
  clientHeaderHeight = {},
  template = `
      <div class="wrapper">
        <div class="header"></div>
        <BaseModal :clientHeaderSelector="clientHeaderSelector" :open="open" />
      </div>
  `
}: RenderBaseModalOptions = {}): RenderBaseModalAPI {
  XPlugin.resetInstance();

  mount(
    {
      components: {
        BaseModal
      },
      template,
      props: ['clientHeaderSelector', 'open']
    },
    {
      vue: Vue.extend({}),
      plugins: [[new XPlugin(new BaseXBus()), { adapter: e2eAdapter }]],
      propsData: {
        clientHeaderSelector,
        open: true
      },
      style: `
        body {
          margin: 0;
        }
        .header {
          height: ${clientHeaderHeight.desktop}px;
        }
        @media only screen and (min-width: 320px) and (max-width: 480px) {
          .header {
            height: ${clientHeaderHeight.mobile}px;
          }
        }
        @media screen and (min-width: 481px) and (max-width: 1024px){
          .header {
            height: ${clientHeaderHeight.tablet}px;
          }
        }
        `
    }
  );

  return {
    getBaseModal() {
      return cy.getByDataTest('modal');
    }
  };
}

describe('Testing base modal', () => {
  it('places the modal at top if there is not a selector', () => {
    const { getBaseModal } = renderBaseModal();
    getBaseModal().should($modal => expect($modal.position().top).to.be.eq(0));
  });

  it('places the modal under the selector passed by prop', () => {
    const options = {
      clientHeaderHeight: { desktop: 100 },
      clientHeaderSelector: '.header'
    };
    const { getBaseModal } = renderBaseModal(options);
    getBaseModal().should($modal =>
      expect($modal.position().top).to.be.eq(options.clientHeaderHeight.desktop)
    );
  });

  it('updates position when resizing', () => {
    const options = {
      clientHeaderHeight: {
        mobile: 100,
        tablet: 400,
        desktop: 200
      },
      clientHeaderSelector: '.header'
    };
    const { getBaseModal } = renderBaseModal(options);
    // Starts in desktop
    getBaseModal().should($modal =>
      expect($modal.position().top).to.be.eq(options.clientHeaderHeight.desktop)
    );

    // Change to mobile
    cy.viewport('iphone-8');
    getBaseModal().should($modal =>
      expect($modal.position().top).to.be.eq(options.clientHeaderHeight.mobile)
    );

    // Change to tablet
    cy.viewport('ipad-2');
    getBaseModal().should($modal =>
      expect($modal.position().top).to.be.eq(options.clientHeaderHeight.tablet)
    );
  });

  // eslint-disable-next-line max-len
  it('calculates where to place the modal even if there are more elements on the selected element', () => {
    const preHeaderHeight = 300;
    const options = {
      clientHeaderHeight: { desktop: 100 },
      clientHeaderSelector: '.header',
      template: `
                  <div class="wrapper">
                    <div class="pre-header" style="height: 300px"></div>
                    <div class="header"></div>
                    <BaseModal :clientHeaderSelector="clientHeaderSelector" :open="open" />
                  </div>
      `
    };
    const { getBaseModal } = renderBaseModal(options);
    getBaseModal().should($modal =>
      expect($modal.position().top).to.be.eq(options.clientHeaderHeight.desktop + preHeaderHeight)
    );
  });
});

interface RenderBaseModalOptions {
  /**
   * The selector under which the modal is to be placed.
   */
  clientHeaderSelector?: string;
  /**
   * The client header height.
   */
  clientHeaderHeight?: Record<string, number>;
  /**
   * The template to render.
   */
  template?: string;
}

interface RenderBaseModalAPI {
  /** Retrieves the base modal. */
  getBaseModal: () => Cypress.Chainable<JQuery>;
}
