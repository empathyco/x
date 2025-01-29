import { ref, TransitionGroup } from 'vue';
import { mount } from '@vue/test-utils';
import SlidingPanel from '../../../../components/sliding-panel.vue';
import RelatedPrompt from '../related-prompt.vue';
import { getRelatedPromptsStub } from '../../../../__stubs__/related-prompts-stubs.factory';
import relatedPromptsTagList from '../related-prompts-tag-list.vue';

const relatedPromptsStub = getRelatedPromptsStub(5);
const selectedPromptIndexStub = ref(-1);
const propsStub = {
  buttonClass: 'button-class',
  relatedPromptClass: 'related-prompt-class',
  tagColors: ['color1', 'color2', 'color3'],
  animationDurationInMs: 4000
};
const singleAnimationDurationStub =
  propsStub.animationDurationInMs / (relatedPromptsStub.length - 1);

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
    emit: (event: string, payload: number) => xEmitMock(event, payload)
  })),
  useState: (module: string, paths: string[]) => xUseStateMock(module, paths)
}));

const requestAnimationFrameCallbackMock = jest.fn();
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  requestAnimationFrameCallbackMock.mockImplementationOnce(() => callback(0));
  return 0;
};

// TODO: fix this
// const setTimeoutCallbackMock = jest.fn();
// const setTimeoutMock = jest.fn((callback: () => void, ms?: number) => {
//   void ms;
//   setTimeoutCallbackMock.mockImplementationOnce(callback);
//   return 0 as unknown as ReturnType<typeof setTimeout>;
// });
// jest.spyOn(global, 'setTimeout');
// jest.useFakeTimers();

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

function render() {
  const wrapper = mount(relatedPromptsTagList, {
    props: propsStub,
    global: {
      stubs: {
        TransitionGroup: {
          template: '<div><slot /></div>',
          props: ['css'],
          emits: ['enter', 'leave']
        }
      }
    }
  });

  return {
    wrapper,
    slidingPanel: wrapper.findComponent(SlidingPanel),
    transitionGroup: wrapper.findComponent(TransitionGroup),
    get relatedPrompts() {
      return wrapper.findAllComponents(RelatedPrompt);
    }
  };
}

describe('relatedPromptsTagList component', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    selectedPromptIndexStub.value = -1;
  });

  it('shoudl render correctly', () => {
    const sut = render();

    expect(xUseStateMock).toHaveBeenCalledWith('relatedPrompts', [
      'relatedPrompts',
      'selectedPrompt'
    ]);

    expect(sut.slidingPanel.props().resetOnContentChange).toBeFalsy();
    expect(sut.slidingPanel.props().buttonClass).toBe(propsStub.buttonClass);
    expect(sut.slidingPanel.props().scrollContainerClass).toContain(
      'desktop:x-sliding-panel-fade desktop:x-sliding-panel-fade-sm'
    );
    expect(sut.transitionGroup.props().css).toBeFalsy();
    expect(sut.relatedPrompts).toHaveLength(relatedPromptsStub.length);
    coloredRelatedPromptsStub.forEach(({ colorClass, index, ...relatedPrompt }) => {
      expect(sut.relatedPrompts[index].props().relatedPrompt).toStrictEqual(relatedPrompt);
      expect(sut.relatedPrompts[index].classes()).toContain(colorClass);
      expect(sut.relatedPrompts[index].classes()).toContain(propsStub.relatedPromptClass);
      expect(sut.relatedPrompts[index].attributes('data-index')).toBe(index.toString());
      expect(sut.relatedPrompts[index].attributes('disabled')).not.toBeDefined();
    });
  });

  it('should execute RelatedPrompt click callback correctly when no selected RP', async () => {
    const sut = render();

    await sut.relatedPrompts[1].trigger('click');

    sut.relatedPrompts.forEach(relatedPrompt => {
      expect(relatedPrompt.attributes('disabled')).toBeDefined();
    });

    const selected = sut.relatedPrompts[1];

    expect(selected.element.style.transition).toBe('all');
    expect(selected.element.style.transitionDuration).toBe(`${singleAnimationDurationStub}ms`);
    expect(selected.element.style.transitionDelay).toBe(
      `${(relatedPromptsStub.length - 2) * singleAnimationDurationStub}ms`
    );

    sut.relatedPrompts.forEach((relatedPrompt, index) => {
      expect(relatedPrompt.element.style.left).toBe(`${offsetLeftsStub[index]}px`);
      expect(relatedPrompt.element.style.top).toBe('0px');
      expect(relatedPrompt.element.style.opacity).toBe('1');
      expect(relatedPrompt.element.style.position).toBe('absolute');
    });

    requestAnimationFrameCallbackMock();

    expect(getComputedStyleMock).toHaveBeenCalledWith(selected.element);

    expect(selected.element.style.width).toBe(`${maxWidthStub}`);
    expect(selected.element.style.left).toBe('0px');

    // TODO: test setTimeout callback
  });
});
