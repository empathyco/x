import React, { ReactNode } from 'react';
import { ReactWrapper } from '../../react-wrapper';
import { ReactWrapperProps } from '../../react-wrapper.types';
import { VueButton } from './vue-button.stub';

interface ReactEventsStubState {
  events: ReactWrapperProps['on'];
}

export class ReactEventsStub extends React.Component<object, ReactEventsStubState> {
  public constructor(props: object) {
    super(props);

    this.state = {
      events: {}
    };
  }

  render(): ReactNode {
    return <ReactWrapper component={VueButton} on={this.state.events} />;
  }
}
