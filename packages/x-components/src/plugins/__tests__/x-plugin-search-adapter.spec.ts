import { mount } from '@vue/test-utils'
import { XDummyBus } from '../../__tests__/bus.dummy'
import { XPlugin } from '../x-plugin'

describe('testing adapter configuration', () => {
  let xPlugin: XPlugin

  beforeEach(() => {
    jest.clearAllMocks()
    xPlugin = new XPlugin(new XDummyBus())
  })

  it('throws an error if no adapter is passed', () => {
    expect(() => mount({}, { global: { plugins: [xPlugin] } })).toThrow()
  })
})
