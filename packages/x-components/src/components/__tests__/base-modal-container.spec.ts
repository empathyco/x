import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import { XPlugin } from '../../plugins/x-plugin';
import { SearchAdapterDummy } from '../../__tests__/adapter.dummy';
import { getDataTestSelector } from '../../__tests__/utils';
import BaseModalContainer from '../base-modal-container.vue';

describe('testing Base Modal Container component', () => {
  const localVue = createLocalVue();
  localVue.use(XPlugin, { adapter: SearchAdapterDummy });

  const component: Wrapper<BaseModalContainer> = mount(BaseModalContainer, {
    localVue,
    propsData: {
      eventsToCloseModal: ['UserAcceptedAQuery']
    },
    slots: {
      default: {
        template: `<button data-test="modal-button">I DO NOT emit close event!</button>`
      }
    }
  });

  beforeEach(() => {
    (component.vm as any).isOpen = false;
  });

  it('opens when UserOpenX is emitted', async () => {
    expect((component.vm as any).isOpen).toEqual(false);
    component.vm.$x.emit('UserOpenedX');

    await localVue.nextTick();

    expect((component.vm as any).isOpen).toEqual(true);
    expect(component.isEmpty()).toBe(false);
  });

  it('closes when any event from the eventsToCloseModal prop is emitted', async () => {
    (component.vm as any).isOpen = true;
    component.vm.$x.emit('UserAcceptedAQuery', 'lego');

    await localVue.nextTick();

    expect((component.vm as any).isOpen).toEqual(false);
    expect(component.isEmpty()).toBe(true);
  });

  it(
    'only emits UserClosedX when clicking outside the default slot content and closes the ' +
      'modal container',
    async () => {
      const listener = jest.fn();
      component.vm.$x.on('UserClosedX', true).subscribe(listener);
      (component.vm as any).isOpen = true;

      await localVue.nextTick();

      const button = component.find(getDataTestSelector('modal-button'));
      button.trigger('click');
      expect(listener).not.toHaveBeenCalled();

      component.trigger('click');
      expect(listener).toHaveBeenCalledWith({
        eventPayload: undefined,
        metadata: {
          moduleName: null,
          target: component.element
        }
      });
    }
  );
});
