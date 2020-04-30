import React from 'react';

interface ReactDestroyedProps {
  count: number
}

export const reactDestroyedCallback = jest.fn();

export class ReactDestroyed extends React.Component<ReactDestroyedProps> {
  componentWillUnmount(): void {
    reactDestroyedCallback();
  }

  render() {
    return <p>{ this.props.count }</p>;
  }
}
