import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, inject } from 'vue';
import { FeatureLocation } from '../../types';
import LocationProvider from '../location-provider.vue';

const Child = defineComponent({
  name: 'Child',
  template: `{{ injectedLocation }}`,
  setup() {
    const injectedLocation = inject<FeatureLocation>('location');
    return { injectedLocation };
  }
});

/**
 * Renders the {@link LocationProvider} component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 *
 * @returns The API for testing the `LocationProvider` component.
 */
function renderLocationProvider({ location = '' } = {}) {
  const wrapper = mount(
    {
      components: {
        LocationProvider,
        Child
      },
      template: `
        <LocationProvider :location="location">
          <Child />
        </LocationProvider>`
    },
    {
      props: { location }
    }
  );

  return {
    child: wrapper.findComponent(Child)
  };
}

describe('testing LocationProvider component', () => {
  it('provides a location to its child', () => {
    const { child } = renderLocationProvider({ location: 'external' });

    expect(child.html()).toBe('external');
  });
});
