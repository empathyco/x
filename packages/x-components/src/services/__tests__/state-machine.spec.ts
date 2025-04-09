import { StateMachine } from '../state-machine.service'

type Status = 'idle' | 'playing' | 'paused'
type EventTypes = 'PLAY' | 'PAUSE' | 'NOT_VALID'

let machine: StateMachine<Status, EventTypes>

describe(`testing state machine service`, () => {
  beforeEach(() => {
    machine = new StateMachine<Status, EventTypes>({
      initial: 'idle',
      states: {
        idle: {
          PLAY: 'playing',
        },
        playing: {
          PAUSE: 'paused',
        },
        paused: {
          PLAY: 'playing',
        },
      },
    })
  })
  it('should transition to the right state depending on the event', () => {
    expect(machine.currentState).toEqual('idle')
    machine.transition('PLAY')
    expect(machine.currentState).toEqual('playing')
    machine.transition('PAUSE')
    expect(machine.currentState).toEqual('paused')
    machine.transition('PLAY')
    expect(machine.currentState).toEqual('playing')
  })
  it('should not transition if the event is not defined for that step', () => {
    expect(machine.currentState).toEqual('idle')
    machine.transition('PLAY')
    expect(machine.currentState).toEqual('playing')
    machine.transition('NOT_VALID')
    expect(machine.currentState).toEqual('playing')
  })
})
