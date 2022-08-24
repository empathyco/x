import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import { Result } from '@empathyco/x-types';
import { createResultStub } from '../../../__stubs__/index';
import { findTestDataById, getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import VariantsResultProvider from '../variants-result-provider.vue';
import ResultVariantSelector from '../result-variant-selector.vue';
import { XPlugin } from '../../../plugins/index';

const variants = [
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
];

const result = createResultStub('jacket', {
  variants
});

const renderVariantsResultProvider = ({
  template = '<ResultVariantSelector/>',
  result
}: VariantsResultProviderOptions): VariantsResultProviderApi => {
  const [, localVue] = installNewXPlugin();

  const wrapper = mount(
    {
      template: `<VariantsResultProvider :result="result" #default="{ result: newResult }">
          ${template}
        </VariantsResultProvider>`,
      components: {
        VariantsResultProvider,
        ResultVariantSelector
      }
    },
    {
      localVue,
      data() {
        return {
          result
        };
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
    findSelectorLevelButtons: function (level: number): WrapperArray<Vue> {
      return findTestDataById(wrapper, 'variants-list')
        .at(level)
        .findAll(getDataTestSelector('variant-button'));
    }
  };
};

describe('results with variants', () => {
  it('provider exposes the result in the default slot', () => {
    const template = `
      <span data-test="result-name">{{newResult.name}}</span>
    `;
    const result = createResultStub('tshirt');
    const { wrapper } = renderVariantsResultProvider({ result, template });
    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('tshirt');
  });

  it('merges the selected and parent variants data with the result', async () => {
    const { wrapper, findSelectorLevelButtons } = renderVariantsResultProvider({
      template: `
        <div>
          <ResultVariantSelector #variant-content="{variant}">
            {{variant.name}}
          </ResultVariantSelector>
          <ResultVariantSelector :level="1" #variant-content="{variant}">
            {{variant.name}}
          </ResultVariantSelector>
          <span data-test="result-name">{{ newResult.name }}</span>
          <span data-test="result-image" v-if="newResult.images">{{ newResult.images[0] }}</span>
        </div>
      `,
      result
    });

    const firstLevelVariantButtons = findSelectorLevelButtons(0);

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('jacket');
    expect(wrapper.find(getDataTestSelector('result-image')).text()).toBe('');

    await firstLevelVariantButtons.at(0).trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket');
    expect(wrapper.find(getDataTestSelector('result-image')).text()).toBe('red-jacket-image');

    const secondLevelVariantButtons = findSelectorLevelButtons(1);

    await secondLevelVariantButtons.at(1).trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket L');
    expect(wrapper.find(getDataTestSelector('result-image')).text()).toBe('red-jacket-image');

    // It won't deselect the child variant if the parent is clicked.

    await firstLevelVariantButtons.at(0).trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket L');

    await firstLevelVariantButtons.at(1).trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('blue jacket');
    expect(wrapper.find(getDataTestSelector('result-image')).text()).toBe('');
  });

  it('keeps the original result unmodified', async () => {
    const { wrapper } = renderVariantsResultProvider({
      template: `
        <div>
          <ResultVariantSelector/>
          <span data-test="result-name">{{ newResult.name }}</span>
        </div>
      `,
      result
    });

    const button = wrapper.find(getDataTestSelector('variant-button'));
    await button.trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket');
    expect(result.name).toBe('jacket');
  });

  it('emits UserSelectedAResultVariant event when a variant is selected', async () => {
    const { wrapper } = renderVariantsResultProvider({ result });
    const eventsSpy = jest.spyOn(XPlugin.bus, 'emit');

    const button = wrapper.find(getDataTestSelector('variant-button'));

    await button.trigger('click');

    expect(eventsSpy).toHaveBeenCalledTimes(1);
    expect(eventsSpy).toHaveBeenCalledWith(
      'UserSelectedAResultVariant',
      {
        result,
        variant: variants[0],
        level: 0
      },
      expect.anything()
    );
  });

  describe('result variant selector', () => {
    it('renders the whole variant by default', () => {
      const { wrapper } = renderVariantsResultProvider({ result });
      const button = wrapper.find(getDataTestSelector('variant-button'));
      expect(JSON.parse(button.text())).toEqual(variants[0]);
    });

    it('add selected class when a variant is selected', async () => {
      const className = 'x-result-variant-selector__item--is-selected';
      const { wrapper } = renderVariantsResultProvider({ result });

      const firstVariantButton = wrapper.find(getDataTestSelector('variant-button'));
      const variantWrappers = wrapper.findAll(getDataTestSelector('variant-item'));

      await firstVariantButton.trigger('click');

      expect(variantWrappers.at(0).element).toHaveClass(className);
      variantWrappers.wrappers.slice(1).forEach(wrapper => {
        expect(wrapper.element).not.toHaveClass(className);
      });
    });

    it('renders all the variants of each level', async () => {
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
        template,
        result
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

    it('exposes variants, selectedVariant and selectVariant in the default slot', async () => {
      const { wrapper } = renderVariantsResultProvider({
        template: `
          <ResultVariantSelector #default="{variants, selectedVariant, selectVariant}" >
            <div>
              <span v-if="selectedVariant" data-test="selected-variant">
                {{selectedVariant.name}}
              </span>
              <button
                  v-for="(variant, index) in variants"
                  data-test="variant"
                  :key="index"
                  :class="{'isSelected': variant === selectedVariant}"
                  @click="selectVariant(variant)">
                {{variant.name}}
              </button>
            </div>
          </ResultVariantSelector>
        `,
        result
      });

      const variants = findTestDataById(wrapper, 'variant');

      expect(variants).toHaveLength(2);

      expect(variants.at(0).text()).toBe('red jacket');
      expect(variants.at(1).text()).toBe('blue jacket');

      await variants.at(0).trigger('click');

      expect(variants.at(0).element).toHaveClass('isSelected');
    });

    it('exposes variant, isSelected and selectVariant in the variant slot', async () => {
      const { wrapper } = renderVariantsResultProvider({
        template: `
          <ResultVariantSelector #variant="{variant, selectVariant, isSelected}">
            <button
                data-test="variant"
                @click="selectVariant"
                :class="{'isSelected': isSelected}">
              {{variant.name}}
            </button>
          </ResultVariantSelector>
        `,
        result
      });

      const variants = findTestDataById(wrapper, 'variant');

      expect(variants).toHaveLength(2);

      expect(variants.at(0).text()).toBe('red jacket');
      expect(variants.at(1).text()).toBe('blue jacket');

      await variants.at(1).trigger('click');
      expect(variants.at(1).element).toHaveClass('isSelected');
    });

    it('exposes variant and isSelected in the variant-content slot', async () => {
      const { wrapper } = renderVariantsResultProvider({
        template: `
          <ResultVariantSelector #variant-content="{variant, isSelected}">
            {{variant.name}}<span v-if="isSelected"> SELECTED!</span>
          </ResultVariantSelector>
        `,
        result
      });

      const variants = findTestDataById(wrapper, 'variant-button');

      expect(variants).toHaveLength(2);

      await variants.at(0).trigger('click');

      expect(variants.at(0).text()).toContain('red jacket SELECTED!');
      expect(variants.at(1).text()).toBe('blue jacket');
    });
  });
});

/**
 * The options for the `renderVariantsResultProvider` function.
 */
interface VariantsResultProviderOptions {
  /** The result containing the variants. */
  result: Result | null;
  /** The template to render inside the provider's default slot. */
  template?: string;
}

/**
 * Test API for the {@link VariantsResultProvider} component.
 */
interface VariantsResultProviderApi {
  /** The wrapper for {@link VariantsResultProvider} component. */
  wrapper: Wrapper<Vue>;
  /**
   * Util function to find the variant buttons of a level.
   *
   * @param level - The level of the variants.
   * @returns The wrappers of the buttons rendered for the given level.
   */
  findSelectorLevelButtons: (level: number) => WrapperArray<Vue>;
}
