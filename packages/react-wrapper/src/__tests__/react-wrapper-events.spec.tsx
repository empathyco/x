import React from 'react';
import Vue from 'vue';
import { ReactWrapper } from '../react-wrapper';
import { ReactEventsStub } from './stubs/react-events.stub';
import { VueButton } from './stubs/vue-button.stub';
import { renderClassComponent, renderReactNode } from './utils';

describe('testing support of events in the react-wrapper', () => {
  it('subscribes events before creating and mounting the Vue component', async () => {
    const vueButtonCreatedCallback = jest.fn();
    const vueButtonMountedCallback = jest.fn();

    const onPropContent = {
      VueButtonCreated: vueButtonCreatedCallback,
      VueButtonMounted: vueButtonMountedCallback
    };

    renderReactNode(<ReactWrapper component={VueButton} on={onPropContent} />);

    await Vue.nextTick();
    expect(vueButtonCreatedCallback).toHaveBeenCalledWith('Hello world!');
    expect(vueButtonMountedCallback).toHaveBeenCalledWith('Hello world!');
  });

  it('executes callback function of a Vue event', async () => {
    const buttonClickedFirstCallback = jest.fn();

    const message = 'This is the event payload';
    const onPropContent = {
      VueButtonClickedFirstEvent: buttonClickedFirstCallback
    };

    const root = renderReactNode(
      <ReactWrapper component={VueButton} message={message} on={onPropContent} />
    );

    await Vue.nextTick();
    const button = root.querySelector('button');
    button?.click();

    expect(buttonClickedFirstCallback).toHaveBeenCalledWith(message);
  });

  it('unsubscribes listener events and subscribes the new ones', async () => {
    const firstCallback = jest.fn();
    const secondCallback = jest.fn();
    const { instance, root } = renderClassComponent(ReactEventsStub);

    instance.setState({
      events: { VueButtonClickedFirstEvent: firstCallback }
    });
    await Vue.nextTick();
    const button = root.querySelector('button');
    button?.click();

    expect(firstCallback).toHaveBeenCalledWith('Hello world!');
    firstCallback.mockClear();

    instance.setState({
      events: { VueButtonClickedSecondEvent: secondCallback }
    });
    await Vue.nextTick();
    button?.click();

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledWith('Hello world!');
  });
});
