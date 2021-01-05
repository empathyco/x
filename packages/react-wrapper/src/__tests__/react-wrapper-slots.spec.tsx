import React from 'react';
import Vue from 'vue';
import { ReactWrapper } from '../react-wrapper';
import { ReactScopedSlotStub } from './stubs/react-scoped-slot.stub';
import { VueSlots } from './stubs/vue-slots.stub';
import { renderClassComponent, renderReactNode, transformStringIntoASingleLine } from './utils';

describe('testing support of slots in the react-wrapper', () => {
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
            <div class="react-wrapper-slot">
              <h1>Hello world!</h1>
              This is working
              <strong>Vue rules!</strong>
            </div>
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
            <div class="react-wrapper-slot">
            <p>Vue says: Hell yeah!</p>
            Second line
            <span>Bye</span>
          </div>
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
          <section>
            <div class="react-wrapper-slot">
              <span>Vue says: Hello</span>
            </div>
          </section>
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
            <div class="react-wrapper-slot">
              <span>Vue says: Bye</span>
            </div>
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
            <div class="react-wrapper-slot">
              <span>Vue says: Hello</span>
            </div>
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
            <div class="react-wrapper-slot">
              <strong>Vue says: Bye</strong>
              We are not done yet
            </div>
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
            <div class="react-wrapper-slot">
               <p>Vue says: Shutting down</p>
            </div>
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
              <div class="react-wrapper-slot">
                I'd to have a <strong>${messageProp}</strong>!
              </div>
            </section>
            <div class="react-wrapper-slot">
              <h1>It is a default slot content</h1>
              Or children in React.
            </div>
          </div>
        </div>`)
    );
  });
});
