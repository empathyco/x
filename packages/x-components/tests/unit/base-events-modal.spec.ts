import { mount } from '@cypress/vue';
import Vue from 'vue';
import BaseEventsModalClose from '../../src/components/modals/base-events-modal-close.vue';
import BaseEventsModalOpen from '../../src/components/modals/base-events-modal-open.vue';
import BaseEventsModal from '../../src/components/modals/base-events-modal.vue';
import { BaseXBus } from '../../src/plugins/x-bus';
import { XPlugin } from '../../src/plugins/x-plugin';
import { XEvent } from '../../src/wiring/events.types';
import { e2eAdapter } from '../../src/adapter/e2e-adapter';

/**
 * Mounts a {@link BaseEventsModal} component with the provided options and offers an API to easily
 * test it.
 *
 * @param options - The options to render the component with.
 * @returns An API to test the component.
 */
function mountBaseEventsModal({
  bodyClickEvent,
  eventsToCloseModal,
  eventsToOpenModal
}: MountBaseEventsModalOptions = {}): MountBaseEventsModalAPI {
  cy.viewport(1920, 200);
  mount(
    {
      components: {
        BaseEventsModal,
        BaseEventsModalOpen,
        BaseEventsModalClose
      },
      template: `
        <div>
          <BaseEventsModalOpen>Start</BaseEventsModalOpen>
          <BaseEventsModal>
            <h1> Base Events Modal </h1>
            <BaseEventsModalClose>Close</BaseEventsModalClose>
          </BaseEventsModal>
        </div>
      `
    },
    {
      vue: Vue.extend({}),
      plugins: [[new XPlugin(new BaseXBus()), { adapter: e2eAdapter }]],
      propsData: { bodyClickEvent, eventsToCloseModal, eventsToOpenModal }
    }
  );

  const getModalContent = (): Cypress.Chainable<JQuery> => {
    return cy.getByDataTest('modal-content');
  };

  return {
    getModalContent,
    clickOpenModal() {
      cy.getByDataTest('open-modal').click();
    },
    clickCloseModal() {
      cy.getByDataTest('close-modal').click();
    },
    clickInModal() {
      getModalContent().click();
    },
    clickOutsideModal() {
      cy.getByDataTest('modal').click('bottom');
    }
  };
}

describe('testing Base Events Modal component', () => {
  it('modal opens, remains open when clicked, and closes when clicked out of its bounds', () => {
    const { clickOpenModal, clickInModal, clickOutsideModal, getModalContent } =
      mountBaseEventsModal();

    clickOpenModal();
    getModalContent().should('exist');

    clickInModal();
    getModalContent().should('exist');

    clickOutsideModal();
    getModalContent().should('not.exist');
  });

  it('Modal closes when clicking the close button', () => {
    const { clickOpenModal, clickCloseModal, getModalContent } = mountBaseEventsModal();

    clickOpenModal();
    getModalContent().should('exist');

    clickCloseModal();
    getModalContent().should('not.exist');
  });
});

interface MountBaseEventsModalOptions {
  /** The event that should be emitted when the body is clicked. */
  bodyClickEvent?: XEvent;
  /** Events that when emitted should close the modal. */
  eventsToCloseModal?: XEvent[];
  /** Events that when emitted should open the modal. */
  eventsToOpenModal?: XEvent[];
}

interface MountBaseEventsModalAPI {
  /** Clicks anywhere in the modal. */
  clickInModal: () => void;
  /** Clicks outside the modal. */
  clickOutsideModal: () => void;
  /** Clicks the button for opening the modal. */
  clickOpenModal: () => void;
  /** Clicks the button for closing the modal. */
  clickCloseModal: () => void;
  /** Retrieves the modal content. */
  getModalContent: () => Cypress.Chainable<JQuery>;
}
