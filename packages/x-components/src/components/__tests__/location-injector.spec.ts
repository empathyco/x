import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { Component, Inject } from 'vue-property-decorator';
import { FeatureLocation } from '../../types';
import LocationInjector from '../location-injector.vue';

@Component({
  template: `<button/>`
})
class Child extends Vue {
  @Inject('location')
  public location!: FeatureLocation;
}

/**
 * Renders the {@link LocationInjector} component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 *
 * @returns The API for testing the `LocationInjector` component.
 */
function renderLocationInjector({
  location
}: RenderLocationInjectorOptions): RenderLocationInjectorAPI {
  const wrapper = mount(
    {
      components: {
        LocationInjector,
        Child
      },
      template: `
        <LocationInjector :location="location">
          <Child />
        </LocationInjector>`,
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

describe('testing LocationInjector component', () => {
  it('provides a location to its child', () => {
    const { child } = renderLocationInjector({
      location: 'external'
    });

    expect(child.vm.location).toBe('external');
  });
});

interface RenderLocationInjectorOptions {
  /** The location to inject. */
  location: FeatureLocation;
}

interface RenderLocationInjectorAPI {
  /** The wrapper for the child component inside the location injector. */
  child: Wrapper<Child>;
}
