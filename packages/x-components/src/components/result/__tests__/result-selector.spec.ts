import Vue from 'vue';
import { Wrapper, mount } from '@vue/test-utils';
import { Result, ResultVariant } from '@empathyco/x-types';
import ResultSelector from '../result-selector.vue';
import { createResultStub } from '../../../__stubs__/results-stubs.factory';
import { findTestDataById, getDataTestSelector } from '../../../__tests__/utils';
import {
  RESULT_WITH_VARIANTS_KEY,
  SELECTED_VARIANTS_KEY,
  SET_RESULT_VARIANT_KEY
} from '../../decorators/injection.consts';

const renderResultSelector = ({
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
  template = `<ResultSelector :level="level"/>`,
  selectedIndexes = [],
  level = 0,
  setResultVariant = jest.fn()
}: ResultSelectorOptions = {}): ResultSelectorApi => {
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
        ResultSelector
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
        [SET_RESULT_VARIANT_KEY.toString()]: { value: setResultVariant }
      }
    }
  );
  return {
    wrapper: wrapper.findComponent(ResultSelector),
    result,
    setResultVariant
  };
};

describe('variant result selector', () => {
  it('renders the whole variant by default', () => {
    const { wrapper, result } = renderResultSelector({
      level: 0
    });
    const button = wrapper.find(getDataTestSelector('variant-button'));
    expect(JSON.parse(button.text())).toEqual(result?.variants?.[0]);
  });

  it('renders the variants for the current level', () => {
    const template = `
        <ResultSelector :level="level" #variant="{variant}">
          <span data-test="variant-name">{{variant.name}}</span>
        </ResultSelector>
      `;

    let { wrapper } = renderResultSelector({
      selectedIndexes: [0],
      level: 1,
      template
    });

    let variantWrappers = findTestDataById(wrapper, 'variant-name');

    expect(variantWrappers).toHaveLength(2);
    expect(variantWrappers.at(0).text()).toBe('XL');
    expect(variantWrappers.at(1).text()).toBe('L');

    ({ wrapper } = renderResultSelector({
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
    const { wrapper, result } = renderResultSelector({
      template: `
        <ResultSelector :level="level" #variant="{variant}">
          <span data-test="variant-name">{{variant.name}}</span>
        </ResultSelector>
      `
    });

    const variant = findTestDataById(wrapper, 'variant-name').at(1);

    expect(variant.text()).toBe(result?.variants?.[1].name);
  });

  it('calls set result variant injected function when an option is clicked', async () => {
    const { wrapper, setResultVariant, result } = renderResultSelector();

    const variantWrapper = findTestDataById(wrapper, 'variant-button').at(1);

    await variantWrapper.trigger('click');

    expect(setResultVariant).toHaveBeenCalledTimes(1);
    expect(setResultVariant).toHaveBeenCalledWith(0, result?.variants?.[1]);
  });

  it('wont render if no result is injected', () => {
    const { wrapper } = renderResultSelector({
      result: null
    });

    expect(wrapper.find(getDataTestSelector('variant-container')).exists()).toBe(false);
  });

  it('wont render if the provided result does not have variants', () => {
    const { wrapper } = renderResultSelector({
      result: createResultStub('jacket')
    });

    expect(wrapper.find(getDataTestSelector('variant-container')).exists()).toBe(false);
  });

  it('exposes variants, selectedVariant and selectVariant in the default slot', async () => {
    const { wrapper, result, setResultVariant } = renderResultSelector({
      template: `
        <ResultSelector :level="level" #default="{variants, selectedVariant, selectVariant}" >
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
        </ResultSelector>
      `,
      selectedIndexes: [1],
      level: 0
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
    const { wrapper, result, setResultVariant } = renderResultSelector({
      template: `
        <ResultSelector :level="level" #variant="{variant, selectVariant, isSelected}">
          <button
              data-test="variant"
              @click="selectVariant"
              :class="{'isSelected': isSelected}">
            {{variant.name}}
          </button>
        </ResultSelector>
      `,
      selectedIndexes: [0],
      level: 0
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
});

/**
 * The options for the `renderResultSelector` function.
 */
interface ResultSelectorOptions {
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
 * Test API for the {@link ResultSelector} component.
 */
interface ResultSelectorApi {
  /** The wrapper for {@link ResultSelector} component. */
  wrapper: Wrapper<Vue>;
  /** The injected result. */
  result: Result | null;
  /** The injected setResultVariant callback. A jest mock function by default. */
  setResultVariant: (level: number, variant: ResultVariant) => void;
}
