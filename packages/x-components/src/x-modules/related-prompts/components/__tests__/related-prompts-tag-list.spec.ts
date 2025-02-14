/* eslint-disable jest/no-conditional-expect */
import { nextTick, reactive, ref, TransitionGroup } from 'vue';
import { mount } from '@vue/test-utils';
import SlidingPanel from '../../../../components/sliding-panel.vue';
import RelatedPrompt from '../related-prompt.vue';
import { getRelatedPromptsStub } from '../../../../__stubs__/related-prompts-stubs.factory';
import relatedPromptsTagList from '../related-prompts-tag-list.vue';

const relatedPromptsStub = getRelatedPromptsStub(5);
const selectedPromptIndexStub = ref(-1);
const queryStub = reactive({ search: 'query' });
const propsStub = {
  buttonClass: 'button-class',
  tagClass: 'related-prompt-class',
  tagColors: ['color1', 'color2', 'color3'],
  animationDurationInMs: 4000
};

const xUseStateMock = jest.fn((module: string, paths: string[]) => {
  void module;
  void paths;
  return { selectedPrompt: selectedPromptIndexStub, relatedPrompts: ref(relatedPromptsStub) };
});
const xEmitMock = jest.fn((event: string, payload: number) => {
  void event;
  void payload;
});
jest.mock('../../../../composables', () => ({
  use$x: jest.fn(() => ({
    emit: (event: string, payload: number) => xEmitMock(event, payload),
    query: queryStub
  })),
  useState: (module: string, paths: string[]) => xUseStateMock(module, paths)
}));

const maxWidthStub = '100px';
const getComputedStyleMock = jest.fn((element: Element) => {
  void element;

  return { maxWidth: maxWidthStub } as CSSStyleDeclaration;
});
global.getComputedStyle = getComputedStyleMock;

const offsetLeftsStub = Array.from(
  { length: relatedPromptsStub.length },
  (_, index) => index * 100
);
Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
  configurable: true,
  get() {
    if (this.parentElement) {
      const index = Array.from(this.parentElement.children).indexOf(this);
      return offsetLeftsStub[index];
    }
    return 0;
  }
});

const coloredRelatedPromptsStub = relatedPromptsStub.map((relatedPrompt, index) => ({
  ...relatedPrompt,
  colorClass: propsStub.tagColors[index % propsStub.tagColors.length],
  index
}));

global.requestAnimationFrame = cb => setTimeout(cb, propsStub.animationDurationInMs - 1);

function render() {
  const wrapper = mount(relatedPromptsTagList, {
    props: propsStub
  });

  return {
    wrapper,
    slidingPanel: wrapper.findComponent(SlidingPanel),
    transitionGroup: wrapper.findComponent(TransitionGroup),
    get listItems() {
      return wrapper.findAll('[data-test="related-prompts-tag-list-item"]');
    },
    get relatedPrompts() {
      return wrapper.findAllComponents(RelatedPrompt);
    }
  };
}

describe('relatedPromptsTagList component', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.useFakeTimers();
    selectedPromptIndexStub.value = -1;
    queryStub.search = 'query';
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should render correctly', async () => {
    const sut = render();

    jest.runAllTimers(); // setTimeout from inmediate watch callback implementation
    await nextTick();

    expect(xUseStateMock).toHaveBeenCalledWith('relatedPrompts', [
      'relatedPrompts',
      'selectedPrompt'
    ]);

    expect(sut.slidingPanel.props().resetOnContentChange).toBeFalsy();
    expect(sut.slidingPanel.props().buttonClass).toBe(propsStub.buttonClass);

    expect(sut.transitionGroup.props().css).toBeFalsy();
    expect(sut.transitionGroup.props().appear).toBeDefined();
    expect(sut.transitionGroup.props().appear).not.toStrictEqual(false);

    expect(sut.listItems).toHaveLength(relatedPromptsStub.length);
    expect(sut.relatedPrompts).toHaveLength(relatedPromptsStub.length);
    coloredRelatedPromptsStub.forEach(({ colorClass, index, ...relatedPrompt }) => {
      expect(sut.listItems[index].classes()).toContain(propsStub.tagClass);
      expect(sut.listItems[index].classes()).toContain(colorClass);
      expect(sut.listItems[index].attributes('data-index')).toBe(index.toString());
      expect((sut.listItems[index].element as HTMLElement).style.pointerEvents).toBe('');

      expect(sut.relatedPrompts[index].props().relatedPrompt).toStrictEqual(relatedPrompt);
      expect(sut.relatedPrompts[index].props().selected).toBeFalsy();
    });
  });

  it('should reset the state propperly when the query changes', async () => {
    const selectedPromptIndex = 1;
    const widthStub = '100px';

    const sut = render();

    jest.runAllTimers(); // setTimeout from inmediate watch callback implementation
    await nextTick();

    queryStub.search = 'new query';
    await nextTick(); // watch callback

    (sut.listItems[selectedPromptIndex].element as HTMLElement).style.width = widthStub; // Mocking selected RP style

    sut.listItems.forEach(listItem => {
      const listItemElement = listItem.element as HTMLElement;

      expect(listItemElement.style.pointerEvents).toBe('none');
    });

    jest.runAllTimers(); // setTimeout from resetTransitionStyle function

    sut.listItems.forEach((listItem, index) => {
      const listItemElement = listItem.element as HTMLElement;

      expect(listItemElement.style.pointerEvents).toBe('');

      if (index === selectedPromptIndex) {
        expect(listItemElement.style).toHaveLength(1);
        expect(listItemElement.style.width).toBe(widthStub);
      } else {
        expect(listItemElement.style).toHaveLength(0);
      }
    });
  });

  it('should reset the state propperly when clicking a list item', async () => {
    const clickedRelatedPromptIndex = 1;
    const widthStub = '100px';

    const sut = render();

    await sut.listItems[clickedRelatedPromptIndex].trigger('click');

    (sut.listItems[clickedRelatedPromptIndex].element as HTMLElement).style.width = widthStub; // Mocking selected RP style

    sut.listItems.forEach(listItem => {
      const listItemElement = listItem.element as HTMLElement;

      expect(listItemElement.style.pointerEvents).toBe('none');
    });

    jest.runAllTimers(); // setTimeout from resetTransitionStyle function

    sut.listItems.forEach((listItem, index) => {
      const listItemElement = listItem.element as HTMLElement;

      expect(listItemElement.style.pointerEvents).toBe('');

      if (index === clickedRelatedPromptIndex) {
        expect(listItemElement.style).toHaveLength(1);
        expect(listItemElement.style.width).toBe(widthStub);
      } else {
        expect(listItemElement.style).toHaveLength(0);
      }
    });
  });

  it('should execute click callback correctly when selecting a RP', async () => {
    selectedPromptIndexStub.value = -1;
    const clickedRelatedPromptIndex = 1;
    const singleAnimationDurationStub =
      propsStub.animationDurationInMs / (relatedPromptsStub.length - 1);

    const sut = render();

    jest.runAllTimers(); // setTimeout from inmediate watch callback implementation
    await nextTick();

    await sut.relatedPrompts[clickedRelatedPromptIndex].trigger('click');

    // Prepare the animation
    sut.listItems.forEach((listItem, index) => {
      const listItemElement = listItem.element as HTMLElement;

      expect(listItemElement.style.left).toBe(`${offsetLeftsStub[index]}px`);
      expect(listItemElement.style.position).toBe('absolute');
      expect(listItemElement.style.transitionDuration).toBe(`${singleAnimationDurationStub}ms`);

      if (index !== clickedRelatedPromptIndex) {
        expect(listItemElement.style.opacity).toBe('1');
        expect(listItemElement.style.transitionDelay).toBe(
          `${
            (index < clickedRelatedPromptIndex ? index : index - 1) * singleAnimationDurationStub
          }ms`
        );
      } else {
        expect(listItemElement.style.transitionDelay).toBe(
          `${
            (relatedPromptsStub.length > 1 ? relatedPromptsStub.length - 2 : 0) *
            singleAnimationDurationStub
          }ms`
        );
      }
    });

    // Trigger the animation
    jest.advanceTimersByTime(propsStub.animationDurationInMs - 1); // only requestAnimationFrame execution
    await nextTick();

    const selectedElement = sut.listItems[clickedRelatedPromptIndex].element as HTMLElement;

    expect(getComputedStyleMock).toHaveBeenCalledWith(selectedElement);

    expect(selectedElement.style.width).toBe(`${maxWidthStub}`);
    expect(selectedElement.style.left).toBe('0px');

    expect(xEmitMock).toHaveBeenCalledWith('UserSelectedARelatedPrompt', clickedRelatedPromptIndex);
  });

  it('should execute RelatedPrompt click callback correctly when deselecting a selected RP', async () => {
    selectedPromptIndexStub.value = -1;
    const clickedRelatedPromptIndex = 1;
    const singleAnimationDurationStub =
      propsStub.animationDurationInMs / (relatedPromptsStub.length - 1);

    const sut = render();

    jest.runAllTimers(); // setTimeout from inmediate watch callback implementation
    await nextTick();

    await sut.relatedPrompts[clickedRelatedPromptIndex].trigger('click'); // Selecting a RP
    selectedPromptIndexStub.value = clickedRelatedPromptIndex;

    jest.runAllTimers(); // Force the selecting to be done
    await nextTick();

    await sut.relatedPrompts[0].trigger('click'); // 0 is now the selected RP (the others are not rendered)

    // Prepare the animation
    const selectedElement = sut.listItems[0].element as HTMLElement;

    expect(selectedElement.style.position).toBe('absolute');
    expect(selectedElement.style.left).toBe('0px');
    expect(selectedElement.style.transitionDuration).toBe(`${singleAnimationDurationStub}ms`);

    // Trigger the animation
    expect(selectedElement.style.width).toBe('');

    jest.advanceTimersByTime(propsStub.animationDurationInMs - 1); // only requestAnimationFrame execution
    await nextTick();

    expect(selectedElement.style.left).toBe(`${offsetLeftsStub[selectedPromptIndexStub.value]}px`);

    expect(xEmitMock).toHaveBeenCalledWith(
      'UserSelectedARelatedPrompt',
      selectedPromptIndexStub.value
    );
  });

  it('should render only the selected RP', async () => {
    selectedPromptIndexStub.value = 1;

    const sut = render();

    jest.runAllTimers(); // setTimeout from inmediate watch callback implementation
    await nextTick();

    expect(sut.listItems).toHaveLength(1);
    expect(sut.relatedPrompts).toHaveLength(1);
    expect(sut.listItems[0].attributes('data-index')).toBe(`${selectedPromptIndexStub.value}`);
    expect(sut.relatedPrompts[0].props().relatedPrompt).toStrictEqual(
      relatedPromptsStub[selectedPromptIndexStub.value]
    );
    expect(sut.relatedPrompts[0].props().selected).toBeTruthy();
  });

  //TODO: Test the transition group callbacks
});
/* eslint-enable jest/no-conditional-expect */
