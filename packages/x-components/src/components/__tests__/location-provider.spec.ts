import { mount, Wrapper } from '@vue/test-utils';
import { defineComponent, inject } from 'vue';
import { FeatureLocation } from '../../types';
import LocationProvider from '../location-provider.vue';

const Child = defineComponent({
  setup() {
    const location = inject<FeatureLocation>('location');
    return {
      location
    };
  },
  template: '<button />'
});

/**
 * Renders the {@link LocationProvider} component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 *
 * @returns The API for testing the `LocationProvider` component.
 */
function renderLocationProvider({
  template = `<LocationProvider :location="location"><Child /></LocationProvider>`,
  location
}: RenderLocationProviderOptions): RenderLocationProviderAPI {
  const wrapper = mount(
    {
      components: {
        LocationProvider,
        Child
      },
      template,
      props: ['location']
    },
    {
      propsData: {
        location
      }
    }
  );

  return {
    child: wrapper.findComponent(Child)
  };
}

describe('testing LocationProvider component', () => {
  it('provides a location to its child', () => {
    const { child } = renderLocationProvider({
      location: 'external'
    });

    expect(child.vm.location).toBe('external');
  });
});

interface RenderLocationProviderOptions {
  /** The location to provide. */
  location: FeatureLocation;
  template?: string;
}

interface RenderLocationProviderAPI {
  /** The wrapper for the child component inside the location provider. */
  child: Wrapper<any>;
}
