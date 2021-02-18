import React, { ReactElement, useCallback, useState } from 'react';
import { ReactInput } from '../stubs/react-input.stub';
import { ReactTextSlot } from '../stubs/react-text-slot.stub';
import { ReactTransitionSlot } from '../stubs/react-transition-slot.stub';

/**
 * Renders a view to test that slot leave transitions are properly waited before
 * unmounting the React slot content.
 *
 * @returns A React node.
 */
export function SlotsView(): ReactElement {
  const [show, setShow] = useState(false);
  const [renderContainer, setRenderContainer] = useState(true);
  const toggleShow = useCallback((): void => {
    setShow(!show);
  }, [show, setShow]);

  const toggleRenderContainer = useCallback((): void => {
    setRenderContainer(!renderContainer);
  }, [renderContainer, setRenderContainer]);

  return (
    <div>
      {/* Toggle elements */}
      <button onClick={toggleRenderContainer} data-test='toggle-container'>
        Toggle container
      </button>
      <button onClick={toggleShow} data-test='toggle-show'>
        Toggle child
      </button>
      {renderContainer && (
        <div className='container'>
          <h1>Container</h1>
          <ReactTransitionSlot message='Test' show={show} transitionDuration={100} />
        </div>
      )}
      {/* Input */}
      <ReactInput />

      {/* Text Slot */}
      <ReactTextSlot data-test='text-slot-content'>text content</ReactTextSlot>
      <ReactTextSlot data-test='no-slot-content' />
    </div>
  );
}
