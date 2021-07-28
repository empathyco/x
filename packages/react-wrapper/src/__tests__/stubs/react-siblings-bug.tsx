import React, { ReactNode } from 'react';
import { ReactWrapper } from '../../react-wrapper';
import { VueButton } from './vue-button.stub';

interface ReactSiblingsBugState {
  render: boolean;
  renderReactElement: boolean;
}

/**
 * This bug prevented from having 2 ReactWrapper components together, as siblings.
 * Because the rendered `div` of each ReactWrapper was manually removed, React virtual DOM wasn't
 * able to update the sibling state.
 */
export class ReactSiblingsBug extends React.Component<unknown, ReactSiblingsBugState> {
  public constructor(props: unknown) {
    super(props);
    this.state = { render: false, renderReactElement: false };
    this.toggle = this.toggle.bind(this);
  }

  toggle(): void {
    this.setState({ render: !this.state.render });
  }

  toggleReactElement(): void {
    this.setState({ renderReactElement: !this.state.renderReactElement });
  }

  render(): ReactNode {
    return (
      <div>
        {this.state.renderReactElement && <p>Hello</p>}
        {this.state.render && <ReactWrapper component={VueButton} />}
        <ReactWrapper component={VueButton} />
      </div>
    );
  }
}
