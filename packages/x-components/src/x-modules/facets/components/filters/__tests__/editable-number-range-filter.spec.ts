import { EditableNumberRangeFilter, RangeValue } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
// eslint-disable-next-line max-len
import { createEditableNumberRangeFilter } from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils';
import {
  getXComponentXModuleName,
  isXComponent
} from '../../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../../store/store.types';
import { facetsXModule } from '../../../x-module';
import { resetXFacetsStateWith } from '../../__tests__/utils';
import EditableNumberRangeFilterComponent from '../editable-number-range-filter.vue';

Object.defineProperty(HTMLInputElement.prototype, 'valueAsNumber', {
  get() {
    return parseFloat(this.value);
  },
  configurable: true,
  enumerable: true
});

function renderEditableNumberRangeFilter({
  template = `
    <EditableNumberRangeFilterComponent
      :filter="filter"
      :isInstant="isInstant"
      :hasClearButton="hasClearButton"
    />
  `,
  range,
  filter = createEditableNumberRangeFilter('age', range),
  isInstant = false,
  hasClearButton = true
}: EditableNumberRangeFilterOptions = {}): EditableNumberRangeFilterAPI {
  Vue.observable(filter);
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store, initialXModules: [facetsXModule] }, localVue);

  resetXFacetsStateWith(store, {});
  const wrapper = mount<EditableNumberRangeFilterComponent>(
    {
      components: { EditableNumberRangeFilterComponent },
      props: ['filter', 'isInstant', 'hasClearButton'],
      template
    },
    {
      propsData: {
        filter,
        isInstant,
        hasClearButton
      },
      localVue
    }
  );

  const filterWrapper = wrapper.findComponent(EditableNumberRangeFilterComponent);
  const minInputWrapper = filterWrapper.find(getDataTestSelector('range-min'));
  const maxInputWrapper = filterWrapper.find(getDataTestSelector('range-max'));
  const applyButtonWrapper = filterWrapper.find(getDataTestSelector('range-apply'));
  const clearButtonWrapper = filterWrapper.find(getDataTestSelector('range-clear'));

  return {
    filterWrapper,
    minInputWrapper,
    maxInputWrapper,
    applyButtonWrapper,
    clearButtonWrapper,
    filter,
    typeMin: value => {
      minInputWrapper.setValue(value);
      minInputWrapper.trigger('change');
      return localVue.nextTick();
    },
    typeMax: value => {
      maxInputWrapper.setValue(value);
      maxInputWrapper.trigger('change');
      return localVue.nextTick();
    }
  };
}

describe('testing BaseNumberRangeFilter component', () => {
  it('is an x-component', () => {
    const { filterWrapper } = renderEditableNumberRangeFilter();
    expect(isXComponent(filterWrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { filterWrapper } = renderEditableNumberRangeFilter();
    expect(getXComponentXModuleName(filterWrapper.vm)).toEqual('facets');
  });

  it('renders the provided filter by default', () => {
    const { filterWrapper, applyButtonWrapper, clearButtonWrapper } =
      renderEditableNumberRangeFilter({
        range: { min: 1, max: 5 }
      });
    expect(
      (filterWrapper.find(getDataTestSelector('range-min')).element as HTMLInputElement).value
    ).toBe('1');
    expect(
      (filterWrapper.find(getDataTestSelector('range-max')).element as HTMLInputElement).value
    ).toBe('5');
    expect(applyButtonWrapper.text()).toBe('✓');
    expect(clearButtonWrapper.text()).toBe('𐄂');
  });

  // eslint-disable-next-line max-len
  it('does not emit UserModifiedEditableNumberRangeFilter event when values are invalid', async () => {
    const { filterWrapper, typeMin } = renderEditableNumberRangeFilter({
      range: { min: 1, max: 5 },
      isInstant: true
    });

    const listener = jest.fn();
    filterWrapper.vm.$x.on('UserModifiedEditableNumberRangeFilter').subscribe(listener);

    await typeMin(6);
    expect(listener).not.toHaveBeenCalled();
  });

  // eslint-disable-next-line max-len
  it('emits UserModifiedEditableNumberRangeFilter event when isInstant is true and an input is changed', async () => {
    const { filterWrapper, typeMin, typeMax } = renderEditableNumberRangeFilter({
      range: { min: 1, max: 5 },
      isInstant: true
    });

    const listener = jest.fn();
    filterWrapper.vm.$x.on('UserModifiedEditableNumberRangeFilter').subscribe(listener);

    await typeMin(2);

    expect(listener).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        range: {
          min: 2,
          max: 5
        }
      })
    );

    await typeMax(7);

    expect(listener).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        range: {
          min: 2,
          max: 7
        }
      })
    );

    expect(listener).toHaveBeenCalledTimes(2);
  });

  // eslint-disable-next-line max-len
  it('does not emit UserModifiedEditableNumberRangeFilter event when isInstant is false and an input is changed', async () => {
    const { filterWrapper, typeMin, typeMax } = renderEditableNumberRangeFilter({
      range: { min: 1, max: 5 }
    });

    const listener = jest.fn();
    filterWrapper.vm.$x.on('UserModifiedEditableNumberRangeFilter', true).subscribe(listener);

    await typeMin(2);
    await typeMax(5);
    expect(listener).not.toHaveBeenCalled();
  });

  describe('clear button testing', () => {
    it('sets min and max component values to null on clear button click', () => {
      const { filterWrapper, clearButtonWrapper, applyButtonWrapper } =
        renderEditableNumberRangeFilter({ range: { min: 1, max: 5 } });

      const listener = jest.fn();
      filterWrapper.vm.$x.on('UserModifiedEditableNumberRangeFilter').subscribe(listener);

      clearButtonWrapper.trigger('click');
      applyButtonWrapper.trigger('click');
      expect(listener).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          range: { min: null, max: null }
        })
      );
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('does not render a clear button if hasClearButton is false', () => {
      const { clearButtonWrapper } = renderEditableNumberRangeFilter({
        range: { min: 1, max: 5 },
        hasClearButton: false
      });

      expect(clearButtonWrapper.exists()).toBe(false);
    });

    it('does not render a clear button if hasClearButton is true and there are no values', () => {
      const { clearButtonWrapper } = renderEditableNumberRangeFilter({
        range: { min: null, max: null },
        hasClearButton: true
      });

      expect(clearButtonWrapper.exists()).toBe(false);
    });
  });

  describe('slots testing', () => {
    it('allows to customize apply-content slot', () => {
      const { applyButtonWrapper } = renderEditableNumberRangeFilter({
        template: `<EditableNumberRangeFilterComponent :filter="filter">
                     <template slot="apply-content">Apply</template>
                   </EditableNumberRangeFilterComponent>`,
        range: { min: 1, max: 5 }
      });

      expect(applyButtonWrapper.text()).toBe('Apply');
    });

    it('allows to customize clear-content slot', () => {
      const { clearButtonWrapper } = renderEditableNumberRangeFilter({
        template: `<EditableNumberRangeFilterComponent :filter="filter">
                     <template slot="clear-content">Clear</template>
                   </EditableNumberRangeFilterComponent>`,
        range: { min: 1, max: 5 }
      });

      expect(clearButtonWrapper.text()).toBe('Clear');
    });

    it('allows to customize the default slot', async () => {
      const { filterWrapper, applyButtonWrapper, clearButtonWrapper, typeMin, typeMax } =
        renderEditableNumberRangeFilter({
          template: `
                    <EditableNumberRangeFilterComponent
                      :filter="filter"
                      #default="{
                        min,
                        max,
                        setMin,
                        setMax,
                        emitUserModifiedFilter,
                        clearValues,
                        hasError
                      }"
                    >
                      <button @click="emitUserModifiedFilter" data-test="range-apply">
                        ✅ Apply!
                      </button>
                      <button @click="clearValues" data-test="range-clear">🗑 Clear!</button>
                      <input
                        :value="min"
                        @change="setMin($event.target.valueAsNumber)"
                        data-test="range-min"
                      />
                      <input
                        :value="max"
                        @change="setMax($event.target.valueAsNumber)"
                        data-test="range-max"
                      />
                      <div data-test="has-error" v-if="hasError">⚠️ Invalid range values</div>
                    </EditableNumberRangeFilterComponent>
                  `,
          range: { min: 7, max: 4 }
        });

      const listener = jest.fn();
      filterWrapper.vm.$x.on('UserModifiedEditableNumberRangeFilter').subscribe(listener);

      expect(applyButtonWrapper.text()).toBe('✅ Apply!');
      expect(clearButtonWrapper.text()).toBe('🗑 Clear!');

      expect(filterWrapper.find(getDataTestSelector('has-error')).text()).toBe(
        '⚠️ Invalid range values'
      );

      await typeMin(4);
      await typeMax(6);
      await applyButtonWrapper.trigger('click');
      expect(listener).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          range: {
            min: 4,
            max: 6
          }
        })
      );

      await clearButtonWrapper.trigger('click');
      await applyButtonWrapper.trigger('click');
      expect(listener).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          range: {
            min: null,
            max: null
          }
        })
      );

      expect(listener).toHaveBeenCalledTimes(2);
    });
  });
});

interface EditableNumberRangeFilterOptions {
  /**
   * The {@link @empathyco/x-types#EditableNumberRangeFilter | EditableNumberRangeFilter} object
   * to be passed to the component.
   */
  filter?: EditableNumberRangeFilter;
  /** `hasClearButton` property to init the component. */
  hasClearButton?: boolean;
  /** `isInstant` property to init the component. */
  isInstant?: boolean;
  /** The {@link @empathyco/x-types#RangeValue | RangeValue} object to init the filter. */
  range?: RangeValue;
  /** The template to be rendered. */
  template?: string;
}

interface EditableNumberRangeFilterAPI {
  /** Apply button wrapper. */
  applyButtonWrapper: Wrapper<Vue>;
  /** Clear button wrapper. */
  clearButtonWrapper: Wrapper<Vue>;
  /** The filter passed to the component. */
  filter: EditableNumberRangeFilter;
  /** Filter component wrapper. */
  filterWrapper: Wrapper<Vue>;
  /** Max input element wrapper. */
  maxInputWrapper: Wrapper<Vue>;
  /** Min input element wrapper. */
  minInputWrapper: Wrapper<Vue>;
  /** It sets max value and triggers change event in the wrapper. */
  typeMax: (value: number) => Promise<any>;
  /** It sets min value and triggers change event in the wrapper. */
  typeMin: (value: number) => Promise<any>;
}
