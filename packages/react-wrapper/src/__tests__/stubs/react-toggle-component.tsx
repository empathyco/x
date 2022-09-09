import React, { ReactNode } from 'react';
import { ReactWrapper } from '../../react-wrapper';
import { VueDestroyed } from './vue-destroy.stub';

interface ReactToggleComponentState {
  renderVueComponent: boolean;
  clicksCount: number;
}

export class ReactToggleComponent extends React.Component<
  Record<string, unknown>,
  ReactToggleComponentState
> {
  public constructor(props: Record<string, unknown>) {
    super(props);
    this.state = { renderVueComponent: true, clicksCount: 0 };
    this.toggleComponent = this.toggleComponent.bind(this);
  }

  toggleComponent(): void {
    this.setState({
      renderVueComponent: !this.state.renderVueComponent,
      clicksCount: this.state.clicksCount + 1
    });
  }

  render(): ReactNode {
    return (
      <section>
        {this.state.renderVueComponent && (
          <ReactWrapper component={VueDestroyed} count={this.state.clicksCount} />
        )}
      </section>
    );
  }
}
