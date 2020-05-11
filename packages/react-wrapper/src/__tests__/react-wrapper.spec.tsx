import React from 'react';
import ReactDOM from 'react-dom';
import Vue from 'vue';
import { ReactWrapper } from '../react-wrapper';
import { ReactScopedSlotStub } from './stubs/vue-in-react/react-scoped-slot.stub';
import { ReactSimpleMessageStub } from './stubs/vue-in-react/react-simple-message.stub';
import { ReactToggleComponent } from './stubs/vue-in-react/react-toggle-component';
import { ReactToggleMessage } from './stubs/vue-in-react/react-toggle-message.stub';
import { vueDestroyedCallback } from './stubs/vue-in-react/vue-destroy.stub';
import { VueSlots } from './stubs/vue-in-react/vue-slots.stub';

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
    const reactComponent = ReactDOM.render(<ReactToggleMessage/>, root) as unknown as ReactToggleMessage;

    const vueHTML = root.querySelector('p');
    expect(vueHTML).toBeDefined();
    expect(vueHTML!.textContent).toEqual('Hi');

    reactComponent.toggleMessage();
    await Vue.nextTick();

    expect(vueHTML!.textContent).toEqual('Bye');
  });

  it('destroys the Vue component when the React one is destroyed', async () => {
    const reactComponent = ReactDOM.render(<ReactToggleComponent/>, root) as unknown as ReactToggleComponent;

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

  describe('when it has slots', () => {
    const vueComment = '<!---->'; // This is used inside tests because we have to keep the Vue reference, and it renders a comment to do so.

    it('renders default slot', () => {
      ReactDOM.render(<ReactWrapper component={ VueSlots }>
        <h1>Hello world!</h1>
        This is working
        <strong>Vue rules!</strong>
      </ReactWrapper>, root);

      expect(root.innerHTML).toEqual(transformStringIntoASingleLine(`
        <div>
          <h1>Hello world!</h1>
          This is working
          <strong>Vue rules!</strong>${ vueComment }
        </div>`
      ));
    });

    it('renders scoped slots', () => {
      ReactDOM.render(<ReactWrapper component={ VueSlots } message="Hell yeah!" slots={ {
        scoped: (message: string) => [
          <p>Vue says: { message }</p>,
          'Second line',
          <span>Bye</span>
        ]
      } }/>, root);

     expect(root.innerHTML).toEqual(transformStringIntoASingleLine(`
      <div>
        <section>
          <p>Vue says: Hell yeah!</p>
          Second line
          <span>Bye</span>${ vueComment }
        </section>
      </div>`
     ));
    });

    it('updates the scoped slots when the content changes', async () => {
      const reactComponent = ReactDOM.render(<ReactScopedSlotStub/>, root) as any as ReactScopedSlotStub;

      await Vue.nextTick();
      expect(root.innerHTML).toEqual(`<section><span>Vue says: Hello</span>${ vueComment }</section>`);

      reactComponent.setState({ message: 'Bye' });
      await Vue.nextTick();
      expect(root.innerHTML).toEqual(transformStringIntoASingleLine(`
        <section>
          <span>Vue says: Bye</span>${ vueComment }
        </section>`
      ));
    });

    it('allows changing react slots', async () => {
      const reactComponent = ReactDOM.render(<ReactScopedSlotStub/>, root) as any as ReactScopedSlotStub;

      await Vue.nextTick();
      expect(root.innerHTML).toEqual(transformStringIntoASingleLine(`
        <section>
          <span>Vue says: Hello</span>${ vueComment }
        </section>`
      ));

      reactComponent.setState({
        message: 'Bye',
        slotContent: (message: string) => [
          <strong>{ message }</strong>,
          'We are not done yet'
        ]
      });
      await Vue.nextTick();
      expect(root.innerHTML).toEqual(transformStringIntoASingleLine(`
        <section>
          <strong>Vue says: Bye</strong>
          We are not done yet${ vueComment }
        </section>`
      ));

      reactComponent.setState({
        message: 'Shutting down',
        slotContent: (message: string) => <p>{ message }</p>
      });
      await Vue.nextTick();
      expect(root.innerHTML).toEqual(transformStringIntoASingleLine(`
        <section>
          <p>Vue says: Shutting down</p>
          ${ vueComment }
        </section>
      `));
    });

    it('renders a default and scoped slot in the same component', async () => {
      const messageProp = 'EVO IX';
      const scopedSlot = {
        scoped: (message: string) => [
          'I\'d to have a ',
          <strong>{ message }</strong>,
          '!'
        ]
      };

      ReactDOM.render(
        <ReactWrapper component={ VueSlots } message={ messageProp } slots={ scopedSlot }>
          <h1>It is a default slot content</h1>
          Or children in React.
        </ReactWrapper>,
        root);

      await Vue.nextTick();
      expect(root.innerHTML).toEqual(transformStringIntoASingleLine(`
        <div>
          <section>
            I'd to have a <strong>${ messageProp }</strong>!
            ${ vueComment }
          </section>
          <h1>It is a default slot content</h1>
          Or children in React.
          ${ vueComment }
        </div>
      `));
    })
  });

  function transformStringIntoASingleLine(text: string): string {
    return text.replace(/[\n\r\t]|\s{2,}/g, '');
  }
});
