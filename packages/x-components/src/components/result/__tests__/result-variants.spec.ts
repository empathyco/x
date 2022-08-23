import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import { Result } from '@empathyco/x-types';
import { createResultStub } from '../../../__stubs__/index';
import { findTestDataById, getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import VariantsResultProvider from '../variants-result-provider.vue';
import ResultVariantSelector from '../result-variant-selector.vue';
import { XPlugin } from '../../../plugins/index';

const renderVariantsResultProvider = ({
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
            name: 'blue jacket L',
            variants: [
              {
                name: 'blue jacket L1'
              },
              {
                name: 'blue jacket L2'
              },
              {
                name: 'blue jacket L3'
              }
            ]
          },
          { name: 'blue jacket S' }
        ]
      }
    ]
  }),
  template = '<ResultVariantSelector/>'
}: VariantsResultProviderOptions = {}): VariantsResultProviderApi => {
  const [, localVue] = installNewXPlugin();

  function findSelectorLevelButtons(wrapper: Wrapper<Vue>, level: number): WrapperArray<Vue> {
    return findTestDataById(wrapper, 'variants-list')
      .at(level)
      .findAll(getDataTestSelector('variant-button'));
  }

  const wrapper = mount(
    {
      template: `<VariantsResultProvider :result="originalResult" #default="{ result }">
          ${template}
        </VariantsResultProvider>`,
      components: {
        VariantsResultProvider,
        ResultVariantSelector
      }
    },
    {
      localVue,
      props: ['originalResult'],
      propsData: {
        originalResult: result
      },
      scopedSlots: {
        default: () => {
          return template;
        }
      }
    }
  );

  return {
    wrapper: wrapper.findComponent(VariantsResultProvider),
    result,
    findSelectorLevelButtons: findSelectorLevelButtons.bind(undefined, wrapper)
  };
};

describe('results with variants', () => {
  it('exposes the result in the default slot', () => {
    const template = `
      <span data-test="result-name">{{result.name}}</span>
    `;
    const result = createResultStub('tshirt');
    const { wrapper } = renderVariantsResultProvider({ result, template });
    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('tshirt');
  });

  it('selects the variant', async () => {
    const { wrapper } = renderVariantsResultProvider({
      template: `
        <div>
          <ResultVariantSelector data-test="level-0-selector" #variant-content="{variant}">
            {{variant.name}}
          </ResultVariantSelector>
          <ResultVariantSelector
              data-test="level-1-selector"
              :level="1"
              #variant-content="{variant}">
            {{variant.name}}
          </ResultVariantSelector>
          <span data-test="result-name">{{ result.name }}</span>
        </div>
      `
    });

    const firstLevelVariantButtons = wrapper.findAll(
      `${getDataTestSelector('level-0-selector')} ${getDataTestSelector('variant-button')}`
    );

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('jacket');

    await firstLevelVariantButtons.at(0).trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket');

    const secondLevelVariantButtons = wrapper.findAll(
      `${getDataTestSelector('level-1-selector')} ${getDataTestSelector('variant-button')}`
    );

    await secondLevelVariantButtons.at(1).trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket L');

    // It won't deselect the child variant if the parent is clicked.

    await firstLevelVariantButtons.at(0).trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket L');

    await firstLevelVariantButtons.at(1).trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('blue jacket');
  });

  it('keeps the original result unmodified', async () => {
    const { wrapper, result } = renderVariantsResultProvider({
      template: `
        <div>
          <ResultVariantSelector data-test="level-0-selector" #variant-content="{variant}">
            {{variant.name}}
          </ResultVariantSelector>
          <span data-test="result-name">{{ result.name }}</span>
          <span data-test="original-result-name">{{ originalResult.name }}</span>
        </div>
      `
    });
    const button = wrapper.find(getDataTestSelector('variant-button'));
    await button.trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe(
      result!.variants?.[0].name
    );
    expect(wrapper.find(getDataTestSelector('original-result-name')).text()).toBe(result!.name);
  });

  it('emits UserSelectedAResultVariant event when a variant is selected', async () => {
    const { wrapper, result } = renderVariantsResultProvider();
    const eventsSpy = jest.spyOn(XPlugin.bus, 'emit');

    const button = wrapper.find(getDataTestSelector('variant-button'));

    await button.trigger('click');

    expect(eventsSpy).toHaveBeenCalledTimes(1);
    expect(eventsSpy).toHaveBeenCalledWith(
      'UserSelectedAResultVariant',
      {
        result,
        variant: result!.variants?.[0],
        level: 0
      },
      expect.anything()
    );
  });

  describe('result variant selector', () => {
    it('renders the whole variant by default', () => {
      const { wrapper, result } = renderVariantsResultProvider({});
      const button = wrapper.find(getDataTestSelector('variant-button'));
      expect(JSON.parse(button.text())).toEqual(result?.variants?.[0]);
    });

    it('add selected class when a variant is selected', async () => {
      const className = 'x-result-variant-selector__item--is-selected';
      const { wrapper } = renderVariantsResultProvider();

      const firstVariantButton = wrapper.find(getDataTestSelector('variant-button'));
      const variantWrappers = wrapper.findAll(getDataTestSelector('variant-item'));

      await firstVariantButton.trigger('click');

      expect(variantWrappers.at(0).element).toHaveClass(className);
      variantWrappers.wrappers.slice(1).forEach(wrapper => {
        expect(wrapper.element).not.toHaveClass(className);
      });
    });

    it('renders all the variants for the current level', async () => {
      const template = `
        <div>
          <ResultVariantSelector #variant-content="{variant}">
            <span data-test="variant-name">{{variant.name}}</span>
          </ResultVariantSelector>

          <ResultVariantSelector :level="1" #variant-content="{variant}">
            <span data-test="variant-name">{{variant.name}}</span>
          </ResultVariantSelector>

          <ResultVariantSelector :level="2" #variant-content="{variant}">
            <span data-test="variant-name">{{variant.name}}</span>
          </ResultVariantSelector>
        </div>
      `;

      const { findSelectorLevelButtons } = renderVariantsResultProvider({
        template
      });

      const firstLevelVariantButtons = findSelectorLevelButtons(0);

      expect(firstLevelVariantButtons).toHaveLength(2);
      expect(firstLevelVariantButtons.at(0).text()).toBe('red jacket');
      expect(firstLevelVariantButtons.at(1).text()).toBe('blue jacket');

      await firstLevelVariantButtons.at(1).trigger('click');

      const secondLevelVariantButtons = findSelectorLevelButtons(1);

      expect(secondLevelVariantButtons).toHaveLength(2);
      expect(secondLevelVariantButtons.at(0).text()).toBe('blue jacket L');
      expect(secondLevelVariantButtons.at(1).text()).toBe('blue jacket S');

      await secondLevelVariantButtons.at(0).trigger('click');

      const thirdLevelVariantButtons = findSelectorLevelButtons(2);

      expect(thirdLevelVariantButtons).toHaveLength(3);
      expect(thirdLevelVariantButtons.at(0).text()).toBe('blue jacket L1');
      expect(thirdLevelVariantButtons.at(1).text()).toBe('blue jacket L2');
      expect(thirdLevelVariantButtons.at(1).text()).toBe('blue jacket L2');
    });

    it('wont render if no result is injected', () => {
      const { wrapper } = renderVariantsResultProvider({
        result: null
      });

      expect(wrapper.find(getDataTestSelector('variants-list')).exists()).toBe(false);
    });

    it('wont render if the provided result does not have variants', () => {
      const { wrapper } = renderVariantsResultProvider({
        result: createResultStub('jacket')
      });

      expect(wrapper.find(getDataTestSelector('variants-list')).exists()).toBe(false);
    });
  });
});

/**
 * The options for the `renderVariantsResultProvider` function.
 */
interface VariantsResultProviderOptions {
  /** The result containing the variants. */
  result?: Result | null;
  /** The template to render inside the provider's default slot. */
  template?: string;
}

/**
 * Test API for the {@link VariantsResultProvider} component.
 */
interface VariantsResultProviderApi {
  /** The wrapper for {@link VariantsResultProvider} component. */
  wrapper: Wrapper<Vue>;
  /** The result used in the provider. */
  result: Result | null;
  findSelectorLevelButtons: (level: number) => WrapperArray<Vue>;
}
