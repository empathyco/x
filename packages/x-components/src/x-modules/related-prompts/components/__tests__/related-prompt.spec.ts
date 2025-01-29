import { ComponentMountingOptions, mount } from '@vue/test-utils';
import RelatedPrompt from '../related-prompt.vue';
import CrossTinyIcon from '../../../../components/icons/cross-tiny.vue';
import PlusIcon from '../../../../components/icons/plus.vue';
import { createRelatedPromptStub } from '../../../../__stubs__';

const relatedPromptStub = createRelatedPromptStub('Related Prompt 1');

const typingMock = jest.fn();

function render(options: ComponentMountingOptions<typeof RelatedPrompt> = {}) {
  const wrapper = mount(RelatedPrompt, {
    ...options,
    props: { relatedPrompt: relatedPromptStub, ...options.props },
    directives: {
      typing: typingMock
    }
  });

  return {
    wrapper,
    crossIcon: wrapper.findComponent(CrossTinyIcon),
    plusIcon: wrapper.findComponent(PlusIcon)
  };
}

describe('relatedPrompt component', () => {
  it('should render correctly', () => {
    const sut = render();

    const [el, binding] = typingMock.mock.calls[0];

    expect(typingMock).toHaveBeenCalled();
    expect(el.tagName).toBe('SPAN');
    expect(binding.value).toStrictEqual({ text: 'Related Prompt 1', speed: 50 });

    expect(sut.crossIcon.exists()).toBeFalsy();
    expect(sut.plusIcon.exists()).toBeTruthy();
  });

  it('should render cross icon when selected prop is true', () => {
    const sut = render({ props: { relatedPrompt: relatedPromptStub, selected: true } });

    expect(sut.crossIcon.exists()).toBeTruthy();
    expect(sut.plusIcon.exists()).toBeFalsy();
  });
});
