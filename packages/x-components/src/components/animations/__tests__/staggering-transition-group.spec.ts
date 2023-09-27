import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';
import { getDataTestSelector } from '../../../__tests__/utils';
import StaggeringTransitionGroup from '../staggering-transition-group.vue';

describe('testing Staggering Transition Group component', () => {
  const wrapper: ComponentOptions<Vue> = {
    components: {
      StaggeringTransitionGroup
    },
    template: `
       <StaggeringTransitionGroup name="staggering-test" :appear="appear" :staggering="staggering">
          <div v-for="index in children"
               :key="index"
               data-test="children">
            Child {{ index }}
          </div>
       </StaggeringTransitionGroup>`,
    props: {
      children: Array,
      appear: Boolean,
      staggering: Number
    }
  };

  function renderStaggeringTransitionGroup(
    propsData: StaggeringTransitionGroupWrapper
  ): StaggeringTransitionGroupAPI {
    const component = mount(wrapper, {
      propsData
    });

    return {
      component,
      getChildren() {
        return component.findAll(getDataTestSelector('children'));
      },
      setChildren(children) {
        component.setProps({ children });
      }
    };
  }

  it('applies enter classes when appear is set to true', () => {
    const staggering = 100;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getChildren } = renderStaggeringTransitionGroup({
      appear: true,
      children: [1, 2, 3],
      staggering
    });
    const childrenWrapper = getChildren();
    expect(childrenWrapper).toHaveLength(3);
    childrenWrapper.wrappers.forEach((child, index) => {
      expect(child.classes()).toContain('staggering-test-enter-active');
      expect(child.element.style.transitionDelay).toEqual(`${staggering * index}ms`);
    });
  });

  it('applies enter classes when a new element enters.', async () => {
    const staggering = 100;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getChildren, setChildren } = renderStaggeringTransitionGroup({
      appear: false,
      children: [],
      staggering
    });
    setChildren([1, 2, 3]);
    await Vue.nextTick();
    const childrenWrapper = getChildren();
    expect(childrenWrapper).toHaveLength(3);
    childrenWrapper.wrappers.forEach((child, index) => {
      expect(child.classes()).toContain('staggering-test-enter-active');
      expect(child.element.style.transitionDelay).toEqual(`${staggering * index}ms`);
    });
  });

  it('applies move classes if child nodes change position', async () => {
    const staggering = 100;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getChildren, setChildren } = renderStaggeringTransitionGroup({
      appear: false,
      children: [3],
      staggering
    });
    const childrenToMove = getChildren().at(0);
    fakeIncrementalMovement(childrenToMove.element);
    setChildren([1, 2, 3]);
    await Vue.nextTick();
    const childrenWrapper = getChildren();
    expect(childrenWrapper).toHaveLength(3);

    childrenWrapper.wrappers.forEach((child, index) => {
      if (index < 2) {
        expect(child.classes()).toContain('staggering-test-enter-active');
        expect(child.element.style.transitionDelay).toEqual(`${staggering * (index + 1)}ms`);
      }
    });
    expect(childrenWrapper.at(2).classes()).toContain('staggering-test-move');
  });

  it('applies leave classes when a node leaves.', async () => {
    const staggering = 100;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getChildren, setChildren } = renderStaggeringTransitionGroup({
      appear: false,
      children: [1, 2, 3],
      staggering
    });
    setChildren([]);
    await Vue.nextTick();
    const childrenWrapper = getChildren();
    expect(childrenWrapper).toHaveLength(3);
    childrenWrapper.wrappers.forEach((child, index) => {
      expect(child.classes()).toContain('staggering-test-leave-active');
      expect(child.element.style.transitionDelay).toEqual(`${staggering * index}ms`);
    });
  });

  it('disables pointer-events when a node leaves.', async () => {
    const staggering = 100;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getChildren, setChildren } = renderStaggeringTransitionGroup({
      appear: false,
      children: [1, 2, 3],
      staggering
    });
    setChildren([]);
    await Vue.nextTick();
    const childrenWrapper = getChildren();
    expect(childrenWrapper).toHaveLength(3);
    childrenWrapper.wrappers.forEach(child => {
      expect(child.element.style.pointerEvents).toEqual('none');
    });
  });

  it(
    'applies enter classes when a new element enters and one element stay in ' +
      'same position after doing a search',
    async () => {
      const staggering = 100;
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const { getChildren, setChildren } = renderStaggeringTransitionGroup({
        appear: true,
        children: ['stay', 'move', 'leave0', 'leave1'],
        staggering
      });

      // eslint-disable-next-line max-len
      // Wait to `after` hooks to be executed. As there are 4 nodes, then after 4 times the staggering
      // time they should have finished executing.
      await waitFor(4 * staggering);

      const childrenToMove = getChildren().at(1);
      fakeIncrementalMovement(childrenToMove.element);
      setChildren(['stay', 'enter0', 'move', 'enter1', 'enter2']);

      await Vue.nextTick();
      const childrenWrapper = getChildren();
      expect(childrenWrapper).toHaveLength(5);
      const [stay, enter0, move, enter1, enter2] = childrenWrapper.wrappers;
      // Note that leave nodes can't be retrieved. That's why the transitionDelay starts at 200ms
      // instead of 0ms.
      expect(stay.element.style.transitionDelay).toEqual('');
      expect(enter0.element.style.transitionDelay).toEqual(`${staggering * 3}ms`);
      expect(move.element.style.transitionDelay).toEqual(`${staggering * 2}ms`);
      expect(enter1.element.style.transitionDelay).toEqual(`${staggering * 4}ms`);
      expect(enter2.element.style.transitionDelay).toEqual(`${staggering * 5}ms`);

      expect(stay.classes()).toHaveLength(0);
      expect(enter0.classes()).toContain('staggering-test-enter-active');
      expect(move.classes()).toContain('staggering-test-move');
      expect(enter1.classes()).toContain('staggering-test-enter-active');
      expect(enter2.classes()).toContain('staggering-test-enter-active');
    }
  );
});

// For fake move position and enter in applyTranslation and get new position
function fakeIncrementalMovement(element: HTMLElement): void {
  let position = 0;
  element.getBoundingClientRect = () =>
    ({
      left: position++,
      top: position++
    } as DOMRect);
}

// Method for enter in hooks of component afterEnter
function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface StaggeringTransitionGroupWrapper {
  appear: boolean;
  children: (string | number)[];
  staggering: number;
}

interface StaggeringTransitionGroupAPI {
  component: Wrapper<Vue>;
  getChildren(): WrapperArray<Vue>;
  setChildren(children: (string | number)[]): void;
}
