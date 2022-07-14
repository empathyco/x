import { mount, Wrapper } from '@vue/test-utils';
import BaseSwitch from '../base-switch.vue';

function renderBaseSwitch({ template, value }: RenderBaseSwitchOptions): RenderBaseSwitchApi {
  const wrapper = mount(
    {
      template,
      data() {
        return {
          value
        };
      }
    },
    { components: { BaseSwitch } }
  );

  return {
    wrapper
  };
}

describe('testing Switch component', () => {
  it('allows toggling the state', async () => {
    const { wrapper } = renderBaseSwitch({
      template: `<BaseSwitch :value="value" @change="value = !value" />`,
      value: false
    });

    expect(wrapper.attributes('role')).toBe('switch');
    expect(wrapper.attributes('aria-checked')).toBe('false');
    expect(wrapper.classes('x-switch--is-selected')).toBe(false);

    await wrapper.trigger('click');
    expect(wrapper.attributes('aria-checked')).toBe('true');
    expect(wrapper.classes('x-switch--is-selected')).toBe(true);
  });

  it('supports v-model syntax', async () => {
    const { wrapper } = renderBaseSwitch({
      template: `<BaseSwitch v-model="value" />`,
      value: false
    });
    expect(wrapper.attributes('role')).toBe('switch');
    expect(wrapper.attributes('aria-checked')).toBe('false');
    expect(wrapper.classes('x-switch--is-selected')).toBe(false);

    await wrapper.trigger('click');
    expect(wrapper.attributes('aria-checked')).toBe('true');
    expect(wrapper.classes('x-switch--is-selected')).toBe(true);
  });
});

interface RenderBaseSwitchOptions {
  /**
   * The template to render the switch with.
   */
  template: string;
  /**
   * The initial selected value of the switch.
   */
  value: boolean;
}

interface RenderBaseSwitchApi {
  /**
   * The wrapper testing component instance.
   */
  wrapper: Wrapper<Vue>;
}
