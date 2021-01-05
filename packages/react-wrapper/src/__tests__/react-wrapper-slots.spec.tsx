import React from 'react';
import Vue from 'vue';
import { ReactWrapper } from '../react-wrapper';
import { ReactScopedSlotStub } from './stubs/react-scoped-slot.stub';
import { VueSlots } from './stubs/vue-slots.stub';
import { renderClassComponent, renderReactNode, transformStringIntoASingleLine } from './utils';

describe('testing support of slots in the react-wrapper', () => {
  /* This is used inside tests because we have to keep the Vue reference, and it renders a
   comment to do so. */
  const vueComment = '<!---->';

  it('renders default slot', () => {
    const root = renderReactNode(
      <ReactWrapper component={VueSlots}>
        <h1>Hello world!</h1>
        This is working
        <strong>Vue rules!</strong>
      </ReactWrapper>
    );

    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
      <div class="react-wrapper">
        <div>
          <h1>Hello world!</h1>
          This is working
          <strong>Vue rules!</strong>${vueComment}
        </div>
      </div>`)
    );
  });

  it('renders scoped slots', () => {
    const root = renderReactNode(
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
      />
    );

    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
      <div class="react-wrapper">
        <div>
          <section>
            <p>Vue says: Hell yeah!</p>
            Second line
            <span>Bye</span>${vueComment}
          </section>
        </div>
      </div>`)
    );
  });

  it('updates the scoped slots when the content changes', async () => {
    const { instance, root } = renderClassComponent(ReactScopedSlotStub);

    await Vue.nextTick();
    const oldSpan = root.querySelector('span');
    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
        <div class="react-wrapper">
          <section><span>Vue says: Hello</span>${vueComment}</section>
        </div>`)
    );

    instance.setState({ message: 'Bye' });
    await Vue.nextTick();
    const newSpan = root.querySelector('span');

    expect(oldSpan).toBe(newSpan);
    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
        <div class="react-wrapper">
          <section>
            <span>Vue says: Bye</span>${vueComment}
          </section>
        </div>`)
    );
  });

  it('allows changing react slots', async () => {
    const { instance, root } = renderClassComponent(ReactScopedSlotStub);

    await Vue.nextTick();
    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
        <div class="react-wrapper">
          <section>
            <span>Vue says: Hello</span>${vueComment}
          </section>
        </div>`)
    );

    instance.setState({
      message: 'Bye',
      slotContent: (message: string) => [<strong key={1}>{message}</strong>, 'We are not done yet']
    });
    await Vue.nextTick();
    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
        <div class="react-wrapper">
          <section>
            <strong>Vue says: Bye</strong>
            We are not done yet${vueComment}
          </section>
        </div>`)
    );

    instance.setState({
      message: 'Shutting down',
      slotContent: (message: string) => [<p key={1}>{message}</p>]
    });
    await Vue.nextTick();
    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
        <div class="react-wrapper">
          <section>
            <p>Vue says: Shutting down</p>
            ${vueComment}
          </section>
        </div>`)
    );
  });

  it('renders a default and scoped slot in the same component', async () => {
    const messageProp = 'EVO IX';
    const slots = {
      scoped: (message: string) => ["I'd to have a ", <strong key={1}>{message}</strong>, '!'],
      default: [<h1 key={1}>It is a default slot content</h1>, 'Or children in React.']
    };

    const root = renderReactNode(
      <ReactWrapper component={VueSlots} message={messageProp} slots={slots} />
    );

    await Vue.nextTick();
    expect(root.innerHTML).toEqual(
      transformStringIntoASingleLine(`
        <div class="react-wrapper">
          <div>
            <section>
              I'd to have a <strong>${messageProp}</strong>!
              ${vueComment}
            </section>
            <h1>It is a default slot content</h1>
            Or children in React.
            ${vueComment}
          </div>
        </div>`)
    );
  });
});
