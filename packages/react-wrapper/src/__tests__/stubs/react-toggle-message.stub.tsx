import React from 'react';
import { ReactWrapper } from '../../react-wrapper';
import { VueMessage } from './vue-message.stub';

interface ReactToggleMessageState {
  message: string;
}

export class ReactToggleMessage extends React.Component<{}, ReactToggleMessageState> {
  constructor(props: {}) {
    super(props);
    this.state = { message: 'Hi' };
    this.toggleMessage = this.toggleMessage.bind(this);
  }

  toggleMessage() {
    const message = this.state.message === 'Hi' ? 'Bye' : 'Hi';
    this.setState({ message });
  }

  render() {
    return (
      <section>
        <ReactWrapper component={ VueMessage } message={ this.state.message }/>
      </section>);
  }
}
