import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import BaseResultLink from '../../../../components/result/base-result-link.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import Recommendations from '../recommendations.vue';
import { resetXRecommendationsStateWith } from './utils';

describe('testing recommendations component', () => {
  const recommendations = getResultsStub();

  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  let recommendationsWrapper: Wrapper<Vue>;

  beforeEach(() => {
    recommendationsWrapper = mount(Recommendations, { localVue, store });
    resetXRecommendationsStateWith(store, { recommendations });
  });

  it('is an XComponent which has an XModule', () => {
    expect(isXComponent(recommendationsWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(recommendationsWrapper.vm)).toBe('recommendations');
  });

  it('renders a button & a custom BaseResultLink', () => {
    const wrapperComponent = {
      template: `
        <Recommendations>
          <template #default="{ recommendation }">
            <BaseResultLink :result="recommendation" class="x-result-link">
              <template #default="{ result }">
                <img :src="result.images[0]" class="x-result_image" data-test="image"/>
                <span class="x-result__title" data-test="title">{{ result.name }}</span>
              </template>
            </BaseResultLink>
            <button data-test="custom-button">Custom Behaviour</button>
          </template>
        </Recommendations>
      `,
      components: {
        Recommendations,
        BaseResultLink
      }
    };

    recommendationsWrapper = mount(wrapperComponent, {
      localVue,
      store
    });

    expect(recommendationsWrapper.findComponent(BaseResultLink)).toBeDefined();

    const spanList = findAllByTestDataId(recommendationsWrapper, 'title');
    const imageList = findAllByTestDataId(recommendationsWrapper, 'image');
    const customButtonList = findAllByTestDataId(recommendationsWrapper, 'custom-button');

    recommendations.forEach((result, index) => {
      expect(spanList.at(index).element.innerHTML).toEqual(result.name);
      expect(imageList.at(index).attributes('src')).toEqual(result.images[0]);
      expect(customButtonList.at(index).text()).toEqual('Custom Behaviour');
    });
  });

  it('does not render any Recommendation if the are none', async () => {
    resetXRecommendationsStateWith(store);

    await localVue.nextTick();

    expect(recommendationsWrapper.html()).toEqual('');
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

    await recommendationsWrapper.setProps({ animation });

    expect(recommendationsWrapper.findComponent(animation).exists()).toBeTruthy();
    expect(recommendationsWrapper.find('ul.test-animation')).toBeTruthy();
  });

  it('injects custom events for the recommendations', () => {
    const RecommendationResult = Vue.extend({
      inject: ['resultClickExtraEvents'],
      render(h) {
        return h();
      }
    });

    recommendationsWrapper = mount(
      {
        template: `
        <Recommendations>
            <RecommendationResult />
        </Recommendations>
      `,
        components: {
          Recommendations,
          RecommendationResult
        }
      },
      { localVue, store }
    );

    const recommendationResult = recommendationsWrapper.findComponent(RecommendationResult);
    expect(recommendationResult.exists()).toBeTruthy();
    expect((recommendationResult.vm as any).resultClickExtraEvents).not.toHaveLength(0);
  });

  function findAllByTestDataId(wrapper: Wrapper<Vue>, testDataId: string): WrapperArray<Vue> {
    return wrapper.findAll(getDataTestSelector(testDataId));
  }
});
