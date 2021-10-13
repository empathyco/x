import { Result } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { AnyFunction, DeepPartial } from '../../../../utils/types';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import Recommendations from '../recommendations.vue';
import { resetXRecommendationsStateWith } from './utils';

/**
 * Mounts the `Recommendations` component and exposes a basic API for testing.
 *
 * @param options - The options to mount the component with.
 * @returns The API for testing the `Recommendations` component.
 */
function mountRecommendations({
  recommendations = getResultsStub(),
  scopedSlots = {
    default: `
      <span data-test="default-slot" slot-scope="{ recommendation }">
        {{ recommendation.name }}
      </span>
    `
  }
}: MountRecommendationsOptions = {}): MountRecommendationsAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  resetXRecommendationsStateWith(store, { recommendations });

  const wrapper = mount(Recommendations, {
    localVue,
    store,
    scopedSlots
  });

  return {
    wrapper,
    recommendations,
    isScopedSlotOverridden(selector) {
      return wrapper.find(getDataTestSelector(selector)).exists();
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
    expect(wrapper.html()).toEqual('');
  });

  it('allows changing the animation with a transition group', async () => {
    const animation = Vue.extend({
      render(h) {
        return h(
          'transition-group',
          { attrs: this.$attrs, staticClass: 'test-animation' },
          this.$slots.default
        );
      }
    });
    const { wrapper } = mountRecommendations();

    await wrapper.setProps({ animation });

    expect(wrapper.findComponent(animation).exists()).toBe(true);
    expect(wrapper.find('.test-animation').exists()).toBe(true);
  });

  it('allows customizing the default slot', () => {
    const { wrapper, recommendations } = mountRecommendations({
      scopedSlots: {
        default: `
          <span data-test="custom-default-slot" slot-scope="{ recommendation }">
            {{ recommendation.name }}
          </span>
        `
      }
    });

    const renderedRecommendations = findTestDataById(wrapper, 'custom-default-slot');

    expect(renderedRecommendations).toHaveLength(recommendations.length);
    recommendations.forEach((recommendation, index) => {
      expect(renderedRecommendations.at(index).text()).toEqual(recommendation.name);
    });
  });

  it('allows customizing the layout slot', () => {
    const { isScopedSlotOverridden } = mountRecommendations({
      scopedSlots: {
        layout: `
          <ul data-test="custom-layout" slot-scope="{ recommendations }">
            <li v-for="recommendation in recommendations" data-test="custom-recommendation">
              {{ recommendation.name }}
            </li>
          </ul>
        `
      }
    });

    expect(isScopedSlotOverridden('custom-layout')).toBe(true);
  });

  // eslint-disable-next-line max-len
  it('renders at most the number of recommendations defined by `maxItemsToRender` prop', async () => {
    const { wrapper, recommendations } = mountRecommendations();

    const renderedRecommendations = (): WrapperArray<Vue> =>
      findTestDataById(wrapper, 'recommendation-item');

    await wrapper.setProps({ maxItemsToRender: 2 });
    expect(renderedRecommendations()).toHaveLength(2);

    await wrapper.setProps({ maxItemsToRender: 3 });
    expect(renderedRecommendations()).toHaveLength(3);

    await wrapper.setProps({ maxItemsToRender: 5 });
    expect(renderedRecommendations()).toHaveLength(recommendations.length);
  });

  function findTestDataById(wrapper: Wrapper<Vue>, testDataId: string): WrapperArray<Vue> {
    return wrapper.findAll(getDataTestSelector(testDataId));
  }
});

interface MountRecommendationsOptions {
  /** The `recommendations` to render. */
  recommendations?: Result[];
  /** The scoped slots to render. */
  scopedSlots?: Record<string, string | AnyFunction>;
}

interface MountRecommendationsAPI {
  /** The wrapper for the `Recommendations` component. */
  wrapper: Wrapper<Vue>;
  /** The rendered `recommendations`. */
  recommendations: Result[];
  /** Check if a scoped slot is overridden. */
  isScopedSlotOverridden: (selector: string) => boolean;
}
