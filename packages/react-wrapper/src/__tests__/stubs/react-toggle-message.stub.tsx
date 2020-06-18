import React, { ReactNode } from 'react';
import { ReactWrapper } from '../../react-wrapper';
import { VueMessage } from './vue-message.stub';

interface ReactToggleMessageState {
  message: string;
}

export class ReactToggleMessage extends React.Component<
  Record<string, unknown>,
  ReactToggleMessageState
> {
  public constructor(props: Record<string, unknown>) {
    super(props);
    this.state = { message: 'Hi' };
    this.toggleMessage = this.toggleMessage.bind(this);
  }

  toggleMessage(): void {
    const message = this.state.message === 'Hi' ? 'Bye' : 'Hi';
    this.setState({ message });
  }

  render(): ReactNode {
    return (
      <section>
        <ReactWrapper component={VueMessage} message={this.state.message} />
      </section>
    );
  }
}
