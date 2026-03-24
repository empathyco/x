import { mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components'
import { XPlugin } from '../../../../plugins'
import Empathize from '../empathize.vue'

function render({
  eventsToOpenEmpathize = ['UserFocusedSearchBox', 'UserIsTypingAQuery', 'UserClickedSearchBox'],
  eventsToCloseEmpathize = [
    'UserClosedEmpathize',
    'UserSelectedASuggestion',
    'UserPressedEnterKey',
    'UserBlurredSearchBox',
  ],
  hasContent = true,
  searchAndCloseOnNoContent = false,
  template = `
    <Empathize v-bind="$attrs">
      <template #default>
        <span data-test="empathize-content">Empathize</span>
      </template>
    </Empathize>`,
} = {}) {
  const parent = document.createElement('div')
  document.body.appendChild(parent)

  const wrapper = mount(
    {
      components: { Empathize },
      template,
    },
    {
      attachTo: parent,
      props: {
        eventsToOpenEmpathize,
        eventsToCloseEmpathize,
        hasContent,
        searchAndCloseOnNoContent,
      },
      global: {
        plugins: [installNewXPlugin()],
      },
    },
  )

  return {
    emitSpy: vi.spyOn(XPlugin.bus, 'emit'),
    wrapper,
    empathize: wrapper.findComponent(Empathize),
    get empathizeContainer() {
      return wrapper.find(getDataTestSelector('empathize'))
    },
    get empathizeContent() {
      return wrapper.find(getDataTestSelector('empathize-content'))
    },
  }
}

describe('testing empathize component', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.clearAllTimers()
  })

  it('is an XComponent which has an XModule', () => {
    const { empathize } = render()

    expect(isXComponent(empathize.vm)).toBeTruthy()
    expect(getXComponentXModuleName(empathize.vm)).toEqual('empathize')
  })

  it('will not open empathize if there is no content to render', async () => {
    const template = `<Empathize v-bind="$attrs"/>`
    const { empathizeContainer, empathizeContent, emitSpy } = render({
      template,
      hasContent: false,
    })

    await XPlugin.bus.emit('UserClickedSearchBox', undefined)
    vi.runAllTimers()
    await nextTick()

    expect(empathizeContainer.exists()).toBeTruthy()
    expect(empathizeContainer.isVisible()).toBeFalsy()
    expect(empathizeContent.exists()).toBeFalsy()
    expect(emitSpy).toHaveBeenCalledTimes(1) // 'UserClickedSearchBox' event
  })

  it('listens to default events to open and close empathize', async () => {
    const { empathizeContainer, empathizeContent, emitSpy } = render()

    // Test opening with one of the default open events
    await XPlugin.bus.emit('UserClickedSearchBox', undefined)
    vi.runAllTimers()
    await nextTick()

    // Both should exist and be visible
    expect(empathizeContainer.exists()).toBeTruthy()
    expect(empathizeContainer.isVisible()).toBeTruthy()
    expect(empathizeContent.exists()).toBeTruthy()
    expect(empathizeContent.isVisible()).toBeTruthy()
    expect(emitSpy).toHaveBeenCalledWith('EmpathizeOpened', undefined, expect.any(Object))

    // Test closing with one of the default close events
    await XPlugin.bus.emit('UserClosedEmpathize', undefined)
    vi.runAllTimers()
    await nextTick()

    // Both should exist, as v-show doesn't remove the elements in the DOM, and not be visible
    expect(empathizeContainer.exists()).toBeTruthy()
    expect(empathizeContainer.isVisible()).toBeFalsy()
    expect(empathizeContent.exists()).toBeTruthy()
    expect(empathizeContent.isVisible()).toBeFalsy()
    expect(emitSpy).toHaveBeenCalledWith('EmpathizeClosed', undefined, expect.any(Object))
  })

  it('should search and close empathize fallback when has no content', async () => {
    const { wrapper, empathizeContainer, emitSpy } = render({
      hasContent: true,
      searchAndCloseOnNoContent: true,
      template: `<Empathize v-bind="$attrs"/>`,
    })

    await empathizeContainer.trigger('focusin')
    vi.runAllTimers()
    await nextTick()

    expect(empathizeContainer.exists()).toBeTruthy()
    expect(empathizeContainer.isVisible()).toBeTruthy()
    expect(emitSpy).toHaveBeenCalledWith('EmpathizeOpened', undefined, expect.any(Object))

    await wrapper.setProps({ hasContent: false } as any)
    vi.runAllTimers()
    await nextTick()

    expect(emitSpy).toHaveBeenCalledWith('UserAcceptedAQuery', '', expect.any(Object))
    expect(emitSpy).toHaveBeenCalledWith('EmpathizeClosed', undefined, expect.any(Object))
  })

  it('should respect the custom searchAndCloseDebounceInMs value', async () => {
    const customDebounceTime = 500
    const { wrapper, empathizeContainer, emitSpy } = render({
      hasContent: true,
      searchAndCloseOnNoContent: true,
      template: `<Empathize v-bind="$attrs" :searchAndCloseDebounceInMs="${customDebounceTime}"/>`,
    })

    await empathizeContainer.trigger('focusin')
    vi.runAllTimers()
    await nextTick()

    expect(empathizeContainer.exists()).toBeTruthy()
    expect(empathizeContainer.isVisible()).toBeTruthy()
    expect(emitSpy).toHaveBeenCalledWith('EmpathizeOpened', undefined, expect.any(Object))

    // Reset the emit spy to clarify assertions
    emitSpy.mockClear()

    // Set hasContent too false to trigger the searchAndClose debounce
    await wrapper.setProps({ hasContent: false } as any)

    // Advance timer by less than the debounce time - nothing should happen yet
    vi.advanceTimersByTime(customDebounceTime - 100)
    await nextTick()

    // Verify that UserAcceptedAQuery and EmpathizeClosed have not been emitted yet
    expect(emitSpy).not.toHaveBeenCalledWith(
      'UserAcceptedAQuery',
      expect.any(String),
      expect.any(Object),
    )
    expect(emitSpy).not.toHaveBeenCalledWith(
      'EmpathizeClosed',
      expect.any(String),
      expect.any(Object),
    )

    // Now advance timer to complete the debounce period
    vi.advanceTimersByTime(100)
    await nextTick()

    // Now the events should have been emitted
    expect(emitSpy).toHaveBeenCalledWith('UserAcceptedAQuery', '', expect.any(Object))
    expect(emitSpy).toHaveBeenCalledWith('EmpathizeClosed', undefined, expect.any(Object))
  })
})
