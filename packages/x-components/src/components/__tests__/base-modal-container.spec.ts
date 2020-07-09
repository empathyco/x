import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils';
import BaseModalContainer from '../base-modal-container.vue';

describe('testing Base Modal Container component', () => {
  let localVue: typeof Vue;
  let component: Wrapper<BaseModalContainer>;

  beforeEach(() => {
    [, localVue] = installNewXPlugin();
    component = mount(BaseModalContainer, {
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
  });

  it('renders an overlay by default', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    (component.vm as any).openModalContainer({
      eventPayload: undefined,
      metadata: {
        target: undefined,
        moduleName: null
      }
    });

    await localVue.nextTick();

    expect(component.find(getDataTestSelector('modal-container-overlay')).element).toBeDefined();
  });

  it('does not render an overlay when displayOverlay is false', () => {
    expect(
      component.find(getDataTestSelector('modal-container-overlay')).element
    ).not.toBeDefined();
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      (component.vm as any).openModalContainer({
        eventPayload: undefined,
        metadata: {
          target: undefined,
          moduleName: null
        }
      });

      await localVue.nextTick();

      const button = component.find(getDataTestSelector('modal-button'));
      button.trigger('click');
      expect(listener).not.toHaveBeenCalled();

      document.body.click();
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
