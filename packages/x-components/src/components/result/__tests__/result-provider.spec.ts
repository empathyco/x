import Vue, { VueConstructor } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { mount, Wrapper } from '@vue/test-utils';
import { Result } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import ResultProvider from '../result-provider.vue';
import { createResultStub } from '../../../__stubs__/results-stubs.factory';
import { findTestDataById, getDataTestSelector } from '../../../__tests__/utils';
import { XInject } from '../../decorators/injection.decorators';
import {
  RESULT_KEY,
  SELECTED_VARIANTS_INDEXES_KEY,
  SET_RESULT_VARIANT_KEY
} from '../../decorators/injection.consts';

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
        <slot
          :setResultVariant="setResultVariant"
          :originalResult="originalResult"
          :selectedIndexes="selectedIndexes"
        ></slot>
      </div>
    `
  })
  class Child extends Vue {
    @XInject(SET_RESULT_VARIANT_KEY)
    public setResultVariant!: () => void;

    @XInject(RESULT_KEY)
    public originalResult!: Result;

    @XInject(SELECTED_VARIANTS_INDEXES_KEY)
    public selectedIndexes!: number[];

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
      template: `
        <Child :result="result" #default="{setResultVariant}">
          <button data-test="set-red-jacket" @click="setResultVariant(0, 0)">Change variant</button>
          <button data-test="set-red-xl-jacket" @click="setResultVariant(1, 1)">
            Change variant
          </button>
          <span data-test="result-name">{{ result.name }}</span>
        </Child>
      `,
      components: { Child }
    });
    const setRedJacketButton = wrapper.find(getDataTestSelector('set-red-jacket'));
    const setRedJacketXlButton = wrapper.find(getDataTestSelector('set-red-xl-jacket'));

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('jacket');

    await setRedJacketButton.trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket');

    await setRedJacketXlButton.trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket L');

    // It won't deselect the child variant if the parent is clicked.

    await setRedJacketButton.trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket L');
  });

  it('provides the original result', async () => {
    const { wrapper } = renderResultProvider({
      result: createResultStub('tshirt', {
        variants: [
          {
            name: 'black tshirt'
          },
          {
            name: 'white tshirt'
          }
        ]
      }),
      template: `
        <Child :result="result" #default="{originalResult, setResultVariant, selectedIndexes}">
          <button data-test="variant-button" @click="setResultVariant(0, 0)">
            Select black shirt
          </button>
          <span data-test="result-name">{{ result.name }}</span>
          <span data-test="original-result-name">{{ originalResult.name }}</span>
        </Child>
      `,
      components: { Child }
    });
    const button = wrapper.find(getDataTestSelector('variant-button'));
    await button.trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('black tshirt');
    expect(wrapper.find(getDataTestSelector('original-result-name')).text()).toBe('tshirt');
  });

  it('provides the selected indexes', async () => {
    const { wrapper } = renderResultProvider({
      result: createResultStub('shoes', {
        variants: [
          {
            name: 'white shoes'
          },
          {
            name: 'black shoes'
          }
        ]
      }),
      template: `
        <Child :result="result" #default="{setResultVariant, selectedIndexes}">
          <button data-test="variant-button" @click="setResultVariant(0, 0)">Select 0</button>
          <button data-test="variant-button" @click="setResultVariant(0, 1)">Select 1</button>
          <span data-test="selectedIndex">{{ selectedIndexes[0] }}</span>
        </Child>
      `,
      components: { Child }
    });

    const buttons = findTestDataById(wrapper, 'variant-button');
    const selectedIndex = wrapper.find(getDataTestSelector('selectedIndex'));

    expect(selectedIndex.text()).toBe('');

    await buttons.at(0).trigger('click');

    expect(selectedIndex.text()).toBe('0');

    await buttons.at(1).trigger('click');

    expect(selectedIndex.text()).toBe('1');
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
