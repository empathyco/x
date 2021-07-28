import React, { ReactElement } from 'react';
import { ReactWrapper } from '../../../src';
import { ReactClassCounterStub, ReactFunctionInputStub } from '../stubs/react-counter.stub';
import { VueLabel } from '../stubs/vue-label.stub';

const functionSlots = {
  default: ReactFunctionInputStub
};

const classSlots = {
  default: ReactClassCounterStub
};

/**
 * Renders a view to test that ReactWrapper supports passing standard React components
 * (either functions or classes) as slots.
 *
 * @returns A React node.
 */
export function SlotsComponentsView(): ReactElement {
  return (
    <div>
      <ReactWrapper
        component={VueLabel}
        slots={functionSlots}
        label='Times I want to shoot myself:'
      />
      <ReactWrapper component={VueLabel} slots={classSlots} label='Times I want to shoot myself:' />
    </div>
  );
}
