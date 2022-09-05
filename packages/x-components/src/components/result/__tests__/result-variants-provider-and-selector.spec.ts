import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import { Result } from '@empathyco/x-types';
import { createResultStub } from '../../../__stubs__/index';
import { findTestDataById, getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import ResultVariantsProvider from '../result-variants-provider.vue';
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

const renderResultVariantsProvider = ({
  template = '<ResultVariantSelector/>',
  result,
  autoSelectDepth
}: ResultVariantsProviderOptions): ResultVariantsProviderApi => {
  const [, localVue] = installNewXPlugin();

  const eventsBusSpy = jest.spyOn(XPlugin.bus, 'emit');

  const wrapper = mount(
    {
      template: `
        <ResultVariantsProvider
            :result="result"
            :autoSelectDepth="autoSelectDepth"
            #default="{ result: newResult }">
          ${template}
        </ResultVariantsProvider>`,
      components: {
        ResultVariantsProvider,
        ResultVariantSelector
      }
    },
    {
      localVue,
      data() {
        return {
          result,
          autoSelectDepth
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
    wrapper: wrapper.findComponent(ResultVariantsProvider),
    findSelectorButtonByLevel: function (level: number): WrapperArray<Vue> {
      return findTestDataById(wrapper, 'variants-list')
        .at(level)
        .findAll(getDataTestSelector('variant-button'));
    },
    findSelectorItemByLevel: function (level: number): WrapperArray<Vue> {
      return findTestDataById(wrapper, 'variants-list')
        .at(level)
        .findAll(getDataTestSelector('variant-item'));
    },
    setResult: function (result: Result): Promise<void> {
      (wrapper.vm as any).result = result;
      return wrapper.vm.$nextTick();
    },
    eventsBusSpy
  };
};

describe('results with variants', () => {
  it('provider exposes the result in the default slot', () => {
    const template = `
      <span data-test="result-name">{{newResult.name}}</span>
    `;
    const result = createResultStub('tshirt');
    const { wrapper } = renderResultVariantsProvider({ result, template });
    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('tshirt');
  });

  it('merges the selected and parent variants data with the result', async () => {
    const { wrapper, findSelectorButtonByLevel } = renderResultVariantsProvider({
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
      result,
      autoSelectDepth: 0
    });

    const firstLevelVariantButtons = findSelectorButtonByLevel(0);

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('jacket');
    expect(wrapper.find(getDataTestSelector('result-image')).text()).toBe('');

    await firstLevelVariantButtons.at(0).trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket');
    expect(wrapper.find(getDataTestSelector('result-image')).text()).toBe('red-jacket-image');

    const secondLevelVariantButtons = findSelectorButtonByLevel(1);

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
    const { wrapper } = renderResultVariantsProvider({
      template: `
        <div>
          <ResultVariantSelector/>
          <span data-test="result-name">{{ newResult.name }}</span>
        </div>
      `,
      result,
      autoSelectDepth: 0
    });

    const button = wrapper.find(getDataTestSelector('variant-button'));
    await button.trigger('click');

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toBe('red jacket');
    expect(result.name).toBe('jacket');
  });

  it('emits UserSelectedAResultVariant event when a variant is selected', async () => {
    const { wrapper, eventsBusSpy } = renderResultVariantsProvider({
      result,
      autoSelectDepth: 0
    });

    const button = wrapper.find(getDataTestSelector('variant-button'));

    await button.trigger('click');

    expect(eventsBusSpy).toHaveBeenCalledTimes(1);
    expect(eventsBusSpy).toHaveBeenCalledWith(
      'UserSelectedAResultVariant',
      {
        result,
        variant: variants[0],
        level: 0
      },
      expect.anything()
    );
  });

  it('selects the first variant of all levels by default', () => {
    const { findSelectorItemByLevel } = renderResultVariantsProvider({
      template: `
        <div>
          <ResultVariantSelector :level="0"/>
          <ResultVariantSelector :level="1"/>
        </div>
      `,
      result
    });

    const firstVariant = findSelectorItemByLevel(0).at(0);
    const secondSelectorFirstVariant = findSelectorItemByLevel(1).at(0);

    expect(firstVariant.element.className).toContain('--is-selected');
    expect(secondSelectorFirstVariant.element.className).toContain('--is-selected');
  });

  it('selects variants on init up to the level set in the autoSelectDepth prop', () => {
    const { findSelectorItemByLevel } = renderResultVariantsProvider({
      template: `
        <div>
          <ResultVariantSelector :level="0"/>
          <ResultVariantSelector :level="1"/>
        </div>
      `,
      result,
      autoSelectDepth: 1
    });

    const firstVariant = findSelectorItemByLevel(0).at(0);
    const secondSelectorFirstVariant = findSelectorItemByLevel(1).at(0);

    expect(firstVariant.element.className).toContain('--is-selected');
    expect(secondSelectorFirstVariant.element.className).not.toContain('--is-selected');
  });

  it('wont select any variant by default if autoSelectDepth is 0', () => {
    const { wrapper } = renderResultVariantsProvider({
      result,
      autoSelectDepth: 0
    });

    const firstVariant = wrapper.find(getDataTestSelector('variant-item'));

    expect(firstVariant.element.className).not.toContain('--is-selected');
  });

  // eslint-disable-next-line max-len
  it('does not emit the UserSelectedAResultVariant event when the variants are selected on init', () => {
    const { eventsBusSpy } = renderResultVariantsProvider({ result });

    expect(eventsBusSpy).not.toHaveBeenCalled();
  });

  it('reset the selected variants if the result changes', async () => {
    const { wrapper, setResult } = renderResultVariantsProvider({
      result,
      autoSelectDepth: 0
    });
    const variantItem = wrapper.find(getDataTestSelector('variant-item'));
    const variantButton = variantItem.find(getDataTestSelector('variant-button'));

    await variantButton.trigger('click');

    expect(variantItem.element.className).toContain('--is-selected');

    await setResult(
      createResultStub('tshirt', {
        variants
      })
    );

    //Resets even if the same variants are passed.
    expect(variantItem.element.className).not.toContain('--is-selected');
  });

  describe('result variant selector', () => {
    it('renders the whole variant by default', () => {
      const { wrapper } = renderResultVariantsProvider({ result });
      const button = wrapper.find(getDataTestSelector('variant-button'));
      expect(JSON.parse(button.text())).toEqual(variants[0]);
    });

    it('add selected class when a variant is selected', async () => {
      const className = 'x-result-variant-selector__item--is-selected';
      const { wrapper } = renderResultVariantsProvider({ result });

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

      const { findSelectorButtonByLevel } = renderResultVariantsProvider({
        template,
        result
      });

      const firstLevelVariantButtons = findSelectorButtonByLevel(0);

      expect(firstLevelVariantButtons).toHaveLength(2);
      expect(firstLevelVariantButtons.at(0).text()).toBe('red jacket');
      expect(firstLevelVariantButtons.at(1).text()).toBe('blue jacket');

      await firstLevelVariantButtons.at(1).trigger('click');

      const secondLevelVariantButtons = findSelectorButtonByLevel(1);

      expect(secondLevelVariantButtons).toHaveLength(2);
      expect(secondLevelVariantButtons.at(0).text()).toBe('blue jacket L');
      expect(secondLevelVariantButtons.at(1).text()).toBe('blue jacket S');

      await secondLevelVariantButtons.at(0).trigger('click');

      const thirdLevelVariantButtons = findSelectorButtonByLevel(2);

      expect(thirdLevelVariantButtons).toHaveLength(3);
      expect(thirdLevelVariantButtons.at(0).text()).toBe('blue jacket L1');
      expect(thirdLevelVariantButtons.at(1).text()).toBe('blue jacket L2');
      expect(thirdLevelVariantButtons.at(1).text()).toBe('blue jacket L2');
    });

    it('wont render if no result is injected', () => {
      const { wrapper } = renderResultVariantsProvider({
        result: null
      });

      expect(wrapper.find(getDataTestSelector('variants-list')).exists()).toBe(false);
    });

    it('wont render if the provided result does not have variants', () => {
      const { wrapper } = renderResultVariantsProvider({
        result: createResultStub('jacket')
      });

      expect(wrapper.find(getDataTestSelector('variants-list')).exists()).toBe(false);
    });

    it('exposes variants, selectedVariant and selectVariant in the default slot', async () => {
      const { wrapper } = renderResultVariantsProvider({
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
      const { wrapper } = renderResultVariantsProvider({
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
      const { wrapper } = renderResultVariantsProvider({
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
 * The options for the `renderResultVariantsProvider` function.
 */
interface ResultVariantsProviderOptions {
  /** The result containing the variants. */
  result: Result | null;
  /** The template to render inside the provider's default slot. */
  template?: string;
  /** Indicates the number of levels to auto select the first variants. */
  autoSelectDepth?: number;
}

/**
 * Test API for the {@link ResultVariantsProvider} component.
 */
interface ResultVariantsProviderApi {
  /** The wrapper for {@link ResultVariantsProvider} component. */
  wrapper: Wrapper<Vue>;
  /**
   * Util function to find the variant items of a level.
   *
   * @param level - The level of the variants.
   * @returns The wrappers of the list items rendered for the given level.
   */
  findSelectorItemByLevel: (level: number) => WrapperArray<Vue>;
  /**
   * Util function to find the variant buttons of a level.
   *
   * @param level - The level of the variants.
   * @returns The wrappers of the buttons rendered for the given level.
   */
  findSelectorButtonByLevel: (level: number) => WrapperArray<Vue>;

  /**
   * Sets the result passed to the provider as prop, replacing it.
   *
   * @param result - Result to set.
   */
  setResult: (result: Result) => Promise<void>;
  /**
   * A Jest spy set in the {@link XPlugin} bus `emit` function,
   * useful to test events emitted in the first lifecycle hooks of the component.
   */
  eventsBusSpy: jest.SpyInstance;
}
