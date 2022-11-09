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
  referenceSelector = '',
  clientHeaderHeight = {
    desktop: 0,
    tablet: 0,
    mobile: 0
  },
  template = `
      <div class="wrapper">
        <div class="header"></div>
        <BaseModal :referenceSelector="referenceSelector" :open="true" />
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
      props: ['referenceSelector']
    },
    {
      vue: Vue.extend({}),
      plugins: [[new XPlugin(new BaseXBus()), { adapter: e2eAdapter }]],
      propsData: {
        referenceSelector
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
  it('places the modal at the top of the page if referenceSelector is not defined', () => {
    const { getBaseModal } = renderBaseModal();
    getBaseModal().should($modal => expect($modal.position().top).to.be.eq(0));
  });

  it('places the modal under the defined referenceSelector', () => {
    const options = {
      clientHeaderHeight: { desktop: 100, tablet: 0, mobile: 0 },
      referenceSelector: '.header'
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
      referenceSelector: '.header'
    };
    const { getBaseModal } = renderBaseModal(options);

    cy.log('Viewport in desktop resolution');
    getBaseModal().should($modal =>
      expect($modal.position().top).to.be.eq(options.clientHeaderHeight.desktop)
    );

    cy.log('Viewport in mobile resolution');
    cy.viewport('iphone-8');
    getBaseModal().should($modal =>
      expect($modal.position().top).to.be.eq(options.clientHeaderHeight.mobile)
    );

    cy.log('Viewport in tablet resolution');
    cy.viewport('ipad-2');
    getBaseModal().should($modal =>
      expect($modal.position().top).to.be.eq(options.clientHeaderHeight.tablet)
    );
  });

  // eslint-disable-next-line max-len
  it('calculates where to place the modal even if there are more elements on the selected element', () => {
    const preHeaderHeight = 300;
    const options = {
      clientHeaderHeight: { desktop: 100, tablet: 0, mobile: 0 },
      referenceSelector: '.header',
      template: `
                  <div class="wrapper">
                    <div class="pre-header" style="height: ${preHeaderHeight}px"></div>
                    <div class="header"></div>
                    <BaseModal :referenceSelector="referenceSelector" :open="true" />
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
  referenceSelector?: string;
  /**
   * The client header height for each device.
   */
  clientHeaderHeight?: Record<'desktop' | 'tablet' | 'mobile', number>;
  /**
   * The template to render.
   */
  template?: string;
}

interface RenderBaseModalAPI {
  /** Retrieves the base modal. */
  getBaseModal: () => Cypress.Chainable<JQuery>;
}
