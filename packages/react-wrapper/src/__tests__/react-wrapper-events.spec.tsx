import React from 'react';
import ReactDOM from 'react-dom';
import Vue from 'vue';
import { ReactWrapper } from '../react-wrapper';
import { ReactEventsStub } from './stubs/react-events.stub';
import { VueButton } from './stubs/vue-button.stub';

describe('Testing support of events in the react-wrapper', () => {
  let rootHTML: HTMLDivElement;

  beforeEach(() => {
    rootHTML = document.createElement('div');
  });

  it('subscribes events before creating and mounting the Vue component', async () => {
    const vueButtonCreatedCallback = jest.fn();
    const vueButtonMountedCallback = jest.fn();

    const onPropContent = {
      VueButtonCreated: vueButtonCreatedCallback,
      VueButtonMounted: vueButtonMountedCallback
    };

    ReactDOM.render(<ReactWrapper component={VueButton} on={onPropContent} />, rootHTML);

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

    ReactDOM.render(
      <ReactWrapper component={VueButton} message={message} on={onPropContent} />,
      rootHTML
    );

    await Vue.nextTick();
    const button = rootHTML.querySelector('button');
    button?.click();

    expect(buttonClickedFirstCallback).toHaveBeenCalledWith(message);
  });

  it('unsubscribes listener events and subscribes the new ones', async () => {
    const firstCallback = jest.fn();
    const secondCallback = jest.fn();
    const reactComponent = (ReactDOM.render(
      <ReactEventsStub />,
      rootHTML
    ) as any) as ReactEventsStub;

    reactComponent.setState({
      events: { VueButtonClickedFirstEvent: firstCallback }
    });
    await Vue.nextTick();
    const button = rootHTML.querySelector('button');
    button?.click();

    expect(firstCallback).toHaveBeenCalledWith('Hello world!');
    firstCallback.mockClear();

    reactComponent.setState({
      events: { VueButtonClickedSecondEvent: secondCallback }
    });
    await Vue.nextTick();
    button?.click();

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledWith('Hello world!');
  });
});
