import { mount } from '@vue/test-utils';
import Vue from 'vue';
import GridItemsInjectionMixin from '../grid-items-injection.mixin';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';

describe('testing GridItemsInjectionMixin', () => {
  const resultsStub = getResultsStub();

  it('injects and provide items between nested components', () => {
    const parent = Vue.component('parent', {
      props: ['propItems'],
      template: '<div><slot /></div>',
      mixins: [GridItemsInjectionMixin]
    });

    const child = Vue.component('child', {
      template: '<div>{{ providedItems[0].id }},{{ providedItems[1].id }}</div>',
      mixins: [GridItemsInjectionMixin]
    });

    const wrapper = mount(
      {
        template: `
          <div>
            <parent :propItems="resultsStub[0]">
              <child :propItems="resultsStub[1]" />
            </parent>
          </div>
        `,
        components: {
          parent,
          child
        }
      },
      {
        data() {
          return {
            resultsStub
          };
        }
      }
    );

    expect(wrapper.text()).toEqual([resultsStub[0].id, resultsStub[1].id].join(','));
  });
});
