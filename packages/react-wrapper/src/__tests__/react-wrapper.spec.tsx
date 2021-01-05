import React from 'react';
import Vue from 'vue';
import { ReactWrapper } from '../react-wrapper';
import { ReactSiblingsBug } from './stubs/react-siblings-bug';
import { ReactSimpleMessageStub } from './stubs/react-simple-message.stub';
import { ReactToggleComponent } from './stubs/react-toggle-component';
import { ReactToggleMessage } from './stubs/react-toggle-message.stub';
import { vueDestroyedCallback } from './stubs/vue-destroy.stub';
import { VueMessage } from './stubs/vue-message.stub';
import { renderClassComponent, renderReactNode, transformStringIntoASingleLine } from './utils';

describe('testing react-wrapper component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows rendering a vue component', () => {
    const root = renderReactNode(<ReactSimpleMessageStub />);

    const vueHTML = root.querySelector('p');
    expect(vueHTML).toBeDefined();
    expect(vueHTML!.textContent).toEqual('Hello world!');
  });

  it('keeps props synced', async () => {
    const { instance, root } = renderClassComponent(ReactToggleMessage);

    const vueHTML = root.querySelector('p');
    expect(vueHTML).toBeDefined();
    expect(vueHTML!.textContent).toEqual('Hi');

    instance.toggleMessage();
    await Vue.nextTick();

    expect(vueHTML!.textContent).toEqual('Bye');
  });

  it('destroys the Vue component when the React one is destroyed', async () => {
    const { instance, root } = renderClassComponent(ReactToggleComponent);

    let vueHTML = root.querySelector('p');
    expect(vueHTML).toBeDefined();
    expect(vueHTML!.textContent).toEqual('0');

    instance.toggleComponent();
    await Vue.nextTick();
    vueHTML = root.querySelector('p');
    expect(vueDestroyedCallback).toHaveBeenCalled();
    expect(vueHTML).toBeNull();

    instance.toggleComponent();
    await Vue.nextTick();
    vueHTML = root.querySelector('p');
    expect(vueHTML).toBeDefined();
    expect(vueHTML!.textContent).toEqual('2');
  });

  it('allows having sibling ReactWrapper elements that can be toggled', () => {
    const { instance, root } = renderClassComponent(ReactSiblingsBug);

    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
        <div>
          <div class="react-wrapper">
            <button>Hello world!</button>
          </div>
        </div>
      `)
    );

    instance.toggleReactElement();
    instance.toggle();
    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
        <div>
          <p>Hello</p>
          <div class="react-wrapper">
            <button>Hello world!</button>
          </div>
          <div class="react-wrapper">
            <button>Hello world!</button>
          </div>
        </div>
      `)
    );

    instance.toggle();
    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
        <div>
          <p>Hello</p>
          <div class="react-wrapper">
            <button>Hello world!</button>
          </div>
        </div>
      `)
    );
  });

  it('allows you to add custom css classes', () => {
    const root = renderReactNode(<ReactWrapper component={VueMessage} className='my-class' />);

    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
      <div class="react-wrapper my-class">
        <p>Hello world!</p>
      </div>`)
    );
  });
});
