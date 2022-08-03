import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue-global-events';
import Vuex, { Store } from 'vuex';
import { VueConstructor } from 'vue';
import { SearchInputPlaceholder } from '..';
import { isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { installNewXPlugin, getDataTestSelector } from '../../../../__tests__/utils';
import { resetXSearchBoxStateWith } from './utils';

let localVue: VueConstructor<Vue>;
let store: Store<DeepPartial<RootXStoreState>>;

const FakeAnimation = {
  name: 'FakeAnimation',
  template: '<transition v-on="$listeners"><slot /></transition>'
};

function mountFakeAnimation(): Wrapper<Vue> {
  return mount(FakeAnimation, {
    localVue
  });
}

function mountSearchInputPlaceholder(options = {}): Wrapper<SearchInputPlaceholder> {
  return mount(SearchInputPlaceholder, {
    localVue,
    store,
    propsData: {
      animatedPlaceholders: ['milk', 'butter', 'cookies'],
      animation: FakeAnimation
    },
    slots: { default: 'Find anything' },
    ...options
  });
}

async function simulatePlaceholderAnimation(wrapper: Wrapper<Vue>): Promise<void> {
  wrapper.findComponent({ name: 'FakeAnimation' }).vm.$emit('after-enter');
  await wrapper.vm.$nextTick();
}
async function simulateUserFocusedSearchBox(wrapper: Wrapper<Vue>): Promise<void> {
  wrapper.vm.$x.emit('UserFocusedSearchBox');
  await wrapper.vm.$nextTick();
}

async function simulateUserBlurredSearchBox(wrapper: Wrapper<Vue>): Promise<void> {
  wrapper.vm.$x.emit('UserBlurredSearchBox');
  await wrapper.vm.$nextTick();
}

function getAnimatedPlaceholderElement(wrapper: Wrapper<Vue>): HTMLElement {
  return wrapper.find(getDataTestSelector('animated-placeholder')).element;
}

function getDefaultPlaceholderElement(wrapper: Wrapper<Vue>): HTMLElement {
  return wrapper.find(getDataTestSelector('default-placeholder')).element;
}

describe('search input placeholder', () => {
  let wrapper: Wrapper<SearchInputPlaceholder>;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Store<DeepPartial<RootXStoreState>>({});
    installNewXPlugin({ store }, localVue);

    resetXSearchBoxStateWith(store, { query: '' });

    mountFakeAnimation();
    wrapper = mountSearchInputPlaceholder();
    document.body.appendChild(wrapper.element);
  });

  afterEach(() => {
    document.body.removeChild(wrapper.element);
  });

  it('is an XComponent', () => {
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('is visible if the query is empty', async () => {
    resetXSearchBoxStateWith(store, { query: '' });
    await wrapper.vm.$nextTick();

    expect(wrapper.element).toBeVisible();
  });

  it('is NOT visible if the query is NOT empty', async () => {
    resetXSearchBoxStateWith(store, { query: 'milk' });
    await wrapper.vm.$nextTick();

    expect(wrapper.element).not.toBeVisible();
  });

  it('shows the default placeholder if the search box is NOT focused', async () => {
    await simulateUserBlurredSearchBox(wrapper);

    expect(getDefaultPlaceholderElement(wrapper)).toBeDefined();
    expect(getDefaultPlaceholderElement(wrapper)).toHaveTextContent('Find anything');
  });

  // eslint-disable-next-line max-len
  it('shows the default placeholder if the search box is focused and animatedPlaceholders prop is empty', async () => {
    const wrapper = mountSearchInputPlaceholder({
      propsData: {
        animation: FakeAnimation
      }
    });

    await simulateUserFocusedSearchBox(wrapper);

    expect(getDefaultPlaceholderElement(wrapper)).toBeDefined();
    expect(getDefaultPlaceholderElement(wrapper)).toHaveTextContent('Find anything');
    expect(getAnimatedPlaceholderElement(wrapper)).not.toBeDefined();
  });

  it('shows the animated placeholders if the search box is focused', async () => {
    await simulateUserFocusedSearchBox(wrapper);

    expect(getAnimatedPlaceholderElement(wrapper)).toBeDefined();

    expect(getAnimatedPlaceholderElement(wrapper)).toHaveTextContent('milk');
  });

  it('renders and loops through the animated placeholders', async () => {
    await simulateUserFocusedSearchBox(wrapper);

    // In the tests, `showAnimation` is being called when the component is mounted.
    // This is the reason why the second placeholder is being displayed here first.
    expect(getAnimatedPlaceholderElement(wrapper)).toHaveTextContent('milk');

    await simulatePlaceholderAnimation(wrapper);

    expect(getAnimatedPlaceholderElement(wrapper)).toHaveTextContent('butter');

    await simulatePlaceholderAnimation(wrapper);

    expect(getAnimatedPlaceholderElement(wrapper)).toHaveTextContent('cookies');

    await simulatePlaceholderAnimation(wrapper);

    expect(getAnimatedPlaceholderElement(wrapper)).toHaveTextContent('milk');
  });
});
