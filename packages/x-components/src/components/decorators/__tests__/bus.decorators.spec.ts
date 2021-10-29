import { createLocalVue, mount, VueClass, Wrapper } from '@vue/test-utils';
import Vue, { CreateElement, VNode, VueConstructor } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import Vuex, { Store } from 'vuex';
import {
  createHierarchicalFilter,
  createSimpleFilter
} from '../../../__stubs__/filters-stubs.factory';
import { installNewXPlugin } from '../../../__tests__/utils';
import { XEvent, XEventPayload } from '../../../wiring/events.types';
import { searchBoxXStoreModule } from '../../../x-modules/search-box/store/module';
import { searchBoxXModule } from '../../../x-modules/search-box/x-module';
import { xComponentMixin } from '../../x-component.mixin';
import { XEmit, XOn } from '../bus.decorators';
import Mock = jest.Mock;

describe('testing @XOn decorator', () => {
  const createdListener = jest.fn();
  const dataListener = jest.fn();
  const multipleListener = jest.fn();
  const singleListener = jest.fn();
  const optionsListener = jest.fn();
  const filteredOptionsListener = jest.fn();
  const filteredWithMultipleOptionsListener = jest.fn();

  @Component({
    mixins: [xComponentMixin(searchBoxXModule)]
  })
  class TestingComponent extends Vue {
    protected events: XEvent[] = ['UserIsTypingAQuery', 'UserTalked'];

    created(): void {
      createdListener(this);
    }

    render(createElement: CreateElement): VNode {
      return createElement();
    }

    @XOn(component => (component as TestingComponent).events)
    testingXOnData(payload: unknown): void {
      dataListener(this, payload);
    }

    @XOn(['UserClickedOpenEventsModal', 'UserClickedCloseEventsModal'])
    testingXOnMultiple(): void {
      multipleListener(this);
    }

    @XOn('UserClickedCloseEventsModal', { moduleName: 'searchBox', feature: 'search_box' })
    testingXOnMultipleOptionsFiltered(): void {
      filteredWithMultipleOptionsListener(this);
    }

    @XOn('UserClickedOpenEventsModal', { moduleName: 'searchBox' })
    testingXOnOptions(): void {
      optionsListener(this);
    }

    @XOn('UserClickedCloseEventsModal', { moduleName: 'empathize' })
    testingXOnOptionsFiltered(): void {
      filteredOptionsListener(this);
    }

    @XOn('UserAcceptedAQuery')
    testingXOnSingle(payload: string): void {
      singleListener(this, payload);
    }
  }

  let component: Wrapper<TestingComponent>;
  let localVue: VueConstructor;

  beforeEach(() => {
    component?.vm.$destroy();
    jest.clearAllMocks();
    localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Store({
      modules: {
        x: {
          namespaced: true,
          modules: {
            searchBox: { namespaced: true, ...searchBoxXStoreModule } as any
          }
        }
      }
    });
    installNewXPlugin({}, localVue);

    component = mount(TestingComponent, {
      localVue,
      store
    });
  });

  it('calls original created hook', () => {
    expect(createdListener).toHaveBeenCalledWith(component.vm);
  });

  it('subscribes to a defined event', () => {
    component.vm.$x.emit('UserAcceptedAQuery', 'algo grasioso');

    expect(singleListener).toHaveBeenCalled();
    expect(singleListener).toHaveBeenCalledWith(component.vm, 'algo grasioso');
  });

  it('subscribes to a defined array of events', () => {
    component.vm.$x.emit('UserClickedOpenEventsModal');
    component.vm.$x.emit('UserClickedCloseEventsModal');

    expect(multipleListener).toHaveBeenCalledTimes(2);
  });

  it('subscribes dynamically to the events defined in a data property', async () => {
    component.vm.$x.emit('UserIsTypingAQuery', 'algo grasioso');
    component.vm.$x.emit('UserTalked', 'algo chistoso');

    expect(dataListener).toHaveBeenNthCalledWith(1, component.vm, 'algo grasioso');
    expect(dataListener).toHaveBeenNthCalledWith(2, component.vm, 'algo chistoso');

    (component.vm as any).events = ['UserClearedQuery'];
    await localVue.nextTick();
    dataListener.mockClear();

    component.vm.$x.emit('UserIsTypingAQuery', 'algo grasioso');
    component.vm.$x.emit('UserTalked', 'algo chistoso');
    expect(dataListener).not.toHaveBeenCalled();

    component.vm.$x.emit('UserClearedQuery', '');
    expect(dataListener).toHaveBeenCalled();
  });

  it('un-subscribes to any subscribed event when destroying the component', () => {
    component.vm.$destroy();
    component.vm.$x.emit('UserAcceptedAQuery', 'que pasara que misterios habra');
    component.vm.$x.emit('UserIsTypingAQuery', 'estare escribiendo?');
    component.vm.$x.emit('UserTalked', 'no he dicho nada');
    component.vm.$x.emit('UserClickedOpenEventsModal');
    component.vm.$x.emit('UserClickedCloseEventsModal');

    expect(singleListener).not.toHaveBeenCalled();
    expect(multipleListener).not.toHaveBeenCalled();
    expect(dataListener).not.toHaveBeenCalled();
  });

  it('filters out callback based on options passed to the decorator', () => {
    component.vm.$x.emit('UserClickedOpenEventsModal');
    expect(optionsListener).toHaveBeenCalled();
    component.vm.$x.emit('UserClickedCloseEventsModal');
    expect(filteredOptionsListener).not.toHaveBeenCalled();
  });

  it('filters out callback based on multiple options passed to the decorator', () => {
    component.vm.$x.emit('UserClickedCloseEventsModal', undefined, { feature: 'linked' });
    expect(filteredWithMultipleOptionsListener).not.toHaveBeenCalled();
    component.vm.$x.emit('UserClickedCloseEventsModal', undefined, { feature: 'search_box' });
    expect(filteredWithMultipleOptionsListener).toHaveBeenCalled();
  });
});

describe('testing @XEmit decorator', () => {
  interface RenderXEmitTestOptions {
    propsData?: Record<string, unknown>;
  }

  interface RenderXEmitTestAPI<Component extends VueClass<any>> {
    emit: Mock<void, [XEvent, XEventPayload<XEvent>]>;
    wrapper: Wrapper<InstanceType<Component>>;
  }

  function renderXEmitTest<Component extends VueClass<any>>(
    component: Component,
    { propsData }: RenderXEmitTestOptions = {}
  ): RenderXEmitTestAPI<Component> {
    const emit = jest.fn();
    const localVue = createLocalVue();
    const wrapper = mount<InstanceType<Component>>(component, {
      localVue,
      propsData,
      mocks: {
        $x: {
          emit
        }
      }
    });

    return {
      wrapper,
      emit
    };
  }

  it('emits the provided event when a prop changes', async () => {
    @Component
    class PropsTest extends Vue {
      @XEmit('UserAcceptedAQuery')
      @Prop({ required: true })
      public someProp!: string;

      render(h: CreateElement): VNode {
        return h();
      }
    }

    const { wrapper, emit } = renderXEmitTest(PropsTest, {
      propsData: { someProp: 'first' }
    });

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenNthCalledWith(1, 'UserAcceptedAQuery', 'first');

    await wrapper.setProps({ someProp: 'second' });
    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenNthCalledWith(2, 'UserAcceptedAQuery', 'second');
  });

  it('emits the provided event when a data property changes', async () => {
    @Component
    class DataPropertyTest extends Vue {
      @XEmit('UserAcceptedAQuery')
      public someData = 'first';

      render(h: CreateElement): VNode {
        return h();
      }
    }

    const { wrapper, emit } = renderXEmitTest(DataPropertyTest);

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenNthCalledWith(1, 'UserAcceptedAQuery', 'first');

    wrapper.vm.someData = 'second';
    await wrapper.vm.$nextTick();
    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenNthCalledWith(2, 'UserAcceptedAQuery', 'second');
  });

  it('emits the provided event when a computed property changes', async () => {
    @Component
    class ComputedPropertyTest extends Vue {
      public someData = 'first';

      @XEmit('UserAcceptedAQuery')
      public get computedProperty(): string {
        return `computed: ${this.someData}`;
      }

      render(h: CreateElement): VNode {
        return h();
      }
    }

    const { wrapper, emit } = renderXEmitTest(ComputedPropertyTest);

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenNthCalledWith(1, 'UserAcceptedAQuery', 'computed: first');

    wrapper.vm.someData = 'second';
    await wrapper.vm.$nextTick();
    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenNthCalledWith(2, 'UserAcceptedAQuery', 'computed: second');
  });

  it('clones the observed property if it is an array', async () => {
    @Component
    class CloningNotPrimitivesTest extends Vue {
      @XEmit('SelectedFiltersChanged')
      public someData = [createSimpleFilter('category', 'food')];

      render(h: CreateElement): VNode {
        return h();
      }
    }

    const { wrapper, emit } = renderXEmitTest(CloningNotPrimitivesTest);

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenNthCalledWith(1, 'SelectedFiltersChanged', wrapper.vm.someData);
    expect(emit.mock.calls[0][1]).not.toBe(wrapper.vm.someData);

    wrapper.vm.someData = [];
    await wrapper.vm.$nextTick();
    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenNthCalledWith(2, 'SelectedFiltersChanged', wrapper.vm.someData);
    expect(emit.mock.calls[1][1]).not.toBe(wrapper.vm.someData);
  });

  it('clones the observed property if it is an object', async () => {
    @Component
    class CloningNotPrimitivesTest extends Vue {
      @XEmit('UserClickedAFilter')
      public someData = createSimpleFilter('category', 'food');

      render(h: CreateElement): VNode {
        return h();
      }
    }

    const { wrapper, emit } = renderXEmitTest(CloningNotPrimitivesTest);

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenNthCalledWith(1, 'UserClickedAFilter', wrapper.vm.someData);
    expect(emit.mock.calls[0][1]).not.toBe(wrapper.vm.someData); // Checking for reference equality

    wrapper.vm.someData = createSimpleFilter('category', 'beverages');
    await wrapper.vm.$nextTick();
    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenNthCalledWith(2, 'UserClickedAFilter', wrapper.vm.someData);
    expect(emit.mock.calls[1][1]).not.toBe(wrapper.vm.someData); // Checking for reference equality
  });

  it('allows to deep watch objects', async () => {
    @Component
    class CloningNotPrimitivesTest extends Vue {
      @XEmit('UserClickedAHierarchicalFilter', { deep: true })
      public hierarchical = createHierarchicalFilter('category', 'food');

      @XEmit('UserClickedASimpleFilter')
      public simple = createSimpleFilter('brand', 'pepechuleton');

      render(h: CreateElement): VNode {
        return h();
      }
    }

    const { wrapper, emit } = renderXEmitTest(CloningNotPrimitivesTest);

    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenNthCalledWith(
      1,
      'UserClickedAHierarchicalFilter',
      wrapper.vm.hierarchical
    );
    expect(emit).toHaveBeenNthCalledWith(2, 'UserClickedASimpleFilter', wrapper.vm.simple);

    wrapper.vm.hierarchical.selected = true;
    wrapper.vm.simple.selected = true;
    await wrapper.vm.$nextTick();
    expect(emit).toHaveBeenCalledTimes(3);
    expect(emit).toHaveBeenNthCalledWith(
      3,
      'UserClickedAHierarchicalFilter',
      wrapper.vm.hierarchical
    );
  });

  it('allows to ignore initial value', async () => {
    @Component
    class CloningNotPrimitivesTest extends Vue {
      @XEmit('UserClickedAFilter', { immediate: false })
      public someData = createSimpleFilter('category', 'food');

      render(h: CreateElement): VNode {
        return h();
      }
    }

    const { wrapper, emit } = renderXEmitTest(CloningNotPrimitivesTest);

    expect(emit).toHaveBeenCalledTimes(0);

    wrapper.vm.someData = createSimpleFilter('category', 'beer');
    await wrapper.vm.$nextTick();
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenNthCalledWith(1, 'UserClickedAFilter', wrapper.vm.someData);
  });

  it('does not emit anything if the initial value is undefined', async () => {
    @Component
    class UndefinedValueTest extends Vue {
      @XEmit('UserAcceptedAQuery')
      @Prop()
      public someProp!: string | undefined;

      render(h: CreateElement): VNode {
        return h();
      }
    }

    const { wrapper, emit } = renderXEmitTest(UndefinedValueTest);

    expect(emit).toHaveBeenCalledTimes(0);

    wrapper.setProps({ someProp: 'nope' });
    await wrapper.vm.$nextTick();
    expect(emit).toHaveBeenCalledTimes(0);
  });
});
