import React from 'react';
import ReactDOM from 'react-dom';
import Vue from 'vue';
import { ReactSimpleMessageStub } from './stubs/react-simple-message.stub';
import { ReactToggleComponent } from './stubs/react-toggle-component';
import { ReactToggleMessage } from './stubs/react-toggle-message.stub';
import { vueDestroyedCallback } from './stubs/vue-destroy.stub';

describe('Testing react-wrapper component', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    jest.clearAllMocks();
    root = document.createElement('div');
  });

  it('allows rendering a vue component', () => {
    ReactDOM.render(
      <ReactSimpleMessageStub/>,
      root
    );

    const vueHTML = root.querySelector('p');
    expect(vueHTML).toBeDefined();
    expect(vueHTML!.textContent).toEqual('Hello world!');
  });

  it('keeps props synced', async () => {
    const reactComponent = ReactDOM.render(<ReactToggleMessage/>,
      root) as unknown as ReactToggleMessage;

    const vueHTML = root.querySelector('p');
    expect(vueHTML).toBeDefined();
    expect(vueHTML!.textContent).toEqual('Hi');

    reactComponent.toggleMessage();
    await Vue.nextTick();

    expect(vueHTML!.textContent).toEqual('Bye');
  });

  it('destroys the Vue component when the React one is destroyed', async () => {
    const reactComponent = ReactDOM.render(<ReactToggleComponent/>,
      root) as unknown as ReactToggleComponent;

    let vueHTML = root.querySelector('p');
    expect(vueHTML).toBeDefined();
    expect(vueHTML!.textContent).toEqual('0');

    reactComponent.toggleComponent();
    await Vue.nextTick();
    vueHTML = root.querySelector('p');
    expect(vueDestroyedCallback).toHaveBeenCalled();
    expect(vueHTML).toEqual(null);

    reactComponent.toggleComponent();
    await Vue.nextTick();
    vueHTML = root.querySelector('p');
    expect(vueHTML).toBeDefined();
    expect(vueHTML!.textContent).toEqual('2');
  });
});
