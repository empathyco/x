import type { UseXModuleDisplayOptions } from '../use-x-module-display'
import { mount } from '@vue/test-utils'
import { useElementVisibility } from '@vueuse/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import {
  isXModuleDisplayed,
  resetXModulesDisplayedConsumers,
} from '../../plugins/x-module-visibility'
import { useXModuleDisplay } from '../use-x-module-display'

vi.mock('@vueuse/core', () => ({
  useElementVisibility: vi.fn(),
}))

const isElementVisible = ref(false)
vi.mocked(useElementVisibility).mockReturnValue(isElementVisible)

function mountTester(options: Partial<UseXModuleDisplayOptions> = {}, renderEmpty = false) {
  return mount(
    defineComponent({
      setup() {
        useXModuleDisplay({ moduleName: 'nextQueries', ...options })
        return () => (renderEmpty ? null : h('div'))
      },
    }),
    { attachTo: document.body },
  )
}

describe('testing useXModuleDisplay composable', () => {
  beforeEach(() => {
    vi.mocked(useElementVisibility).mockClear()
    isElementVisible.value = false
    resetXModulesDisplayedConsumers()
  })

  it('registers the module as displayed while the component is visible', async () => {
    const wrapper = mountTester()
    expect(isXModuleDisplayed('nextQueries')).toBe(false)

    isElementVisible.value = true
    await nextTick()
    expect(isXModuleDisplayed('nextQueries')).toBe(true)

    isElementVisible.value = false
    await nextTick()
    expect(isXModuleDisplayed('nextQueries')).toBe(false)

    isElementVisible.value = true
    await nextTick()
    wrapper.unmount()
    expect(isXModuleDisplayed('nextQueries')).toBe(false)
  })

  it('watches the root element, or its parent when the component renders nothing', async () => {
    const wrapper = mountTester()
    await nextTick()
    const target = vi.mocked(useElementVisibility).mock.calls[0][0] as { value: unknown }
    expect(target.value).toBe(wrapper.element)

    vi.mocked(useElementVisibility).mockClear()
    const emptyWrapper = mountTester({}, true)
    await nextTick()
    const emptyTarget = vi.mocked(useElementVisibility).mock.calls[0][0] as { value: unknown }
    expect(emptyTarget.value).toBe(emptyWrapper.element.parentElement)
  })
})
