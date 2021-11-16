import { mount, Wrapper, VueClass } from '@vue/test-utils';
import Vue from 'vue';
import { Component, Inject } from 'vue-property-decorator';
import { getDataTestSelector } from '../../__tests__/utils';
import { FeatureLocation } from '../../types';
import LocationInjector from '../location-injector.vue';

@Component({
  template: `<div data-test="inject"/>`
})
class Child extends Vue {
  @Inject('location')
  public location!: FeatureLocation;
}

/**
 * Renders the `LocationInjector` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
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
    child: wrapper.find(getDataTestSelector('inject') as VueClass<Child>)
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

/**
 * Options to configure how the progress bar component should be rendered.
 */
interface RenderLocationInjectorOptions {
  /** The location to inject. */
  location: FeatureLocation;
}

/**
 * Options to configure how the location injector component should be rendered.
 */
interface RenderLocationInjectorAPI {
  /** The wrapper for the child component inside the location injector. */
  child: Wrapper<Child>;
}
