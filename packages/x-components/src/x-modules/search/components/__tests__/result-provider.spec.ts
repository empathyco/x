import Vue, { VueConstructor } from 'vue';
import { Component, Inject, Prop } from 'vue-property-decorator';
import { mount, Wrapper } from '@vue/test-utils';
import { Result } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import ResultProvider from '../result-provider.vue';
import { createResultStub } from '../../../../__stubs__/index';
import { getDataTestSelector } from '../../../../__tests__/utils';

const renderResultProvider = ({
  result = createResultStub('jacket'),
  template = '',
  components = {}
}: ResultProviderOptions = {}): ResultProviderApi => {
  const wrapper = mount(
    {
      template: `<ResultProvider :result="result" #default="{ result }">
          ${template}
        </ResultProvider>`,
      components: {
        ResultProvider,
        ...components
      }
    },
    {
      props: ['result'],
      propsData: {
        result
      },
      scopedSlots: {
        default: () => {
          return template;
        }
      }
    }
  );

  return {
    wrapper: wrapper.findComponent(ResultProvider)
  };
};

describe('result with variants provider', () => {
  @Component({
    template: `
      <div>
        <button data-test="set-red-jacket" @click="setResultVariant(0, 0)">Change variant</button>
        <button data-test="set-red-xl-jacket" @click="setResultVariant(1, 1)">
          Change variant
        </button>
        <span data-test="result-name">{{ result.name }}</span>
        <span data-test="result-image" v-if="result.images">
          {{ result.images[0] }}
        </span>
      </div>
    `
  })
  class Child extends Vue {
    @Inject('setResultVariant')
    public setResultVariant!: () => void;

    @Prop()
    public result!: Result;
  }

  it('exposes the result in the default slot', () => {
    const template = `
      <span data-test="result-name">{{result.name}}</span>
    `;
    const result = createResultStub('tshirt');
    const { wrapper } = renderResultProvider({ result, template });
    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('tshirt');
  });

  it('provides a callback to set the selected variant', async () => {
    const result = createResultStub('jacket', {
      variants: [
        {
          name: 'red jacket',
          images: ['red-jacket-image'],
          variants: [
            {
              name: 'red jacket XL'
            },
            {
              name: 'red jacket L'
            }
          ]
        },
        {
          name: 'blue jacket',
          images: ['blue-jacket-image'],
          variants: [
            {
              name: 'blue jacket L'
            }
          ]
        }
      ]
    });

    const { wrapper } = renderResultProvider({
      result,
      template: `<Child :result="result"/>`,
      components: { Child }
    });
    const setRedJacketButton = wrapper.find(getDataTestSelector('set-red-jacket'));
    const setRedJacketXlButton = wrapper.find(getDataTestSelector('set-red-xl-jacket'));

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('jacket');

    await setRedJacketButton.trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket');

    await setRedJacketXlButton.trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket L');

    await setRedJacketButton.trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket L');
  });
});

interface ResultProviderOptions {
  result?: Result;
  template?: string;
  components?: Dictionary<VueConstructor>;
}

interface ResultProviderApi {
  wrapper: Wrapper<Vue>;
}
