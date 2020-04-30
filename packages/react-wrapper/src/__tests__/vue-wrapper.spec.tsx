import React from 'react';
import Vue from 'vue';
import { reactDestroyedCallback } from './stubs/react-in-vue/react-destroy.stub';
import { ParagraphMessage } from './stubs/react-in-vue/react-paragraph-message.stub';
import { VueChangingComponent } from './stubs/react-in-vue/vue-changing-component.stub';
import { VueChangingTitle } from './stubs/react-in-vue/vue-changing-title.stub';
import { VueTitleMessage } from './stubs/react-in-vue/vue-title-message.stub';
import { VueToggleComponent } from './stubs/react-in-vue/vue-toggle-component.stub';

describe('testing vue-wrapper component', () => {
  const vueComment = '<!---->'; // This is used inside tests because we have to keep the Vue reference, and it renders a comment to do so.
  let root: HTMLElement;
  let mountingPoint: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    mountingPoint = document.createElement('div');
    root.appendChild(mountingPoint);
  });

  it('allows rendering a React component', () => {
    new Vue(VueTitleMessage).$mount(mountingPoint);

    expect(root.innerHTML).toEqual(`<h1>Hello world!</h1>${ vueComment }`);
  });

  it('keeps props synced', async () => {
    const vueInstance = new Vue(VueChangingTitle).$mount(mountingPoint);

    expect(root.innerHTML).toEqual(`<h1>Hello</h1>${ vueComment }`);

    vueInstance.message = 'Bye';
    await Vue.nextTick();
    expect(root.innerHTML).toEqual(`<h1>Bye</h1>${ vueComment }`);
  });

  it('destroys the Vue component when the React one is destroyed', async () => {
    const vueInstance = new Vue(VueToggleComponent).$mount(mountingPoint);

    expect(root.innerHTML).toEqual(`<p>0</p>${ vueComment }`);

    vueInstance.renderReactComponent = false;
    await Vue.nextTick();
    expect(root.innerHTML).toEqual(`${ vueComment }`);
    expect(reactDestroyedCallback).toHaveBeenCalledTimes(1);

    vueInstance.count = 10;
    vueInstance.renderReactComponent = true;
    await Vue.nextTick();
    expect(root.innerHTML).toEqual(`<p>10</p>${ vueComment }`);
  });

  it('allows changing the rendered react component', async () => {
    const vueInstance = new Vue(VueChangingComponent).$mount(mountingPoint);

    expect(root.innerHTML).toEqual(`<h1>Good morning sir!</h1>${ vueComment }`);
    vueInstance.reactComponent = ParagraphMessage;
    await Vue.nextTick();
    // When re-rendering a react component vue comment changes its position
    expect(root.innerHTML).toEqual(`${ vueComment }<p>Good morning sir!</p>`);
  });
});
