import { mount } from '@vue/test-utils';
import { default as Vue } from 'vue';
import { useXBus } from '../use-x-bus';
import { bus } from '../../plugins/x-bus';

describe('testing useXBus', () => {
  const emitSpy = jest.spyOn(bus, 'emit');
  const onSpy = jest.spyOn(bus, 'on');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exposes an API containing `on` and `emit` functions that use the `XBus`', () => {
    /* eslint-disable-next-line @typescript-eslint/unbound-method */
    const { on, emit } = useXBus();
    on('ColumnsNumberProvided', true);
    emit('ColumnsNumberProvided', 2, { customMetadata: 'custom' });

    expect(onSpy).toHaveBeenCalledTimes(1);
    expect(onSpy).toHaveBeenCalledWith('ColumnsNumberProvided', true);
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      'ColumnsNumberProvided',
      2,
      expect.objectContaining({
        replaceable: true,
        customMetadata: 'custom'
      })
    );
  });

  // eslint-disable-next-line max-len
  it('emits the event with the metadata regarding location and moduleName of root X component', () => {
    const location = 'Magrathea';
    const moduleName = 'searchBox';

    const nonXComponent = Vue.extend({
      setup() {
        /* eslint-disable-next-line @typescript-eslint/unbound-method */
        const { on, emit } = useXBus();
        on('ColumnsNumberProvided', true);
        emit('ColumnsNumberProvided', 2);

        return {};
      },
      template: '<div></div>'
    });

    mount({
      xModule: moduleName,
      render(h) {
        return h(nonXComponent);
      },
      provide: {
        location: 'Magrathea'
      }
    });

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('ColumnsNumberProvided', 2, {
      replaceable: true,
      moduleName,
      location
    });
  });
});
