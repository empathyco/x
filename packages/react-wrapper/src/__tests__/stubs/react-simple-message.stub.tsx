import React from 'react';
import { ReactWrapper } from '../../react-wrapper';
import { VueMessage } from './vue-message.stub';

/**
 * Create a React Element rendering the VueMessage component.
 *
 * @returns The React Element.
 */
export function ReactSimpleMessageStub(): JSX.Element {
  return (
    <article>
      <ReactWrapper component={VueMessage} />
    </article>
  );
}
