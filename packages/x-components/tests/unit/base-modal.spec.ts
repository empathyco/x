import { h, VNode } from 'vue';
import BaseModal from '../../src/components/modals/base-modal.vue';
import { loadCss } from './css.utils';

function render({
  referenceSelector = '',
  clientHeaderHeight = {
    desktop: 0,
    tablet: 0,
    mobile: 0
  },
  rootVNode = undefined as undefined | VNode
} = {}) {
  loadCss(`
    body { margin: 0; }
    .header { height: ${clientHeaderHeight.desktop}px; }
    @media only screen and (min-width: 320px) and (max-width: 480px) {
      .header { height: ${clientHeaderHeight.mobile}px; }
    }
    @media screen and (min-width: 481px) and (max-width: 1024px) {
      .header { height: ${clientHeaderHeight.tablet}px; }
    }
  `);

  cy.mount(
    () =>
      rootVNode ??
      h('div', { class: 'wrapper' }, [
        h('div', { class: 'header' }),
        h(BaseModal, { referenceSelector, open: true })
      ])
  );

  return {
    getBaseModal: () => cy.getByDataTest('modal')
  };
}

describe('Testing base modal', () => {
  it('places the modal at the top of the page if referenceSelector is not defined', () => {
    const { getBaseModal } = render();

    getBaseModal().should($modal => expect($modal.position().top).to.be.eq(0));
  });

  it('places the modal under the defined referenceSelector', () => {
    const options = {
      clientHeaderHeight: { desktop: 100, tablet: 0, mobile: 0 },
      referenceSelector: '.header'
    };
    const { getBaseModal } = render(options);
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
    const { getBaseModal } = render(options);

    cy.log('Viewport in desktop resolution');
    getBaseModal().should($modal =>
      expect($modal.position().top).to.be.eq(options.clientHeaderHeight.desktop)
    );

    cy.log('Viewport in mobile resolution');
    cy.viewport('iphone-x');
    getBaseModal().should($modal =>
      expect($modal.position().top).to.be.eq(options.clientHeaderHeight.mobile)
    );

    cy.log('Viewport in tablet resolution');
    cy.viewport('ipad-2');
    getBaseModal().should($modal =>
      expect($modal.position().top).to.be.eq(options.clientHeaderHeight.tablet)
    );
  });

  it('calculates where to place the modal even if there are more elements on the selected element', () => {
    const preHeaderHeight = 300;
    const referenceSelector = '.header';
    const options = {
      referenceSelector,
      clientHeaderHeight: { desktop: 100, tablet: 0, mobile: 0 },
      rootVNode: h('div', { class: 'wrapper' }, [
        h('div', { class: 'pre-header', style: `height: ${preHeaderHeight}px` }),
        h('div', { class: 'header' }),
        h(BaseModal, { referenceSelector, open: true })
      ])
    };
    const { getBaseModal } = render(options);

    getBaseModal().should($modal =>
      expect($modal.position().top).to.be.eq(options.clientHeaderHeight.desktop + preHeaderHeight)
    );
  });
});
