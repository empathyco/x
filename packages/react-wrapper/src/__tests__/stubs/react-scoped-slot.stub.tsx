import React from 'react';
import { ReactWrapper } from '../../react-wrapper';
import { ReactRenderProps } from '../../react-wrapper.types';
import { VueScopedSlot } from './vue-scoped-slot.stub';

interface ReactScopedSlotStubState {
  message: string;
  slotContent: ReactRenderProps
}

export class ReactScopedSlotStub extends React.Component<{}, ReactScopedSlotStubState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      message: 'Hello',
      slotContent: (message: string) => <span>{ message }</span>
    };
  }

  render() {
    return (
      <ReactWrapper component={ VueScopedSlot }
                    slots={ {
                      scoped: this.state.slotContent
                    } }
                    message={ this.state.message }/>
    );
  }
}
