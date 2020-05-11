import React from 'react';
import { ReactWrapper } from '../../../react-wrapper';
import { VueDestroyed } from './vue-destroy.stub';

interface ReactToggleComponentState {
  renderVueComponent: boolean;
  clicksCount: number;
}

export class ReactToggleComponent extends React.Component<{}, ReactToggleComponentState> {
  constructor(props: {}) {
    super(props);
    this.state = { renderVueComponent: true, clicksCount: 0 };
    this.toggleComponent = this.toggleComponent.bind(this);
  }

  toggleComponent() {
    this.setState({ renderVueComponent: !this.state.renderVueComponent, clicksCount: this.state.clicksCount + 1 });
  }

  render() {
    return (
      <section>
        { this.state.renderVueComponent && <ReactWrapper component={ VueDestroyed } count={ this.state.clicksCount }/> }
      </section>);
  }
}
