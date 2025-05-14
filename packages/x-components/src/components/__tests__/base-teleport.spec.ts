import { flushPromises, mount } from '@vue/test-utils'
import BaseTeleport from '../base-teleport.vue'

/**
 * Renders the `BaseTeleport` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @param options.target - The target element to teleport the content to.
 * @param options.slotContent - The content to be teleported.
 * @returns The API for testing the `BaseTeleport` component.
 */
function renderBaseTeleport({
  target,
  slotContent = '<div>Teleport Content</div>',
}: {
  target: string
  slotContent?: string
}) {
  const wrapper = mount(BaseTeleport, {
    props: { target },
    slots: { default: slotContent },
  })

  return { wrapper }
}

describe('testing BaseTeleport component', () => {
  let targetElement: HTMLElement

  beforeAll(() => {
    targetElement = document.createElement('div')
    targetElement.id = 'teleport-target'
    document.body.appendChild(targetElement)
  })

  it('renders content in the target element', async () => {
    renderBaseTeleport({ target: '#teleport-target' })

    await flushPromises()

    expect(targetElement.querySelector('.x-base-teleport')).not.toBeNull()
    expect(targetElement.textContent).toContain('Teleport Content')
  })

  it('does not render content if the target element does not exist', () => {
    renderBaseTeleport({ target: '#non-existent-target' })

    expect(document.querySelector('#non-existent-target .x-base-teleport')).toBeNull()
  })
})
