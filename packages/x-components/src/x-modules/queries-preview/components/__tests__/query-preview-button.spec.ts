import Vuex, { Store } from 'vuex';
import { mount, createLocalVue, Wrapper, WrapperArray } from '@vue/test-utils';
import { DeepPartial, Dictionary } from '@empathyco/x-utils';
import Vue from 'vue';
import { RootXStoreState } from '../../../../store/index';
import { findTestDataById, installNewXPlugin } from '../../../../__tests__/utils';
import { XPlugin } from '../../../../plugins/index';
import { queriesPreviewXModule } from '../../x-module';
import QueryPreviewButton from '../query-preview-button.vue';
import { QueryPreviewInfo } from '../../store/index';
import { getXComponentXModuleName, isXComponent } from '../../../../components/index';

function renderQueryPreviewButton({
  queryPreviewInfo = { query: 'milk', extraParams: { store: 'Magrathea' } },
  template = `<QueryPreviewButton v-bind="$attrs" />`
}: RenderQueryPreviewButtonOptions = {}): RenderQueryPreviewButtonAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);
  XPlugin.registerXModule(queriesPreviewXModule);

  const queryPreviewButtonEmitSpy = jest.fn();
  XPlugin.bus.on('UserAcceptedAQueryPreview').subscribe(queryPreviewButtonEmitSpy);

  const wrapper = mount(
    {
      components: { QueryPreviewButton },
      template
    },
    {
      localVue,
      store,
      propsData: {
        queryPreviewInfo
      }
    }
  ).findComponent(QueryPreviewButton);

  const findTestDataByIdInButton = findTestDataById.bind(undefined, wrapper);

  return {
    wrapper,
    queryPreviewButtonEmitSpy,
    queryPreviewInfo,
    findTestDataById: findTestDataByIdInButton,
    clickQueryPreviewButton: () =>
      findTestDataByIdInButton('query-preview-button').trigger('click'),
    updateExtraParams: async params => {
      store.commit('x/queriesPreview/setParams', params);
      await localVue.nextTick();
    }
  };
}

describe('query preview button', () => {
  jest.useFakeTimers();
  afterEach(() => {
    jest.runAllTimers();
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderQueryPreviewButton();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('queriesPreview');
  });

  it('default slot with the query text of the query preview', () => {
    const { wrapper } = renderQueryPreviewButton();
    expect(wrapper.text()).toBe('milk');
  });

  it('can override the content of the slot', () => {
    const { findTestDataById } = renderQueryPreviewButton({
      template: `
        <QueryPreviewButton v-bind="$attrs">
          <template #default="{ queryPreviewInfo }">
            <span data-test="custom-content">{{ 'View more ' + queryPreviewInfo.query }}</span>
          </template>
        </QueryPreviewButton>
      `
    });
    expect(findTestDataById('custom-content')).toBeTruthy();
  });

  it('sends the `UserAcceptedAQueryPreview` event when the button is clicked', async () => {
    const { clickQueryPreviewButton, queryPreviewButtonEmitSpy, updateExtraParams } =
      renderQueryPreviewButton();

    clickQueryPreviewButton();
    expect(queryPreviewButtonEmitSpy).toHaveBeenCalledTimes(1);
    expect(queryPreviewButtonEmitSpy).toHaveBeenCalledWith({
      query: 'milk',
      extraParams: {
        store: 'Magrathea'
      }
    });

    await updateExtraParams({ warehouse: 42 });

    clickQueryPreviewButton();
    expect(queryPreviewButtonEmitSpy).toHaveBeenCalledTimes(2);
    expect(queryPreviewButtonEmitSpy).toHaveBeenCalledWith({
      query: 'milk',
      extraParams: {
        store: 'Magrathea',
        warehouse: 42
      }
    });
  });
});

interface RenderQueryPreviewButtonOptions {
  /** The query preview info to be used in the component. */
  queryPreviewInfo?: QueryPreviewInfo;
  /** The template to be rendered. */
  template?: string;
}

interface RenderQueryPreviewButtonAPI {
  /** The wrapper of the rendered component. */
  wrapper: Wrapper<Vue>;
  /** The spy to check if the event was emitted. */
  queryPreviewButtonEmitSpy: jest.Mock;
  /** The query preview info to be used in the component. */
  queryPreviewInfo: QueryPreviewInfo;
  /** The function to find a data-test by its id. */
  findTestDataById: (id: string) => WrapperArray<Vue>;
  /** Clicks the query preview button. */
  clickQueryPreviewButton: () => void;
  /** Updates the extra params of the query preview module. */
  updateExtraParams: (params: Dictionary<unknown>) => Promise<void>;
}
