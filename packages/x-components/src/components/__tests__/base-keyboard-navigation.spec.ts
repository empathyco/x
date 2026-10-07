import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from 'src/store/store.types'
import type { AriaLabels } from '../../types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { Store } from 'vuex'
import { installNewXPlugin } from '../../__tests__/utils'
import { XPlugin } from '../../plugins/x-plugin'
import { DirectionalFocusNavigationService } from '../../services/directional-focus-navigation.service'
import { mergeAccesibilityLabels } from '../../utils'
import { SearchInput } from '../../x-modules/search-box/components/index'
import BaseKeyboardNavigation from '../base-keyboard-navigation.vue'

/**
 * Builds the `accesibility` injection with the given overrides merged onto the default labels.
 */
function ariaProvide(overrides: AriaLabels = {}): { accesibility: AriaLabels } {
  return { accesibility: reactive(mergeAccesibilityLabels(overrides)) }
}

describe('testing keyboard navigation component', () => {
  it('takes control of the navigation when a defined condition is triggered', async () => {
    const navigateToSpy = vi.spyOn(DirectionalFocusNavigationService.prototype as any, 'navigateTo')
    const store = new Store<DeepPartial<RootXStoreState>>({})
    mount(BaseKeyboardNavigation, {
      global: { plugins: [installNewXPlugin({ store })] },
      props: {
        navigationHijacker: [
          {
            xEvent: 'UserPressedArrowKey',
            moduleName: 'searchBox',
            direction: 'ArrowDown',
          },
        ],
      },
    })

    const searchInput = mount(SearchInput, {
      global: { provide: ariaProvide() },
    })
    await searchInput.trigger('keydown', { key: 'ArrowUp' })
    expect(navigateToSpy).not.toHaveBeenCalled()

    await searchInput.trigger('keydown', { key: 'ArrowDown' })
    expect(navigateToSpy).toHaveBeenCalled()
  })

  it('emits the defined event when reaching the limit in the direction of the navigation', async () => {
    const listener = vi.fn()
    // As cannot mock elementToFocus (it will be undefined), making the navigateTo method return undefined
    vi.spyOn(DirectionalFocusNavigationService.prototype as any, 'navigateTo').mockReturnValue(
      undefined,
    )
    const keyboardNavigation = mount(BaseKeyboardNavigation, {
      global: { plugins: [installNewXPlugin()] },
      props: {
        eventsForDirectionLimit: {
          ArrowUp: 'UserReachedEmpathizeTop',
        },
      },
    })
    XPlugin.bus.on('UserReachedEmpathizeTop').subscribe(listener)
    await keyboardNavigation.trigger('keydown', { key: 'ArrowUp' })

    expect(listener).toHaveBeenCalled()
  })
})
