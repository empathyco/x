import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { mount, Wrapper } from '@vue/test-utils';
import { Result, ResultVariant } from '@empathyco/x-types';
import ResultProvider from '../result-provider.vue';
import { createResultStub } from '../../../__stubs__/results-stubs.factory';
import { findTestDataById, getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import { XInject } from '../../decorators/injection.decorators';
import {
  RESULT_KEY,
  SELECTED_VARIANTS_KEY,
  SET_RESULT_VARIANT_KEY
} from '../../decorators/injection.consts';
import { XPlugin } from '../../../plugins/index';

const renderResultProvider = ({
  result = createResultStub('jacket', {
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
  }),
  template = ''
}: ResultProviderOptions = {}): ResultProviderApi => {
  const [, localVue] = installNewXPlugin();

  @Component({
    template: `
      <div>
        <slot
          :setResultVariant="setResultVariant"
          :originalResult="originalResult"
          :selectedVariants="selectedVariants"
        ></slot>
      </div>
    `
  })
  class Child extends Vue {
    @XInject(SET_RESULT_VARIANT_KEY)
    public setResultVariant!: () => void;

    @XInject(RESULT_KEY)
    public originalResult!: Result;

    @XInject(SELECTED_VARIANTS_KEY)
    public selectedVariants!: ResultVariant[];

    @Prop()
    public result!: Result;
  }

  const wrapper = mount(
    {
      template: `<ResultProvider :result="result" #default="{ result }">
          ${template}
        </ResultProvider>`,
      components: {
        ResultProvider,
        Child
      }
    },
    {
      localVue,
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
    wrapper: wrapper.findComponent(ResultProvider),
    result
  };
};

describe('result with variants provider', () => {
  it('exposes the result in the default slot', () => {
    const template = `
      <span data-test="result-name">{{result.name}}</span>
    `;
    const result = createResultStub('tshirt');
    const { wrapper } = renderResultProvider({ result, template });
    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('tshirt');
  });

  it('provides a callback to set the selected variant', async () => {
    const { wrapper } = renderResultProvider({
      template: `
        <Child :result="result" #default="{setResultVariant}">
          <button
              data-test="set-red-jacket"
              @click="setResultVariant(0, result.variants[0])">
            Change variant
          </button>
          <button
              data-test="set-red-xl-jacket"
              @click="setResultVariant(1, result.variants[0].variants[1])">
            Change variant
          </button>
          <span data-test="result-name">{{ result.name }}</span>
        </Child>
      `
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
    const { wrapper, result } = renderResultProvider({
      template: `
        <Child :result="result" #default="{originalResult, setResultVariant, selectedIndexes}">
          <button data-test="variant-button" @click="setResultVariant(0, result.variants[0])">
            Select first variant
          </button>
          <span data-test="result-name">{{ result.name }}</span>
          <span data-test="original-result-name">{{ originalResult.name }}</span>
        </Child>
      `
    });
    const button = wrapper.find(getDataTestSelector('variant-button'));
    await button.trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe(result.variants?.[0].name);
    expect(wrapper.find(getDataTestSelector('original-result-name')).text()).toBe(result.name);
  });

  it('provides the selected variants', async () => {
    const { wrapper, result } = renderResultProvider({
      template: `
        <Child :result="result" #default="{ setResultVariant, selectedVariants }">
          <button data-test="variant-button" @click="setResultVariant(0, result.variants[0])">
            Select 0
          </button>
          <button data-test="variant-button" @click="setResultVariant(0, result.variants[1])">
            Select 1
          </button>
          <span data-test="selectedVariant">{{ selectedVariants?.[0]?.name }}</span>
        </Child>
      `
    });

    const buttons = findTestDataById(wrapper, 'variant-button');
    const selectedIndex = wrapper.find(getDataTestSelector('selectedVariant'));

    expect(selectedIndex.text()).toBe('');

    await buttons.at(0).trigger('click');

    expect(selectedIndex.text()).toBe(result.variants?.[0].name);

    await buttons.at(1).trigger('click');

    expect(selectedIndex.text()).toBe(result.variants?.[1].name);
  });

  it('emits UserSelectedAResultVariant event when a variant is selected', async () => {
    const { wrapper, result } = renderResultProvider({
      template: `
        <Child :result="result" #default="{setResultVariant}">
          <button data-test="variant-button" @click="setResultVariant(0, result.variants[0])">
            Select first variant
          </button>
        </Child>`
    });
    const eventsSpy = jest.spyOn(XPlugin.bus, 'emit');

    const button = wrapper.find(getDataTestSelector('variant-button'));

    await button.trigger('click');

    expect(eventsSpy).toHaveBeenCalledTimes(1);
    expect(eventsSpy).toHaveBeenCalledWith(
      'UserSelectedAResultVariant',
      {
        result,
        variant: result.variants?.[0],
        level: 0
      },
      expect.anything()
    );
  });
});

interface ResultProviderOptions {
  result?: Result;
  template?: string;
}

interface ResultProviderApi {
  wrapper: Wrapper<Vue>;
  result: Result;
}
