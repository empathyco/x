import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { installNewXPlugin } from '../../__tests__/utils';
import { XPlugin } from '../../plugins/x-plugin';
import { useXBus } from '../use-x-bus';
import { XDummyBus } from '../../__tests__/bus.dummy';

let onColumnsNumberProvidedMock = jest.fn();

function render(withMetadata = true) {
  const dummyBus = new XDummyBus();
  const emitSpy = jest.spyOn(dummyBus, 'emit');
  const onSpy = jest.spyOn(dummyBus, 'on');
  const component = defineComponent({
    xModule: 'searchBox',
    setup: () => {
      const bus = useXBus();
      bus.on('ColumnsNumberProvided', withMetadata).subscribe(onColumnsNumberProvidedMock);
      bus.emit('ColumnsNumberProvided', 10, { customMetadata: 'custom' });
    },
    template: `<div/>`
  });
  const wrapper = mount(component, {
    global: {
      plugins: [installNewXPlugin({}, dummyBus)],
      provide: { location: 'Magrathea' }
    }
  });
  return {
    wrapper,
    emitSpy,
    onSpy
  };
}

describe('testing useXBus', () => {
  beforeEach(() => {
    onColumnsNumberProvidedMock = jest.fn();
  });

  it('should emit and on subscription in the bus for registered events', () => {
    const { onSpy, emitSpy } = render();

    const metadata = {
      customMetadata: 'custom',
      moduleName: 'searchBox',
      location: 'Magrathea',
      replaceable: true
    };

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('ColumnsNumberProvided', 10, metadata);
    expect(onSpy).toHaveBeenCalledTimes(1);
    expect(onSpy).toHaveBeenCalledWith('ColumnsNumberProvided', true);
    expect(onColumnsNumberProvidedMock).toHaveBeenCalledWith({ eventPayload: 10, metadata });
  });

  it('should not emit metadata if it was not configured for', () => {
    render(false);

    expect(onColumnsNumberProvidedMock).toHaveBeenCalledWith(10);
  });

  it('should emit events natively in Vue', () => {
    const { wrapper } = render();

    expect(wrapper.emitted()).toEqual({ ColumnsNumberProvided: [[10]] });
  });

  it('should unsubscribe from events when component is unmounted', async () => {
    const { wrapper } = render();
    const payloadGenerator = (eventPayload: number) => expect.objectContaining({ eventPayload });

    expect(onColumnsNumberProvidedMock).toHaveBeenCalledTimes(1); // Component mounting
    expect(onColumnsNumberProvidedMock).toHaveBeenNthCalledWith(1, payloadGenerator(10));
    await XPlugin.bus.emit('ColumnsNumberProvided', 50);
    expect(onColumnsNumberProvidedMock).toHaveBeenCalledTimes(2); // Bus emission
    expect(onColumnsNumberProvidedMock).toHaveBeenNthCalledWith(2, payloadGenerator(50));

    wrapper.unmount();

    await XPlugin.bus.emit('ColumnsNumberProvided', 60);
    expect(onColumnsNumberProvidedMock).toHaveBeenCalledTimes(2); // No listener on unmounted

    render();

    expect(onColumnsNumberProvidedMock).toHaveBeenCalledTimes(4); // ReplaySubject + component mounting
    expect(onColumnsNumberProvidedMock).toHaveBeenNthCalledWith(3, payloadGenerator(60));
    expect(onColumnsNumberProvidedMock).toHaveBeenNthCalledWith(4, payloadGenerator(10));
    await XPlugin.bus.emit('ColumnsNumberProvided', 70);
    expect(onColumnsNumberProvidedMock).toHaveBeenCalledTimes(5); // Bus emission
    expect(onColumnsNumberProvidedMock).toHaveBeenNthCalledWith(5, payloadGenerator(70));
  });
});
