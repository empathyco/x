import type { XPlugin } from '../plugins'
import { createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { XComponentsAdapterDummy } from '../__tests__/adapter.dummy'
import { XInstaller } from './x-installer'

const xPluginMock = { install: vi.fn() }
const plugin = xPluginMock as unknown as XPlugin

describe('xInstaller pinia option', () => {
  it('passes the pinia instance to the plugin installation options', async () => {
    const pinia = createPinia()

    await new XInstaller({
      adapter: XComponentsAdapterDummy,
      plugin,
      pinia,
      rootComponent: { template: '<h1/>' },
    }).init({ instance: 'test', lang: 'test', scope: 'test' })

    expect(xPluginMock.install).toHaveBeenCalledTimes(1)
    expect(xPluginMock.install.mock.calls[0][1].pinia).toBe(pinia)
  })
})
