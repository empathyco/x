import React, { ReactNode } from 'react';
import { ReactWrapper } from '../../react-wrapper';
import { ReactRenderProps } from '../../react-wrapper.types';
import { VueScopedSlot } from './vue-scoped-slot.stub';

interface ReactScopedSlotStubState {
  message: string;
  slotContent: ReactRenderProps;
}

export class ReactScopedSlotStub extends React.Component<
  Record<string, unknown>,
  ReactScopedSlotStubState
> {
  public constructor(props: Record<string, unknown>) {
    super(props);

    this.state = {
      message: 'Hello',
      slotContent: (message: string) => <span>{message}</span>
    };
  }

  render(): ReactNode {
    return (
      <ReactWrapper
        component={VueScopedSlot}
        slots={{
          scoped: this.state.slotContent
        }}
        message={this.state.message}
      />
    );
  }
}
