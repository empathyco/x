import { mount, VueClass, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { XInject, XProvide } from '../injection.decorators';

@Component({
  template: `<div><slot/></div>`,
  provide: {
    defaultInjectWayValue: 'DefaultInjectValue'
  }
})
class Provider extends Vue {
  @Prop()
  @XProvide('items')
  public items!: string[];

  @Prop()
  @XProvide('value')
  public simpleValue!: string;

  @XInject('notProvidedKey', 'DefaultValue')
  public notProvided!: string;
}

@Component({
  template: `<div><slot/></div>`,
  inject: ['defaultInjectWayValue']
})
class FilterItems extends Vue {
  public defaultInjectWayValue!: string;

  @XInject('items')
  public items!: string[];

  @XProvide('items')
  public get evenItems(): string[] {
    return this.items.filter((_, index) => index % 2 === 0);
  }
}

@Component({
  template: `<div><slot/></div>`,
  inject: ['defaultInjectWayValue']
})
class Child extends Vue {
  public defaultInjectWayValue!: string;

  @XInject('items')
  public items!: string[];

  @XInject('value')
  public simpleValue!: string;
}

describe('testing inject decorators', () => {
  function mountComponent(
    { items = [] as string[], simpleValue = '' } = {},
    template = `
    <Provider v-bind="$attrs">
      <FilterItems>
        <Child/>
      </FilterItems>
    </Provider>`
  ): RenderInjectionComponentsAPI {
    const wrapper = mount(
      {
        template,
        components: { Provider, FilterItems, Child }
      },
      { propsData: { items, simpleValue } }
    );

    return {
      providerWrapper: wrapper.findComponent(Provider as VueClass<Provider>),
      filterItemsWrapper: wrapper.findComponent(FilterItems as VueClass<FilterItems>),
      childWrapper: wrapper.findComponent(Child as VueClass<Child>)
    };
  }

  it('renders the injected values from a parent', () => {
    const items = ['a', 'b', 'c'];
    const simpleValue = 'Test Value';
    const { childWrapper } = mountComponent(
      {
        items,
        simpleValue
      },
      '<Provider v-bind="$attrs"><Child/></Provider>'
    );

    expect(childWrapper.vm.items).toEqual(items);
    expect(childWrapper.vm.simpleValue).toEqual(simpleValue);
  });

  it(`renders the overridden injected value from a grandparent with a component
            in the middle that overrides that injection`, () => {
    const items = ['a', 'b', 'c'];
    const expectedItems = ['a', 'c'];
    const { childWrapper } = mountComponent({ items });

    expect(childWrapper.vm.items).toEqual(expectedItems);
  });

  it('renders the injected value even when it overrides it for the children', () => {
    const items = ['a', 'b', 'c'];
    const { filterItemsWrapper } = mountComponent({ items });

    expect(filterItemsWrapper.vm.items).toEqual(items);
  });

  it(`renders an injected value provided from grandparent component with a component
            in the middle that doesn't inject neither provide that value`, () => {
    const simpleValue = 'Test Value';
    const { childWrapper } = mountComponent({
      simpleValue
    });

    expect(childWrapper.vm.simpleValue).toEqual(simpleValue);
  });

  it(`reacts to updates from an injected value provided by grandparent component with a component
            in the middle that doesn't inject neither provide that value`, async () => {
    const simpleValue = 'Test Value';
    const newSimpleValue = 'New Test Value';
    const { childWrapper, providerWrapper } = mountComponent({
      simpleValue
    });

    expect(childWrapper.vm.simpleValue).toEqual(simpleValue);
    await providerWrapper.setProps({ simpleValue: newSimpleValue });
    expect(childWrapper.vm.simpleValue).toEqual(newSimpleValue);
  });

  it(`reacts to updates from an injected value provided by grandparent component with a component
            in the middle that overrides that injection`, async () => {
    const items = ['a', 'b', 'c', 'd'];
    const expectedItems = ['a', 'c'];
    const newItems = ['1', '2', '3', '4', '5'];
    const newExpectedItems = ['1', '3', '5'];
    const { childWrapper, providerWrapper } = mountComponent({
      items
    });

    expect(childWrapper.vm.items).toEqual(expectedItems);
    await providerWrapper.setProps({ items: newItems });
    expect(childWrapper.vm.items).toEqual(newExpectedItems);
  });

  it('keeps the default injection working', () => {
    const { filterItemsWrapper, childWrapper } = mountComponent({
      items: ['a', 'b', 'c', 'd'],
      simpleValue: 'SimpleValue'
    });
    expect(filterItemsWrapper.vm.defaultInjectWayValue).toEqual('DefaultInjectValue');
    expect(childWrapper.vm.defaultInjectWayValue).toEqual('DefaultInjectValue');
  });

  it('injects default value if the inject key is not provided', () => {
    const { providerWrapper } = mountComponent({}, '<Provider/>');
    expect(providerWrapper.vm.notProvided).toEqual('DefaultValue');
  });
});

interface RenderInjectionComponentsAPI {
  providerWrapper: Wrapper<Provider>;
  filterItemsWrapper: Wrapper<FilterItems>;
  childWrapper: Wrapper<Child>;
}
