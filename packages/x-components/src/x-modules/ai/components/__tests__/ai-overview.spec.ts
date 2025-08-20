import type { AiQuestion } from '@empathyco/x-types'
import type { ComponentMountingOptions } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { createAiQuestionStub } from '../../../../__stubs__/index'
import { getDataTestSelector } from '../../../../__tests__/utils'
import { useGetter } from '../../../../composables'
import AIOverview from '../ai-overview.vue'

jest.mock('../../../../composables')
const typingMock = jest.fn()

const questionStub = createAiQuestionStub('test')
function render(options: ComponentMountingOptions<typeof AIOverview> = {}) {
  const wrapper = mount(AIOverview, {
    ...options,
    directives: {
      typing: typingMock,
    },
  })

  return {
    wrapper,
    get expandButton() {
      return wrapper.find(getDataTestSelector('ai-overview-expand-btn'))
    },
    get loading() {
      return wrapper.find(getDataTestSelector('ai-overview-loading'))
    },
    get title() {
      return wrapper.find(getDataTestSelector('ai-overview-title'))
    },
    get titleLoading() {
      return wrapper.find(getDataTestSelector('ai-overview-title-loading'))
    },
    get slot() {
      return wrapper.find(getDataTestSelector('ai-overview-slot'))
    },
    get slotFallback() {
      return wrapper.find(getDataTestSelector('ai-overview-slot-fallback'))
    },
    content: wrapper.find(getDataTestSelector('ai-overview-content')),
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

    expect(sut.loading.exists()).toBeTruthy()
    expect(sut.titleLoading.exists()).toBeTruthy()
    expect(sut.title.exists()).toBeFalsy()
    expect(sut.expandButton.exists()).toBeFalsy()
    // Simulate loading finished
    currentQuestionLoadingStub.value = false
    currentQuestionStub.value = questionStub
    await nextTick()

    expect(sut.expandButton.exists()).toBeTruthy()
    expect(sut.loading.exists()).toBeFalsy()
    expect(sut.title.exists()).toBeTruthy()
    expect(sut.titleLoading.exists()).toBeFalsy()
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

    const titleLoadingStub = 'Custom loading AI Overview'
    const sut = render({
      props: { titleLoading: titleLoadingStub },
    })

    expect(sut.titleLoading.exists()).toBeTruthy()
    expect(typingMock.mock.calls[0][1].value).toStrictEqual({
      text: titleLoadingStub,
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
