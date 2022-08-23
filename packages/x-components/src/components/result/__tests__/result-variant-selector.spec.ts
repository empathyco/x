import Vue from 'vue';
import { Wrapper, mount } from '@vue/test-utils';
import { Result, ResultVariant } from '@empathyco/x-types';
import ResultVariantSelector from '../result-variant-selector.vue';
import { createResultStub } from '../../../__stubs__/results-stubs.factory';
import { findTestDataById, getDataTestSelector } from '../../../__tests__/utils';
import {
  RESULT_WITH_VARIANTS_KEY,
  SELECTED_VARIANTS_KEY,
  SELECT_RESULT_VARIANT_KEY
} from '../../decorators/injection.consts';

const renderResultVariantSelector = ({
  result = createResultStub('jacket', {
    variants: [
      {
        name: 'red',
        variants: [
          {
            name: 'XL'
          },
          {
            name: 'L'
          }
        ]
      },
      {
        name: 'blue',
        variants: [
          {
            name: 'S',
            variants: [
              {
                name: 'S1'
              },
              {
                name: 'S2'
              },
              {
                name: 'S3'
              }
            ]
          }
        ]
      }
    ]
  }),
  template = `<ResultVariantSelector :level="level"/>`,
  selectedIndexes = [],
  level,
  setResultVariant = jest.fn()
}: ResultVariantSelectorOptions = {}): ResultVariantSelectorApi => {
  /**
   * Helper method to get an array of selected variants from an array of selected indexes.
   * This is useful to avoid complicating the tests passing the arrays of variants.
   *
   * @param result - The result containing the variants.
   * @param selectedIndexes - The indexes of the selected variants.
   *
   * @returns The selected variants.
   */
  function getSelectedVariantsFromIndexes(
    result: Result,
    selectedIndexes: number[]
  ): ResultVariant[] | undefined {
    if (!result.variants) {
      return [];
    }
    return selectedIndexes.reduce(
      (selectedVariants, selectedIndex) => {
        const selectedVariant =
          selectedVariants[selectedVariants.length - 1]?.variants?.[selectedIndex];
        if (selectedVariant) {
          selectedVariants.push(selectedVariant);
        }
        return selectedVariants;
      },
      [result.variants?.[selectedIndexes[0]]]
    );
  }

  const selectedVariants = result ? getSelectedVariantsFromIndexes(result, selectedIndexes) : [];

  const wrapper = mount(
    {
      template,
      components: {
        ResultVariantSelector
      }
    },
    {
      props: ['level'],
      propsData: {
        level
      },
      provide: {
        [RESULT_WITH_VARIANTS_KEY.toString()]: { value: result },
        [SELECTED_VARIANTS_KEY.toString()]: { value: selectedVariants },
        [SELECT_RESULT_VARIANT_KEY.toString()]: { value: setResultVariant }
      }
    }
  );
  return {
    wrapper: wrapper.findComponent(ResultVariantSelector),
    result,
    setResultVariant
  };
};

describe('variant result selector', () => {
  it('renders the whole variant by default', () => {
    const { wrapper, result } = renderResultVariantSelector({});
    const button = wrapper.find(getDataTestSelector('variant-button'));
    expect(JSON.parse(button.text())).toEqual(result?.variants?.[0]);
  });

  it('add selected class when a variant is selected', () => {
    const className = 'x-result-variant-selector__item--is-selected';
    const { wrapper } = renderResultVariantSelector({
      selectedIndexes: [0]
    });

    const variantWrappers = wrapper.findAll(getDataTestSelector('variant-item'));
    expect(variantWrappers.at(0).element).toHaveClass(className);
    variantWrappers.wrappers.slice(1).forEach(wrapper => {
      expect(wrapper.element).not.toHaveClass(className);
    });
  });

  it('renders the variants for the current level', () => {
    const template = `
        <ResultVariantSelector :level="level" #variant="{variant}">
          <span data-test="variant-name">{{variant.name}}</span>
        </ResultVariantSelector>
      `;

    let { wrapper } = renderResultVariantSelector({
      selectedIndexes: [0],
      level: 1,
      template
    });

    let variantWrappers = findTestDataById(wrapper, 'variant-name');

    expect(variantWrappers).toHaveLength(2);
    expect(variantWrappers.at(0).text()).toBe('XL');
    expect(variantWrappers.at(1).text()).toBe('L');

    ({ wrapper } = renderResultVariantSelector({
      selectedIndexes: [1, 0],
      level: 2,
      template
    }));

    variantWrappers = findTestDataById(wrapper, 'variant-name');

    expect(variantWrappers).toHaveLength(3);
    expect(variantWrappers.at(0).text()).toBe('S1');
    expect(variantWrappers.at(1).text()).toBe('S2');
    expect(variantWrappers.at(2).text()).toBe('S3');
  });

  it('renders variants for the first level', () => {
    const { wrapper, result } = renderResultVariantSelector({
      template: `
        <ResultVariantSelector :level="level" #variant="{variant}">
          <span data-test="variant-name">{{variant.name}}</span>
        </ResultVariantSelector>
      `
    });

    const variant = findTestDataById(wrapper, 'variant-name').at(1);

    expect(variant.text()).toBe(result?.variants?.[1].name);
  });

  it('calls set result variant injected function when an option is clicked', async () => {
    const { wrapper, setResultVariant, result } = renderResultVariantSelector();

    const variantWrapper = findTestDataById(wrapper, 'variant-button').at(1);

    await variantWrapper.trigger('click');

    expect(setResultVariant).toHaveBeenCalledTimes(1);
    expect(setResultVariant).toHaveBeenCalledWith(0, result?.variants?.[1]);
  });

  it('wont render if no result is injected', () => {
    const { wrapper } = renderResultVariantSelector({
      result: null
    });

    expect(wrapper.find(getDataTestSelector('variant-container')).exists()).toBe(false);
  });

  it('wont render if the provided result does not have variants', () => {
    const { wrapper } = renderResultVariantSelector({
      result: createResultStub('jacket')
    });

    expect(wrapper.find(getDataTestSelector('variant-container')).exists()).toBe(false);
  });

  it('exposes variants, selectedVariant and selectVariant in the default slot', async () => {
    const { wrapper, result, setResultVariant } = renderResultVariantSelector({
      template: `
        <ResultVariantSelector
            :level="level"
            #default="{variants, selectedVariant, selectVariant}" >
          <div>
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
      selectedIndexes: [1]
    });

    const variants = findTestDataById(wrapper, 'variant');

    expect(variants).toHaveLength(2);

    result?.variants?.forEach((variant, index) => {
      expect(variants.at(index).text()).toBe(variant.name);
    });

    expect(variants.at(1).element).toHaveClass('isSelected');

    //It calls setResultVariant with the right indexes
    await variants.at(0).trigger('click');

    expect(setResultVariant).toHaveBeenCalledTimes(1);
    expect(setResultVariant).toHaveBeenCalledWith(0, result?.variants?.[0]);
  });

  it('exposes variant, isSelected and selectVariant in the variant slot', async () => {
    const { wrapper, result, setResultVariant } = renderResultVariantSelector({
      template: `
        <ResultVariantSelector :level="level" #variant="{variant, selectVariant, isSelected}">
          <button
              data-test="variant"
              @click="selectVariant"
              :class="{'isSelected': isSelected}">
            {{variant.name}}
          </button>
        </ResultVariantSelector>
      `,
      selectedIndexes: [0]
    });

    const variants = findTestDataById(wrapper, 'variant');

    expect(variants).toHaveLength(2);

    result?.variants?.forEach((variant, index) => {
      expect(variants.at(index).text()).toBe(variant.name);
    });

    expect(variants.at(0).element).toHaveClass('isSelected');

    //It calls setResultVariant with the right indexes
    await variants.at(1).trigger('click');

    expect(setResultVariant).toHaveBeenCalledTimes(1);
    expect(setResultVariant).toHaveBeenCalledWith(0, result?.variants?.[1]);
  });

  it('exposes variant and isSelected in the variant-content slot', () => {
    const { wrapper, result } = renderResultVariantSelector({
      template: `
        <ResultVariantSelector :level="level" #variant-content="{variant, isSelected}">
          {{variant.name}}<span v-if="isSelected"> SELECTED!</span>
        </ResultVariantSelector>
      `,
      selectedIndexes: [0]
    });

    const variants = findTestDataById(wrapper, 'variant-button');

    expect(variants).toHaveLength(2);

    expect(variants.at(0).text()).toContain(`${result!.variants?.[0].name ?? ''} SELECTED!`);
    expect(variants.at(1).text()).toBe(result!.variants?.[1].name);
  });
});

/**
 * The options for the `renderResultVariantSelector` function.
 */
interface ResultVariantSelectorOptions {
  /** The template to render. */
  template?: string;
  /** The {@link Result} to inject in the selector component. */
  result?: Result | null;
  /** The indexes of the selected variants to inject. */
  selectedIndexes?: number[];
  /** The level of the variants to show in the selector component. */
  level?: number;
  /** The callback to select the result variant to be injected. A jest mock function by default. */
  setResultVariant?: (level: number, variant: ResultVariant) => void;
}

/**
 * Test API for the {@link ResultVariantSelector} component.
 */
interface ResultVariantSelectorApi {
  /** The wrapper for {@link ResultVariantSelector} component. */
  wrapper: Wrapper<Vue>;
  /** The injected result. */
  result: Result | null;
  /** The injected setResultVariant callback. A jest mock function by default. */
  setResultVariant: (level: number, variant: ResultVariant) => void;
}
