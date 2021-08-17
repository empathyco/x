import { mount } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import Component from 'vue-class-component';
import { ComponentOptions } from 'vue/types/umd';
import { Dictionary } from '../../utils';
import { ExtraParamXEvent } from '../../wiring';
import { XProvide } from '../decorators/injection.decorators';
import BaseExtraParams from '../base-extra-params.vue';

describe('testing extra params component', () => {
  const emitSpy = jest.fn();

  @Component({
    template: `<div><slot/></div>`
  })
  class Provider extends Vue {
    @XProvide('snippetConfig')
    public snippetConfig: Record<string, any> = {
      warehouse: 1234
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderExtraParams({
    template = `<BaseExtraParams :events="events" :values="values" />`,
    components,
    events,
    values
  }: RenderExtraParamsOptions): void {
    mount(
      {
        template,
        components: {
          BaseExtraParams,
          ...components
        },
        props: ['events', 'values']
      },
      {
        propsData: {
          events,
          values
        },
        mocks: {
          $x: {
            emit: emitSpy
          }
        }
      }
    );
  }

  it('emits the default event when none event is passed as prop', () => {
    renderExtraParams({
      values: { warehouse: 1234 }
    });

    expect(emitSpy).toHaveBeenCalledWith('UserChangedRequestParams', { warehouse: 1234 });
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits a custom event passed as prop', () => {
    renderExtraParams({
      events: ['UserChangedNextQueriesRequestParam', 'UserChangedSearchRequestParam'],
      values: { catalog: 'catalog', warehouse: 1234 }
    });

    expect(emitSpy).toHaveBeenCalledWith('UserChangedNextQueriesRequestParam', { warehouse: 1234 });
    expect(emitSpy).toHaveBeenCalledWith('UserChangedNextQueriesRequestParam', {
      catalog: 'catalog'
    });
    expect(emitSpy).toHaveBeenCalledWith('UserChangedSearchRequestParam', { warehouse: 1234 });
    expect(emitSpy).toHaveBeenCalledWith('UserChangedSearchRequestParam', { catalog: 'catalog' });
    expect(emitSpy).toHaveBeenCalledTimes(4);
  });

  // eslint-disable-next-line max-len
  it('emits the default event when none event is passed as prop and emit the values of the snippet config', () => {
    renderExtraParams({
      template: `
        <Provider>
          <BaseExtraParams :values="values" />
        </Provider>
      `,
      components: {
        Provider
      },
      values: {
        store: 'store'
      }
    });

    expect(emitSpy).toHaveBeenCalledWith('UserChangedRequestParams', { warehouse: 1234 });
    expect(emitSpy).toHaveBeenCalledWith('UserChangedRequestParams', { store: 'store' });
    expect(emitSpy).toHaveBeenCalledTimes(2);
  });

  // eslint-disable-next-line max-len
  it('emits a default event when none event is passed as prop and override the values of the snippet config', () => {
    renderExtraParams({
      template: `
        <Provider>
          <BaseExtraParams :values="values" />
        </Provider>
      `,
      components: {
        Provider
      },
      values: {
        warehouse: 'warehouse'
      }
    });

    expect(emitSpy).toHaveBeenCalledWith('UserChangedRequestParams', { warehouse: 'warehouse' });
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  // eslint-disable-next-line max-len
  it('emits a custom event passed as prop and override the values of the snippet config', () => {
    renderExtraParams({
      template: `
        <Provider>
          <BaseExtraParams :values="values" :events="events" />
        </Provider>
      `,
      components: {
        Provider
      },
      values: {
        warehouse: 'warehouse'
      },
      events: ['UserChangedRecommendationsRequestParam']
    });

    expect(emitSpy).toHaveBeenCalledWith('UserChangedRecommendationsRequestParam', {
      warehouse: 'warehouse'
    });
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});

interface RenderExtraParamsOptions {
  /** The template to be rendered. */
  template?: string;
  /** Components to be rendered. */
  components?: Dictionary<VueConstructor | ComponentOptions<Vue>>;
  /** The list of events to emit. */
  events?: ExtraParamXEvent[];
  /** The extra params values to emit in the events. */
  values?: Record<string, any>;
}
