import React from 'react';
import ReactDOM from 'react-dom';
import Vue from 'vue';
import { ReactWrapper } from '../react-wrapper';
import { ReactScopedSlotStub } from './stubs/react-scoped-slot.stub';
import { VueSlots } from './stubs/vue-slots.stub';
import { transformStringIntoASingleLine } from './utils';

describe('testing support of slots in the react-wrapper', () => {
  /* This is used inside tests because we have to keep the Vue reference, and it renders a
   comment to do so. */
  const vueComment = '<!---->';
  let root: HTMLDivElement;

  beforeEach(() => {
    root = document.createElement('div');
  });

  it('renders default slot', () => {
    ReactDOM.render(
      <ReactWrapper component={VueSlots}>
        <h1>Hello world!</h1>
        This is working
        <strong>Vue rules!</strong>
      </ReactWrapper>,
      root
    );

    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
      <div>
        <h1>Hello world!</h1>
        This is working
        <strong>Vue rules!</strong>${vueComment}
      </div>`)
    );
  });

  it('renders scoped slots', () => {
    ReactDOM.render(
      <ReactWrapper
        component={VueSlots}
        message='Hell yeah!'
        slots={{
          scoped: (message: string) => [
            <p key={1}>Vue says: {message}</p>,
            'Second line',
            <span key={2}>Bye</span>
          ]
        }}
      />,
      root
    );

    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
      <div>
        <section>
          <p>Vue says: Hell yeah!</p>
          Second line
          <span>Bye</span>${vueComment}
        </section>
      </div>`)
    );
  });

  it('updates the scoped slots when the content changes', async () => {
    const reactComponent = (ReactDOM.render(
      <ReactScopedSlotStub />,
      root
    ) as any) as ReactScopedSlotStub;

    await Vue.nextTick();
    expect(root.innerHTML).toEqual(`<section><span>Vue says: Hello</span>${vueComment}</section>`);

    reactComponent.setState({ message: 'Bye' });
    await Vue.nextTick();
    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
      <section>
        <span>Vue says: Bye</span>${vueComment}
      </section>`)
    );
  });

  it('allows changing react slots', async () => {
    const reactComponent = (ReactDOM.render(
      <ReactScopedSlotStub />,
      root
    ) as any) as ReactScopedSlotStub;

    await Vue.nextTick();
    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
      <section>
        <span>Vue says: Hello</span>${vueComment}
      </section>`)
    );

    reactComponent.setState({
      message: 'Bye',
      slotContent: (message: string) => [<strong key={1}>{message}</strong>, 'We are not done yet']
    });
    await Vue.nextTick();
    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
      <section>
        <strong>Vue says: Bye</strong>
        We are not done yet${vueComment}
      </section>`)
    );

    reactComponent.setState({
      message: 'Shutting down',
      slotContent: (message: string) => [<p key={1}>{message}</p>]
    });
    await Vue.nextTick();
    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
      <section>
        <p>Vue says: Shutting down</p>
        ${vueComment}
      </section>
    `)
    );
  });

  it('renders a default and scoped slot in the same component', async () => {
    const messageProp = 'EVO IX';
    const slots = {
      scoped: (message: string) => ["I'd to have a ", <strong key={1}>{message}</strong>, '!'],
      default: [<h1 key={1}>It is a default slot content</h1>, 'Or children in React.']
    };

    ReactDOM.render(
      <ReactWrapper component={VueSlots} message={messageProp} slots={slots} />,
      root
    );

    await Vue.nextTick();
    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
      <div>
        <section>
          I'd to have a <strong>${messageProp}</strong>!
          ${vueComment}
        </section>
        <h1>It is a default slot content</h1>
        Or children in React.
        ${vueComment}
      </div>
    `)
    );
  });
});
