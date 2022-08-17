import Vue from 'vue';
import { Wrapper, mount } from '@vue/test-utils';
import { Result } from '@empathyco/x-types';
import ResultSelector from '../result-selector.vue';
import { createResultStub } from '../../../../__stubs__/index';
import { findTestDataById, getDataTestSelector } from '../../../../__tests__/utils';

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
  setResultVariant
}: ResultSelectorOptions = {}): ResultSelectorApi => {
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
        result: { value: result },
        selectedIndexes: { value: selectedIndexes },
        setResultVariant: { value: setResultVariant }
      }
    }
  );
  return {
    wrapper: wrapper.findComponent(ResultSelector),
    result
  };
};

describe('variant result selector', () => {
  it('renders the whole variant by default', () => {
    const { wrapper, result } = renderResultSelector({
      level: 0
    });
    const button = wrapper.find(getDataTestSelector('variant-button'));
    expect(JSON.parse(button.text())).toEqual(result.variants?.[0]);
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

    expect(variant.text()).toBe(result.variants?.[1].name);
  });

  it('calls set result variant injected function when an option is clicked', async () => {
    const setResultVariant = jest.fn();

    const { wrapper } = renderResultSelector({
      setResultVariant
    });

    const variantWrapper = findTestDataById(wrapper, 'variant-button').at(1);

    await variantWrapper.trigger('click');

    expect(setResultVariant).toHaveBeenCalledTimes(1);
    expect(setResultVariant).toHaveBeenCalledWith(0, 1);
  });
});

interface ResultSelectorOptions {
  template?: string;
  result?: Result;
  selectedIndexes?: number[];
  level?: number;
  setResultVariant?: (level: number, variantIndex: number) => void;
}

interface ResultSelectorApi {
  wrapper: Wrapper<Vue>;
  result: Result;
}
