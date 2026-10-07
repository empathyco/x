import type { HistoryQuery } from '@empathyco/x-types'
import type { DeepPartial } from '@empathyco/x-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { RootXStoreState } from '../../../../store/store.types'
import type { AriaLabels } from '../../../../types'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, reactive } from 'vue'
import { Store } from 'vuex'
import { createHistoryQueries } from '../../../../__stubs__/index'
import { installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils'
import { XPlugin } from '../../../../plugins/x-plugin'
import { mergeAccesibilityLabels } from '../../../../utils'
import { historyQueriesXModule } from '../../x-module'
import HistoryQueriesSwitch from '../history-queries-switch.vue'
import { resetXHistoryQueriesStateWith } from './utils'

/**
 * Builds the `accesibility` injection with the given overrides merged onto the default labels.
 */
function ariaProvide(overrides: AriaLabels = {}): { accesibility: AriaLabels } {
  return { accesibility: reactive(mergeAccesibilityLabels(overrides)) }
}

async function renderHistoryQueriesSwitch({
  historyQueries = createHistoryQueries('jacket', 'tshirt'),
  isEnabled = false,
  ariaLabels,
}: HistoryQueriesSwitchOptions = {}): Promise<HistoryQueriesSwitchAPI> {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const wrapper = mount(HistoryQueriesSwitch, {
    global: {
      plugins: [installNewXPlugin({ store, initialXModules: [historyQueriesXModule] })],
      provide: ariaProvide(ariaLabels),
    },
  })

  resetXHistoryQueriesStateWith(store, { isEnabled, historyQueries })
  await nextTick()

  return {
    wrapper,
  }
}

describe('testing HistoryQueriesSwitch component', () => {
  it('is an XComponent which has an XModule', async () => {
    const { wrapper } = await renderHistoryQueriesSwitch()

    expect(isXComponent(wrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('historyQueries')
  })

  it('renders the default aria-label on the switch', async () => {
    const { wrapper } = await renderHistoryQueriesSwitch()

    expect(wrapper.attributes('aria-label')).toBe("Queries' history")
  })

  it('allows overriding the aria-label of the switch', async () => {
    const { wrapper } = await renderHistoryQueriesSwitch({
      ariaLabels: { HistoryQueriesSwitch: { root: 'History queries' } },
    })

    expect(wrapper.attributes('aria-label')).toBe('History queries')
  })

  it('resolves the aria-label of the switch from the global configuration', async () => {
    const { wrapper } = await renderHistoryQueriesSwitch({
      ariaLabels: { HistoryQueriesSwitch: { root: 'Historial de consultas' } },
    })

    expect(wrapper.attributes('aria-label')).toBe('Historial de consultas')
  })

  it('should emit proper events when toggling its state', async () => {
    const { wrapper } = await renderHistoryQueriesSwitch()
    const enableListener = vi.fn()
    const disableListener = vi.fn()

    XPlugin.bus.on('UserClickedEnableHistoryQueries').subscribe(enableListener)
    XPlugin.bus.on('UserClickedDisableHistoryQueries').subscribe(disableListener)

    await wrapper.trigger('click')

    expect(enableListener).toHaveBeenCalledTimes(1)
    expect(XPlugin.store.state.x.historyQueries.isEnabled).toBe(true)

    await wrapper.trigger('click')

    expect(disableListener).toHaveBeenCalledTimes(1)
  })

  it('should emit confirm disable event if there are not history queries', async () => {
    const { wrapper } = await renderHistoryQueriesSwitch({
      historyQueries: [],
      isEnabled: true,
    })
    const listener = vi.fn()
    XPlugin.bus.on('UserClickedConfirmDisableHistoryQueries').subscribe(listener)

    await wrapper.trigger('click')
    await flushPromises()

    expect(listener).toHaveBeenCalledTimes(1)
    expect(XPlugin.store.state.x.historyQueries.isEnabled).toBe(false)
  })
})

/**
 * Test options for the {@link HistoryQueriesSwitch} component.
 */
interface HistoryQueriesSwitchOptions {
  /** The History Queries to set in the state. */
  historyQueries?: HistoryQuery[]
  /** Initial state of the switch. */
  isEnabled?: boolean
  /** Global aria labels overrides for the component. */
  ariaLabels?: AriaLabels
}

/**
 * Test API for the {@link HistoryQueriesSwitch} component.
 */
interface HistoryQueriesSwitchAPI {
  /** The wrapper for HistoryQueriesSwitch component. */
  wrapper: VueWrapper
}
