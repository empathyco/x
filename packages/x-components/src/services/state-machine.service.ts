import { Machine } from './services.types';

/**
 * Default implementation for the {@link StateMachine}.
 *
 * @public
 */
export class StateMachine<SomeStatus extends string, SomeEvent extends string> {
  /**
   * A {@link Machine} having the different steps transition.
   *
   * @internal
   */
  private machine: Machine<SomeStatus, SomeEvent>;
  /**
   * The current state of the machine.
   *
   * @public
   */
  public currentState: SomeStatus;

  public constructor(machine: Machine<SomeStatus, SomeEvent>) {
    this.machine = machine;
    this.currentState = machine.initial;
  }

  /**
   * Determines which state will be the next to be transitioned.
   *
   * @param event - The event to determine which state is the new one to be
   * transitioned.
   *
   * @public
   */
  transition(event: SomeEvent): void {
    const currentState = this.machine.states[this.currentState];
    if (currentState[event]) {
      /* Typescript is not detecting the type guard in the previous if
      so we have to force it to be defined */
      this.currentState = currentState[event]!;
    } else {
      //eslint-disable-next-line no-console
      console.warn(
        `The ${event} event is not defined as a possible transition for ${this.currentState}`
      );
    }
  }
}
