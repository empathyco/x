import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { Component, Inject } from 'vue-property-decorator';
import { FeatureLocation } from '../../types';
import LocationProvider from '../location-provider.vue';

@Component({
  template: `<button/>`
})
class Child extends Vue {
  @Inject('location')
  public location!: FeatureLocation;
}

/**
 * Renders the {@link LocationProvider} component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 *
 * @returns The API for testing the `LocationProvider` component.
 */
function renderLocationProvider({
  location
}: RenderLocationProviderOptions): RenderLocationProviderAPI {
  const wrapper = mount(
    {
      components: {
        LocationProvider,
        Child
      },
      template: `
        <LocationProvider :location="location">
          <Child />
        </LocationProvider>`,
      props: ['location']
    },
    {
      propsData: {
        location
      }
    }
  );

  return {
    child: wrapper.findComponent<Child>(Child)
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
}

interface RenderLocationProviderAPI {
  /** The wrapper for the child component inside the location provider. */
  child: Wrapper<Child>;
}
