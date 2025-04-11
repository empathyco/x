import { mount } from '@vue/test-utils'
import { installNewXPlugin } from '../../__tests__/utils'
import { XPlugin } from '../../plugins/x-plugin'
import { DirectionalFocusNavigationService } from '../../services/directional-focus-navigation.service'
import { SearchInput } from '../../x-modules/search-box/components/index'
import BaseKeyboardNavigation from '../base-keyboard-navigation.vue'

describe('testing keyboard navigation component', () => {
  it('takes control of the navigation when a defined condition is triggered', async () => {
    const navigateToSpy = jest.spyOn(
      DirectionalFocusNavigationService.prototype as any,
      'navigateTo',
    )
    mount(BaseKeyboardNavigation, {
      global: { plugins: [installNewXPlugin()] },
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

    const searchInput = mount(SearchInput)
    await searchInput.trigger('keydown', { key: 'ArrowUp' })
    expect(navigateToSpy).not.toHaveBeenCalled()

    await searchInput.trigger('keydown', { key: 'ArrowDown' })
    expect(navigateToSpy).toHaveBeenCalled()
  })

  it('emits the defined event when reaching the limit in the direction of the navigation', async () => {
    const listener = jest.fn()
    // As cannot mock elementToFocus (it will be undefined), making the navigateTo method return undefined
    jest
      .spyOn(DirectionalFocusNavigationService.prototype as any, 'navigateTo')
      .mockReturnValue(undefined)
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
