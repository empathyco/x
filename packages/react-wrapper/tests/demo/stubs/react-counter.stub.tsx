import React, { ReactNode, useCallback, useState } from 'react';

interface ReactInputProps {
  label: string;
}

interface ReactInputState {
  count: number;
}

export class ReactClassCounterStub extends React.Component<ReactInputProps, ReactInputState> {
  public constructor(props: ReactInputProps) {
    super(props);
    this.state = { count: 0 };
    this.increment = this.increment.bind(this);
  }

  increment(): void {
    this.setState({ count: this.state.count + 1 });
  }

  render(): ReactNode {
    return (
      <div>
        <span data-test='react-class-counter-label'>{this.props.label}</span>
        <span data-test='react-class-counter-count'>{this.state.count}</span>
        {/* eslint-disable-next-line @typescript-eslint/unbound-method */}
        <button data-test='react-class-counter-increment' onClick={this.increment}>
          Increment
        </button>
      </div>
    );
  }
}

export function ReactFunctionInputStub(props: ReactInputProps): ReactNode {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => {
    setCount(count + 1);
  }, [count, setCount]);

  return (
    <div>
      <span data-test='react-functional-counter-label'>{props.label}</span>
      <span data-test='react-functional-counter-count'>{count}</span>
      <button data-test='react-functional-counter-increment' onClick={increment}>
        Increment
      </button>
    </div>
  );
}
