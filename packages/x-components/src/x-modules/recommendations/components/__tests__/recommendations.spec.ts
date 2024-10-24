import { Result } from '@empathyco/x-types';
import { AnyFunction, DeepPartial } from '@empathyco/x-utils';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { nextTick, h, defineComponent } from 'vue';
import { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import Recommendations from '../recommendations.vue';
import { recommendationsXModule } from '../../x-module';
import { resetXRecommendationsStateWith } from './utils';

/**
 * Mounts the `Recommendations` component and exposes a basic API for testing.
 *
 * @param options - The options to mount the component with.
 * @returns The API for testing the `Recommendations` component.
 */
function mountRecommendations({
  recommendations = getResultsStub(),
  slots = {
    default: `
      <span data-test="default-slot" slot="{ recommendation }">
        {{ recommendation.name }}
      </span>
    `
  }
}: MountRecommendationsOptions = {}): MountRecommendationsAPI {
  const store = new Store<DeepPartial<RootXStoreState>>({});

  const wrapper = mount(Recommendations, {
    global: {
      plugins: [installNewXPlugin({ store, initialXModules: [recommendationsXModule] })]
    },
    store,
    slots
  });

  resetXRecommendationsStateWith(store, { recommendations });

  return {
    wrapper,
    recommendations,
    isScopedSlotOverridden(selector) {
      return wrapper.find(getDataTestSelector(selector)).exists();
    },
    getDefaultRecommendations() {
      return wrapper.findAll(getDataTestSelector('recommendation-item'));
    }
  };
}

describe('testing recommendations component', () => {
  it('is an XComponent and belongs to the recommendations module', () => {
    const { wrapper } = mountRecommendations();

    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('recommendations');
  });

  it('does not render recommendations when the list is empty', () => {
    const { wrapper } = mountRecommendations({ recommendations: [] });
    expect(wrapper.text()).toEqual('');
  });

  it('allows changing the animation with a transition group', async () => {
    const { wrapper } = mountRecommendations();
    const animation = defineComponent({
      render() {
        return h(
          'transition-group',
          { attrs: this.$attrs, class: 'test-animation' },
          this.$slots.default
        );
      }
    });

    await wrapper.setProps({ animation });

    expect(wrapper.findComponent(animation).exists()).toBe(true);
    expect(wrapper.find('.test-animation').exists()).toBe(true);
  });

  it('allows customizing the default slot', async () => {
    const { wrapper, recommendations } = mountRecommendations({
      slots: {
        default: `
          <span data-test="custom-default-slot" slot="{ recommendation }">
            {{ recommendation.name }}
          </span>
        `
      }
    });

    await nextTick();
    const renderedRecommendations = wrapper.findAll(getDataTestSelector('custom-default-slot'));

    expect(renderedRecommendations).toHaveLength(recommendations.length);
    recommendations.forEach((recommendation, index) => {
      expect(renderedRecommendations.at(index)?.text()).toEqual(recommendation.name);
    });
  });

  it('allows customizing the layout slot', async () => {
    const { isScopedSlotOverridden } = mountRecommendations({
      slots: {
        layout: `
          <ul data-test="custom-layout" slot="{ recommendations }">
            <li v-for="recommendation in recommendations" data-test="custom-recommendation">
              {{ recommendation.name }}
            </li>
          </ul>
        `
      }
    });
    await nextTick();
    expect(isScopedSlotOverridden('custom-layout')).toBe(true);
  });

  // eslint-disable-next-line max-len
  it('renders at most the number of recommendations defined by `maxItemsToRender` prop', async () => {
    const { wrapper, recommendations, getDefaultRecommendations } = mountRecommendations();

    await nextTick();
    expect(getDefaultRecommendations()).toHaveLength(recommendations.length);

    await wrapper.setProps({ maxItemsToRender: recommendations.length - 1 });
    expect(getDefaultRecommendations()).toHaveLength(recommendations.length - 1);

    await wrapper.setProps({ maxItemsToRender: recommendations.length });
    expect(getDefaultRecommendations()).toHaveLength(recommendations.length);

    await wrapper.setProps({ maxItemsToRender: recommendations.length + 1 });
    expect(getDefaultRecommendations()).toHaveLength(recommendations.length);
  });
});

interface MountRecommendationsOptions {
  /** The `recommendations` to render. */
  recommendations?: Result[];
  /** The scoped slots to render. */
  slots?: Record<string, string | AnyFunction>;
}

interface MountRecommendationsAPI {
  /** The wrapper for the `Recommendations` component. */
  wrapper: VueWrapper;
  /** The rendered `recommendations`. */
  recommendations: Result[];
  /** The default `recommendations`. */
  getDefaultRecommendations: () => DOMWrapper<Element>[];
  /** Check if a scoped slot is overridden. */
  isScopedSlotOverridden: (selector: string) => boolean;
}
