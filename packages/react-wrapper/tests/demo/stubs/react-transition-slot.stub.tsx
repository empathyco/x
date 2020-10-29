import React, { ReactElement } from 'react';
import { ReactWrapper } from '../../../src';
import { VueTransitionSlot } from './vue-transition-slot';

interface ReactTransitionSlotProps {
  message: string;
  transitionDuration: number;
  show: boolean;
}

export function ReactTransitionSlot(props: ReactTransitionSlotProps): ReactElement {
  return (
    <ReactWrapper
      component={VueTransitionSlot as any}
      slots={{ default: ReactTransitionSlotContent }}
      {...props}
    />
  );
}

function ReactTransitionSlotContent(message: string): ReactElement {
  return <span data-test='react-content'>{message}</span>;
}
