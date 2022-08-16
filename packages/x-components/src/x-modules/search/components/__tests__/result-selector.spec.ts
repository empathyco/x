import Vue from 'vue';
import { Wrapper, mount } from '@vue/test-utils';
import { Result } from '@empathyco/x-types';
import ResultSelector from '../result-selector.vue';
import { createResultStub } from '../../../../__stubs__/index';
import { findTestDataById } from '../../../../__tests__/utils';

const renderResultSelector = ({
  template = `<ResultSelector :level="level"></ResultSelector>`,
  result,
  selectedIndexes = [],
  level,
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
        result,
        selectedIndexes,
        setResultVariant
      }
    }
  );
  return { wrapper: wrapper.findComponent(ResultSelector) };
};

describe('variant result selector', () => {
  it('renders the variants for the current level', () => {
    const result = createResultStub('jacket', {
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
    });

    let { wrapper } = renderResultSelector({
      result,
      selectedIndexes: [0],
      level: 1
    });

    let variantWrappers = findTestDataById(wrapper, 'variant-name');

    expect(variantWrappers).toHaveLength(2);
    expect(variantWrappers.at(0).text()).toBe('XL');
    expect(variantWrappers.at(1).text()).toBe('L');

    ({ wrapper } = renderResultSelector({
      result,
      selectedIndexes: [1, 0],
      level: 2
    }));

    variantWrappers = findTestDataById(wrapper, 'variant-name');

    expect(variantWrappers).toHaveLength(3);
    expect(variantWrappers.at(0).text()).toBe('S1');
    expect(variantWrappers.at(1).text()).toBe('S2');
    expect(variantWrappers.at(2).text()).toBe('S3');
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
}
