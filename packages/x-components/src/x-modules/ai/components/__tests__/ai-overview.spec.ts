import type { AiQuestion } from '@empathyco/x-types'
import type { ComponentMountingOptions } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { createAiQuestionStub } from '../../../../__stubs__/index'
import { getDataTestSelector } from '../../../../__tests__/utils'
import { useGetter } from '../../../../composables'
import AIOverview from '../ai-overview.vue'
import AiQuestionResults from '../ai-question-results.vue'

jest.mock('../../../../composables')
const typingMock = jest.fn()

const questionStub = createAiQuestionStub('test')
function render(options: ComponentMountingOptions<typeof AIOverview> = {}) {
  const wrapper = mount(AIOverview, {
    ...options,
    directives: {
      typing: typingMock,
    },
    global: {
      stubs: {
        AiQuestionResults: true,
      },
    },
  })

  return {
    wrapper,
    get titleLoading() {
      return wrapper.find(getDataTestSelector('ai-overview-title-loading'))
    },
    get titleLoadingText() {
      return wrapper.find(getDataTestSelector('ai-overview-title-loading-text'))
    },
    get title() {
      return wrapper.find(getDataTestSelector('ai-overview-title'))
    },
    get slot() {
      return wrapper.find(getDataTestSelector('ai-overview-slot'))
    },
    get slotFallback() {
      return wrapper.findComponent(AiQuestionResults)
    },
    content: wrapper.find(getDataTestSelector('ai-overview-content')),
    get expandButton() {
      return wrapper.find(getDataTestSelector('ai-overview-expand-btn'))
    },
  }
}

describe('ai-overview component', () => {
  beforeEach(() => {
    typingMock.mockClear()
    jest.clearAllMocks()
  })

  it('should render loading state and overview title', async () => {
    const currentQuestionStub = ref<AiQuestion | undefined>(undefined)
    const currentQuestionLoadingStub = ref(true)

    jest.mocked(useGetter).mockReturnValue({
      currentQuestion: currentQuestionStub,
      currentQuestionLoading: currentQuestionLoadingStub,
    } as unknown as ReturnType<typeof useGetter>)

    const sut = render()

    expect(sut.titleLoading.exists()).toBeTruthy()
    expect(sut.titleLoadingText.exists()).toBeTruthy()
    expect(sut.title.exists()).toBeFalsy()
    expect(sut.expandButton.exists()).toBeFalsy()
    // Simulate loading finished
    currentQuestionLoadingStub.value = false
    currentQuestionStub.value = questionStub
    await nextTick()

    expect(sut.expandButton.exists()).toBeTruthy()
    expect(sut.titleLoading.exists()).toBeFalsy()
    expect(sut.title.exists()).toBeTruthy()
    expect(sut.titleLoadingText.exists()).toBeFalsy()
  })

  it('should render custom title when loaded', async () => {
    jest.mocked(useGetter).mockReturnValue({
      currentQuestion: ref(questionStub),
      currentQuestionLoading: ref(false),
    } as unknown as ReturnType<typeof useGetter>)

    const customTitle = 'Custom AI Overview'
    const sut = render({
      props: { title: customTitle },
    })

    expect(sut.title.exists()).toBeTruthy()
    expect(sut.title.text()).toBe(customTitle)
  })

  it('should render custom loading title when loading', async () => {
    jest.mocked(useGetter).mockReturnValue({
      currentQuestion: ref(undefined),
      currentQuestionLoading: ref(true),
    } as unknown as ReturnType<typeof useGetter>)

    const titleLoadingTextStub = 'Custom loading AI Overview'
    const sut = render({
      props: { titleLoading: titleLoadingTextStub },
    })

    expect(sut.titleLoadingText.exists()).toBeTruthy()
    expect(typingMock.mock.calls[0][1].value).toStrictEqual({
      text: titleLoadingTextStub,
      speed: 50,
    })
  })

  it('should expand when clicking on show more button', async () => {
    jest.mocked(useGetter).mockReturnValue({
      currentQuestion: ref(questionStub),
      currentQuestionLoading: ref(false),
    } as unknown as ReturnType<typeof useGetter>)

    const slotText = 'Custom slot content'
    const sut = render({
      slots: { default: slotText },
    })

    expect(sut.slot.exists()).toBeFalsy()

    await sut.expandButton.trigger('click')

    expect(sut.slot.text()).toContain(slotText)
  })

  it('should display custom show more button text', async () => {
    jest.mocked(useGetter).mockReturnValue({
      currentQuestion: ref(questionStub),
      currentQuestionLoading: ref(false),
    } as unknown as ReturnType<typeof useGetter>)
    const buttonTextStub = 'Show more test'
    const sut = render({
      props: {
        buttonText: buttonTextStub,
      },
    })

    expect(sut.expandButton.text()).toBe(buttonTextStub)
  })

  it('should render default slot fallback if no slot is provided', async () => {
    jest.mocked(useGetter).mockReturnValue({
      currentQuestion: ref(questionStub),
      currentQuestionLoading: ref(false),
    } as unknown as ReturnType<typeof useGetter>)

    const sut = render()

    await sut.expandButton.trigger('click')

    expect(sut.slotFallback.exists()).toBeTruthy()
  })
})
