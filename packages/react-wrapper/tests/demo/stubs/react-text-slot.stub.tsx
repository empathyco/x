import React, { ReactElement } from 'react';
import { ReactWrapper } from '../../../src';
import { VueTextSlot } from './vue-text-slot';

interface ReactTextSlotProps {
  children?: string;
  'data-test': string;
}

export function ReactTextSlot({ children, ...props }: ReactTextSlotProps): ReactElement {
  const slots = children ? { slots: { default: children } } : {};
  return <ReactWrapper component={VueTextSlot as any} {...slots} {...props} />;
}
