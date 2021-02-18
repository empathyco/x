import React, { ReactElement } from 'react';
import { ReactWrapper } from '../../../src';
import { MessageProps } from '../../../src/__tests__/stubs/stub.types';
import { VueTransitionSlot } from './vue-transition-slot';

interface ReactTransitionSlotProps {
  message: string;
  transitionDuration: number;
  show: boolean;
}

const slots = { default: ReactTransitionSlotContent };

export function ReactTransitionSlot(props: ReactTransitionSlotProps): ReactElement {
  return <ReactWrapper component={VueTransitionSlot} slots={slots} {...props} />;
}

function ReactTransitionSlotContent({ message }: MessageProps): ReactElement {
  return <span data-test='react-content'>{message}</span>;
}
