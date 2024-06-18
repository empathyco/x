import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { installNewXPlugin } from '../../__tests__/utils';
import { XPlugin } from '../../plugins';
import { ExtractState } from '../../x-modules/x-modules.types';
import { useState } from '../use-state';
import { searchBoxXModule } from '../../x-modules/search-box/x-module';
import { useStore } from '../use-store';

jest.mock('../use-store');

function render(modulePaths: (keyof ExtractState<'searchBox'> & string)[]) {
  installNewXPlugin();
  (useStore as jest.Mock).mockReturnValue(XPlugin.store);

  const component = defineComponent({
    xModule: 'searchBox',
    setup: () => {
      XPlugin.registerXModule(searchBoxXModule);
      const searchBoxUseState = useState('searchBox', modulePaths);
      return { searchBoxUseState };
    },
    template: `<div/>`
  });

  const wrapper = mount(component);

  return (wrapper as any).vm.searchBoxUseState;
}

describe('testing useState composable', () => {
  it('should map paths of the store state given', () => {
    const { query, inputStatus } = render(['query', 'inputStatus']);

    expect(query).toBeDefined();
    expect(inputStatus).toBeDefined();
    expect(query.value).toEqual('');
    expect(inputStatus.value).toEqual('initial');

    XPlugin.store.commit('x/searchBox/setQuery', 'pork shoulder');
    XPlugin.store.commit('x/searchBox/setInputStatus', 'filled');

    expect(query.value).toEqual('pork shoulder');
    expect(inputStatus.value).toEqual('filled');
  });

  it('should not map paths which were not requested', () => {
    const { query, inputStatus } = render(['query']);

    expect(query).toBeDefined();
    expect(inputStatus).toBeUndefined();
  });
});
