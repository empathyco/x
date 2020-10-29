import React, { ReactElement, useState } from 'react';
import { ReactTransitionSlot } from '../stubs/react-transition-slot.stub';

/**
 * Renders a view to test that slot leave transitions are properly waited before
 * unmounting the React slot content.
 *
 * @returns A React node.
 */
export function SlotsView(): ReactElement {
  const [show, setShow] = useState(false);
  const toggleShow = (): void => {
    setShow(!show);
  };

  return (
    <div>
      <button onClick={toggleShow} data-test='toggle-show'>
        Toggle show
      </button>
      <ReactTransitionSlot message='Test' show={show} transitionDuration={100} />
    </div>
  );
}
