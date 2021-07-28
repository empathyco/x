import React, { ReactElement } from 'react';
import { ReactWrapper } from '../../../src';
import { VueInput, VueInputDefaultSlotScope } from './vue-input';

export function ReactInput(): ReactElement {
  return <ReactWrapper component={VueInput} slots={{ default: ReactInputSlot }} />;
}

function ReactInputSlot({ setValue }: VueInputDefaultSlotScope): ReactElement {
  return <input data-test='react-input' onChange={event => setValue(event.target.value)} />;
}
