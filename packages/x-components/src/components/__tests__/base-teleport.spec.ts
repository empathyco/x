import { mount, VueWrapper } from '@vue/test-utils';
import BaseTeleport from '../base-teleport.vue';

function renderBaseTeleport({
  target,
  visible = false,
  slotContent = '<div>Teleport Content</div>'
}: RenderBaseTeleportOptions): RenderBaseTeleportApi {
  const wrapper = mount(BaseTeleport, {
    props: { target, visible },
    slots: { default: slotContent }
  });

  return { wrapper };
}

describe('testing BaseTeleport component', () => {
  let targetElement: HTMLElement;

  beforeEach(() => {
    targetElement = document.createElement('div');
    targetElement.id = 'teleport-target';
    document.body.appendChild(targetElement);
  });

  afterEach(() => {
    document.body.removeChild(targetElement);
  });

  it('renders content in the target element when visible is true', () => {
    renderBaseTeleport({ target: '#teleport-target', visible: true });

    expect(targetElement.querySelector('.x-base-teleport')).not.toBeNull();
    expect(targetElement.textContent).toContain('Teleport Content');
  });

  it('does not render content in the target element when visible is false', () => {
    renderBaseTeleport({ target: '#teleport-target', visible: false });

    expect(targetElement.querySelector('.x-base-teleport')).toBeNull();
    expect(targetElement.textContent).not.toContain('Teleport Content');
  });

  it('toggles content visibility when the visible prop changes', async () => {
    const { wrapper } = renderBaseTeleport({
      target: '#teleport-target',
      visible: false
    });

    expect(targetElement.querySelector('.x-base-teleport')).toBeNull();

    await wrapper.setProps({ visible: true });
    expect(targetElement.querySelector('.x-base-teleport')).not.toBeNull();

    await wrapper.setProps({ visible: false });
    expect(targetElement.querySelector('.x-base-teleport')).toBeNull();
  });
});

interface RenderBaseTeleportOptions {
  /**
   * The target selector for the teleport.
   */
  target: string;
  /**
   * Whether the content is visible.
   */
  visible?: boolean;
  /**
   * The content to render in the slot.
   */
  slotContent?: string;
}

interface RenderBaseTeleportApi {
  /**
   * The wrapper testing component instance.
   */
  wrapper: VueWrapper;
}
