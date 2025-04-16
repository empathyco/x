import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { installNewXPlugin } from '../../__tests__/utils'
import { XPlugin } from '../../plugins'
import { searchBoxXModule } from '../../x-modules/search-box/x-module'
import { useState } from '../use-state'

function render() {
  const component = defineComponent({
    xModule: searchBoxXModule.name,
    setup: () => {
      const searchBoxUseState = useState('searchBox')
      return { searchBoxUseState }
    },
    template: `<div/>`,
  })

  const wrapper = mount(component, {
    global: {
      plugins: [installNewXPlugin()],
      mocks: {
        $store: {},
      },
    },
  })

  return wrapper.vm.searchBoxUseState
}

describe('testing useState composable', () => {
  it('should map paths of the store state given', () => {
    const { query, inputStatus } = render()

    expect(query).toBeDefined()
    expect(inputStatus).toBeDefined()
    expect(query.value).toEqual('')
    expect(inputStatus.value).toEqual('initial')

    XPlugin.store.commit('x/searchBox/setQuery', 'pork shoulder')
    XPlugin.store.commit('x/searchBox/setInputStatus', 'filled')

    expect(query.value).toEqual('pork shoulder')
    expect(inputStatus.value).toEqual('filled')
  })
})
