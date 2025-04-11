import { h } from 'vue'
import BaseEventsModalClose from '../../src/components/modals/base-events-modal-close.vue'
import BaseEventsModalOpen from '../../src/components/modals/base-events-modal-open.vue'
import BaseEventsModal from '../../src/components/modals/base-events-modal.vue'

function render() {
  cy.mount(() =>
    h('div', [
      h(BaseEventsModalOpen, 'Start'),
      h(BaseEventsModal, [h('h1', 'Base Events Modal'), h(BaseEventsModalClose, 'Close')]),
    ]),
  )

  const getModalContent = () => cy.getByDataTest('modal-content')

  return {
    getModalContent,
    clickOpenModal: () => cy.getByDataTest('open-modal').click(),
    clickCloseModal: () => cy.getByDataTest('close-modal').click(),
    clickInModal: () => getModalContent().click(),
    clickOutsideModal: () => cy.getByDataTest('modal').click('bottom'),
  }
}

describe('testing Base Events Modal component', () => {
  it('modal opens, remains open when clicked, and closes when clicked out of its bounds', () => {
    const { clickOpenModal, clickInModal, clickOutsideModal, getModalContent } = render()

    clickOpenModal()
    getModalContent().should('exist')

    clickInModal()
    getModalContent().should('exist')

    clickOutsideModal()
    getModalContent().should('not.exist')
  })

  it('modal closes when clicking the close button', () => {
    const { clickOpenModal, clickCloseModal, getModalContent } = render()

    clickOpenModal()
    getModalContent().should('exist')

    clickCloseModal()
    getModalContent().should('not.exist')
  })
})
