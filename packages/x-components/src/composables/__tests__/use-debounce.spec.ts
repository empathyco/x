import type { DebounceOptions } from '../../utils/types'
import { mount } from '@vue/test-utils'
import { useDebounce } from '../use-debounce'

const fnMock = jest.fn()
const fnParamStub = 'It is a parameter'

function render(debounceTimeInMs = 200, debounceOptions: DebounceOptions = {}) {
  const wrapper = mount({
    setup: () => {
      const debouncedFnMock = useDebounce(
        (param: string) => fnMock(param),
        debounceTimeInMs,
        debounceOptions,
      )
      const onClick = () => debouncedFnMock(fnParamStub)
      return { onClick }
    },
    template: `<button @click="onClick">Execute fn debounced</button>`,
  })

  return {
    wrapper,
    runDebouncedFnMock: async () => wrapper.trigger('click'),
  }
}

describe('testing useDebounce composable', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  beforeEach(() => {
    fnMock.mockClear()
  })
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('should debounce the fn with the debounced time', async () => {
    const { runDebouncedFnMock } = render()

    await runDebouncedFnMock()
    expect(fnMock).toHaveBeenCalledTimes(0)
    jest.advanceTimersByTime(200)
    expect(fnMock).toHaveBeenCalledTimes(1)
    expect(fnMock).toHaveBeenCalledWith(fnParamStub)

    fnMock.mockClear()
    await runDebouncedFnMock()
    jest.advanceTimersByTime(100)
    await runDebouncedFnMock()
    jest.advanceTimersByTime(150)
    expect(fnMock).toHaveBeenCalledTimes(0)
    jest.advanceTimersByTime(50)
    expect(fnMock).toHaveBeenCalledTimes(1)
    expect(fnMock).toHaveBeenCalledWith(fnParamStub)
  })

  it('should propagate options to the debounce util', async () => {
    const { runDebouncedFnMock } = render(200, { leading: true })

    await runDebouncedFnMock()
    expect(fnMock).toHaveBeenCalledTimes(1)
    await runDebouncedFnMock()
    jest.advanceTimersByTime(200)
    expect(fnMock).toHaveBeenCalledTimes(2)
    expect(fnMock).toHaveBeenCalledWith(fnParamStub)
  })

  it('should cancel debounce fn when component is unmounted', async () => {
    const { wrapper, runDebouncedFnMock } = render()

    await runDebouncedFnMock()
    jest.advanceTimersByTime(100)
    wrapper.unmount()
    jest.advanceTimersByTime(500)
    expect(fnMock).toHaveBeenCalledTimes(0)
  })
})
