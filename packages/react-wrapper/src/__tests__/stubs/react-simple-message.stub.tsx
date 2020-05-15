import React from 'react';
import { ReactWrapper } from '../../react-wrapper';
import { VueMessage } from './vue-message.stub';

export function ReactSimpleMessageStub() {
  return (
    <article>
      <ReactWrapper component={ VueMessage }/>
    </article>
  );
}
