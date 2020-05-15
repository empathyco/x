import React from 'react';
import { ReactWrapper } from '../../../react-wrapper';
import { ReactWrapperProps } from '../../../react-wrapper.types';
import { VueButton } from './vue-button.stub';

interface ReactEventsStubState {
  events: ReactWrapperProps['on'];
}

export class ReactEventsStub extends React.Component<{}, ReactEventsStubState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      events: {}
    };
  }

  render() {
    return (
      <ReactWrapper component={ VueButton }
                    on={ this.state.events } />
    );
  }
}
