import type { TypingOptions } from '../typing'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { typing } from '../typing'

function render(typingOptions: TypingOptions) {
  const wrapper = mount(
    {
      template: `<div v-typing="{text, speed}"></div>`,
      data: () => ({
        text: typingOptions.text,
        speed: typingOptions.speed,
      }),
    },
    {
      global: {
        directives: {
          typing,
        },
      },
    },
  )
  return wrapper
}

describe('typingHtmlDirective', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should write the text character by character', () => {
    const mockHtml = 'Hello, World!'
    const wrapper = render({ text: mockHtml })
    const el = wrapper.find('div').element

    expect(el.innerHTML).toBe(mockHtml[0])

    vi.runAllTimers()

    expect(el.innerHTML).toBe(mockHtml)
  })

  it('should show a console.error if a text is not send', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => vi.fn())

    render({ text: '' })

    expect(consoleSpy).toHaveBeenCalledWith('v-typing: "text" is required.')

    consoleSpy.mockRestore()
  })

  it('should call clearTimeout when typing finished', () => {
    const mockClearTimeout = vi.spyOn(globalThis, 'clearTimeout')
    render({ text: 'Hello, World!' })

    vi.runAllTimers()

    expect(mockClearTimeout).toHaveBeenCalled()
    expect(mockClearTimeout.mock.calls.length).toBeGreaterThanOrEqual(1)

    mockClearTimeout.mockRestore()
  })

  it('should call clearTimeout after unmounting directive', () => {
    const mockClearTimeout = vi.spyOn(globalThis, 'clearTimeout')
    const sut = render({ text: 'Hello, World!' })

    sut.unmount()

    expect(mockClearTimeout).toHaveBeenCalled()
    expect(mockClearTimeout.mock.calls.length).toBeGreaterThanOrEqual(1)

    mockClearTimeout.mockRestore()
  })
})
