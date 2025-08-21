import type { ComponentMountingOptions } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { createAiQuestionStub, createResultStub } from '../../../../__stubs__/index'
import { getDataTestSelector } from '../../../../__tests__/utils'
import SlidingPanel from '../../../../components/sliding-panel.vue'
import { QueryPreviewButton, QueryPreviewList } from '../../../queries-preview'
import AiQuestionResults from '../ai-question-results.vue'

const questionStub = createAiQuestionStub('test question')
const resultsStub = [createResultStub('result1'), createResultStub('result2')]

function render(options: ComponentMountingOptions<typeof AiQuestionResults> = {}) {
  const wrapper = mount(AiQuestionResults, {
    props: {
      question: questionStub,
      ...options.props,
    },
    ...options,
    global: {
      stubs: {
        QueryPreviewList: {
          template: `
            <div data-test="query-preview-list">
              <slot :queryPreviewInfo="{ query: 'test query' }" :results="results" />
            </div>
          `,
          props: [
            'maxItemsToRender',
            'queriesPreviewInfo',
            'debounceTimeMs',
            'persistInCache',
            'queryFeature',
          ],
          data() {
            return {
              results: resultsStub,
            }
          },
        },
        QueryPreviewButton: {
          template: `
            <div data-test="query-preview-button">
              <slot name="related-prompt-extra-content" />
            </div>
          `,
          props: ['queryPreviewInfo', 'metadata'],
        },
        SlidingPanel: {
          template: `
            <div data-test="sliding-panel">
              <slot />
            </div>
          `,
          props: ['scrollContainerClass'],
        },
        Result: {
          template: '<div data-test="result" :data-result-id="result.id"></div>',
          props: ['result'],
        },
      },
      ...options.global,
    },
  })

  return {
    wrapper,
    get queryPreviewList() {
      return wrapper.find(getDataTestSelector('query-preview-list'))
    },
    get queryPreviewButton() {
      return wrapper.find(getDataTestSelector('query-preview-button'))
    },
    get slidingPanel() {
      return wrapper.find(getDataTestSelector('sliding-panel'))
    },
    get results() {
      return wrapper.findAll(getDataTestSelector('result'))
    },
  }
}

describe('ai-question-results component', () => {
  it('should render the component with all child components', () => {
    const sut = render()

    expect(sut.wrapper.find('.x-ai-question-results-wrapper').exists()).toBeTruthy()
    expect(sut.wrapper.find('.x-ai-question-results-wrapper-content').exists()).toBeTruthy()
    expect(sut.queryPreviewList.exists()).toBeTruthy()
    expect(sut.queryPreviewButton.exists()).toBeTruthy()
    expect(sut.slidingPanel.exists()).toBeTruthy()
  })

  it('should pass correct props to QueryPreviewList', () => {
    const sut = render()
    const queryPreviewList = sut.wrapper.findComponent(QueryPreviewList)

    expect(queryPreviewList.props()).toEqual({
      maxItemsToRender: 10,
      queriesPreviewInfo: questionStub.content?.searchQueries.map(query => ({ query })),
      debounceTimeMs: 0,
      persistInCache: '',
      queryFeature: 'related_prompts',
    })
  })

  it('should pass correct props to QueryPreviewButton', () => {
    const sut = render()
    const queryPreviewButton = sut.wrapper.findComponent(QueryPreviewButton)

    expect(queryPreviewButton.props('metadata')).toEqual({ feature: 'related_prompts' })
    expect(queryPreviewButton.classes()).toContain('x-ai-question-results-preview-button')
  })

  it('should pass correct props to SlidingPanel', () => {
    const sut = render()
    const slidingPanel = sut.wrapper.findComponent(SlidingPanel)

    expect(slidingPanel.props('scrollContainerClass')).toBe(
      'x-px-8 x-gap-16 md:x-px-16 x-pb-8 md:x-pb-16',
    )
  })

  it('should render results with correct props and classes', () => {
    const sut = render()

    expect(sut.results).toHaveLength(2)
    sut.results.forEach((result, index) => {
      expect(result.attributes('data-result-id')).toBe(resultsStub[index].id)
    })
  })

  it('should compute mappedQueries correctly from question prop', () => {
    const customQuestion = createAiQuestionStub('custom question')
    customQuestion.content = {
      ...customQuestion.content,
      searchQueries: ['query1', 'query2', 'query3'],
    }

    const sut = render({
      props: { question: customQuestion },
    })

    const queryPreviewList = sut.wrapper.findComponent(QueryPreviewList)
    expect(queryPreviewList.props('queriesPreviewInfo')).toEqual([
      { query: 'query1' },
      { query: 'query2' },
      { query: 'query3' },
    ])
  })

  it('should handle question without searchQueries gracefully', () => {
    const questionWithoutQueries = createAiQuestionStub('no queries')
    questionWithoutQueries.content = {
      ...questionWithoutQueries.content,
      searchQueries: [],
    }

    const sut = render({
      props: { question: questionWithoutQueries },
    })

    const queryPreviewList = sut.wrapper.findComponent(QueryPreviewList)
    expect(queryPreviewList.props('queriesPreviewInfo')).toEqual([])
  })

  it('should handle question without content gracefully', () => {
    const questionWithoutContent = { ...createAiQuestionStub('no content'), content: undefined }

    const sut = render({
      props: { question: questionWithoutContent },
    })

    const queryPreviewList = sut.wrapper.findComponent(QueryPreviewList)
    expect(queryPreviewList.props('queriesPreviewInfo')).toBeUndefined()
  })

  it('should render the related-prompt-extra-content slot', () => {
    const slotContent = '<div data-test="extra-content">Extra content</div>'
    const sut = render({
      slots: {
        'related-prompt-extra-content': slotContent,
      },
    })

    expect(sut.wrapper.find(getDataTestSelector('extra-content')).exists()).toBeTruthy()
    expect(sut.wrapper.find(getDataTestSelector('extra-content')).text()).toBe('Extra content')
  })

  it('should apply correct CSS classes', () => {
    const sut = render()

    expect(sut.wrapper.find('.x-ai-question-results-wrapper').classes()).toContain(
      'x-ai-question-results-wrapper',
    )
    expect(sut.wrapper.find('.x-ai-question-results-wrapper-content').classes()).toContain(
      'x-ai-question-results-wrapper-content',
    )

    const queryPreviewButton = sut.wrapper.findComponent(QueryPreviewButton)
    expect(queryPreviewButton.classes()).toContain('x-ai-question-results-preview-button')
  })

  it('should require question prop', () => {
    // Test that the component has the question prop defined as required
    expect(AiQuestionResults.props.question.required).toBe(true)
  })
})
