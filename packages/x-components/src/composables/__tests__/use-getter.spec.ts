import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { installNewXPlugin } from '../../__tests__/utils';
import { useGetter } from '../use-getter';
import { useRegisterXModule } from '../use-register-x-module';
import { ExtractGetters } from '../../x-modules/x-modules.types';
import { useStore } from '../use-store';
import { XPlugin } from '../../plugins';
import { historyQueriesXModule } from '../../x-modules/history-queries/x-module';

jest.mock('../use-store');

function render(modulePaths: (keyof ExtractGetters<'historyQueries'>)[]) {
  installNewXPlugin();
  (useStore as jest.Mock).mockReturnValue(XPlugin.store);

  const component = defineComponent({
    xModule: 'historyQueries',
    setup: () => {
      useRegisterXModule(historyQueriesXModule);
      const historyQueriesGetter = useGetter('historyQueries', modulePaths);
      return { historyQueriesGetter };
    },
    template: `<div/>`
  });

  const wrapper = mount(component);

  return (wrapper as any).vm.historyQueriesGetter;
}

describe('testing useGetter composable', () => {
  it('maps store getters', () => {
    const { storageKey, historyQueries } = render(['storageKey', 'historyQueries']);
    expect(storageKey.value).toEqual('history-queries');
    expect(historyQueries.value).toHaveLength(0);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    XPlugin.store.dispatch('x/historyQueries/addQueryToHistory', 'chorizo');

    expect(historyQueries.value).toHaveLength(1);
  });

  it('does not return not requested getters', () => {
    const { storageKey, historyQueries } = render(['storageKey']);
    expect(storageKey).toBeDefined();
    expect(historyQueries).toBeUndefined();
  });
});
