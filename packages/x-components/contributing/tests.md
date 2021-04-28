# Tests

- Keep the description blocks simple, explaining what is the test about, not how you are testing it:

```js
// ❌ Wrong
it(
  'focuses the previous element when the user presses the down arrow key, the next element when the user presses the up arrow key and loops, the first element when the user is in the last element and presses the down arrow key, and the last element when the user is in the first element and presses the up arrow key '
);

// ✅ Good
it('changes the selected element when navigating with the arrow keys');
```

- The sentence must make sense when concatenating it with the `it` test method:

```js
// ❌ Wrong
it('the element is focused when the dropdown is open');

// ✅ Good
it('focuses the element when the dropdown is open');
```

- If the text description is longer than the max line length disable the eslint warning.

```js
// ❌ Wrong
it(
  'emits `UserAlmostReachedScrollEnd` and`UserReachedScrollEnd` when the user ' +
    'scrolls to the bottom'
);

// ✅ Good
// eslint-disable-next-line max-len
it(
  'emits `UserAlmostReachedScrollEnd` and`UserReachedScrollEnd` when the user scrolls to the bottom'
);
```

## Factory functions

Use
[factory functions](https://lmiller1990.github.io/vue-testing-handbook/components-with-props.html#refactor-with-a-factory-function)
whenever is possible to DRY in the mount process.

- Include every property passed to the `mount` function that is used in the tests.

```js
// ❌ Wrong
import TestComponentA from './test-component-a.vue';
import TestComponentB from './test-component-b.vue';

it('does this', () => {
  const wrapper = mount(TestComponentA, {
    propsData: { propA: 'valueA' },
    components: { TestComponentB }
  });
});

it('does that', () => {
  const wrapper = mount(TestComponentA, {
    propsData: { propA: 'valueB' },
    components: { TestComponentB }
  });
});

// ✅ Good
import TestComponentA from './test-component-a.vue';
import TestComponentB from './test-component-b.vue';

const factory = propsData => {
  return mount(TestComponentA, {
    propsData,
    components: { TestComponentB }
  });
};

it('does this', () => {
  const wrapper = factory({ propA: 'valueA' });
});

it('does that', () => {
  const wrapper = factory({ propA: 'valueB' });
});
```

- Along it, you can return more properties including repeated functionality to keep the test simple.
  Then you have an API with methods to test the component easier or just access to data like the
  default data set in the component.

```ts
// ❌ Wrong
import TestComponentA from './test-component-a.vue';
import TestComponentB from './test-component-b.vue';
import Vue from 'vue';

const factory = propsData => {
  return mount(TestComponentA, {
    propsData,
    components: { TestComponentB }
  });
};

it('does this', async () => {
  const wrapper = factory({ propA: 'valueA' });
  wrapper.findComponent(TestComponentB).trigger('click');
  await Vue.nextTick();
});

it('does that', async () => {
  const wrapper = factory({ propB: 'valueB' });
  wrapper.findComponent(TestComponentB).trigger('click');
  await Vue.nextTick();
});

// ✅ Good
import TestComponentA from './test-component-a.vue';
import TestComponentB from './test-component-b.vue';

const factory = ({ propA = 'default' }) => {
  const wrapper = mount(TestComponentA, {
    propsData: {
      propA
    },
    components: { TestComponentB }
  });

  async function toggleComponentB() {
    await wrapper.findComponent(TestComponentB).trigger('click');
  }

  return {
    wrapper,
    propA,
    toggleComponentB
  };
};

it('does this', async () => {
  const { wrapper, toggleComponentB, propA } = factory();
  await toggleComponentB();
});

it('does that', async () => {
  const { wrapper, toggleComponentB } = factory({ propA: 'valueB' });
  await toggleComponentB();
});
```

- Remember to give proper names to the API interface in order to give information about what it does
  instead of how it does it. It's mandatory to define interfaces for the API inputs, and the output
  to keep the API clearer.

```ts
// ✅ Good
import TestComponentA from './test-component-a.vue';
import TestComponentB from './test-component-b.vue';

const factory = ({ propA = 'default', listData }: FactoryOptions): FactoryAPI => {
  const wrapper = mount(TestComponentA, {
    data() {
      list: listData;
    },
    propsData: {
      propA
    },
    components: { TestComponentB }
  });

  async function toggleComponentB() {
    await wrapper.findComponent(TestComponentB).trigger('click');
  }

  return {
    wrapper,
    propA,
    listData,
    toggleComponentB
  };
};

interface FactoryOptions {
  /** PropA passed to the TestComponentA. */
  propA: string;
  /** Data list of the TestComponentA. */
  listData: string[];
}

interface FactoryAPI {
  /** Vue Test Utils Wrapper. */
  wrapper: Wrapper<Vue>;
  /** Current propA passed to the TestComponentA. */
  propA: string;
  /** Current list data of the TestComponentA. */
  listData: string[];
  /** It toggles the TestComponentB. */
  toggleComponentB: () => Promise<void>;
}
```

- Sometimes it's easier to create a wrapper component in which we can import and render our
  component or components, especially when we use slots, defining the template. It's preferable to
  test the component isolated without this wrapper. Notice that you can also include this within a
  factory function in order to override the template as another property.

```js
// ✅ Good
import TestComponentA from './test-component-a.vue';
import TestComponentB from './test-component-b.vue';

it('does this', () => {
  const wrapper = mount(
    {
      components: { TestComponentA, TestComponentB },
      props: ['propA'],
      template: `<div>
                   <TestComponentA :propA='propA' />
                   <TestComponentB />
                 </div>
                `
    },
    {
      propsData: {
        propA
      }
    }
  );
});
```
