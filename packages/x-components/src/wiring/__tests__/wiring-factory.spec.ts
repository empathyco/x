import { Subject } from 'rxjs/Subject';
import Vue from 'vue';
import { default as Vuex, Store } from 'vuex';
import {
  commit,
  commitWithoutPayload,
  dispatch,
  dispatchWithoutPayload
} from '../wires.factory';

Vue.use(Vuex);
const store = new Store({
  state: {
    count: 0
  },
  actions: {
    addTwice({ commit }, quantity: number) {
      commit('add', quantity);
      commit('add', quantity);
    },
    incrementTwice({ commit }) {
      commit('increment');
      commit('increment');
    }
  },
  mutations: {
    add(state, quantity: number) {
      state.count += quantity;
    },
    increment(state) {
      state.count++;
    }
  }
});

const mutationSubscription = jest.fn();
store.subscribe(mutationSubscription);
const actionSubscription = jest.fn();
store.subscribeAction(actionSubscription);

let subject: Subject<number>;

beforeEach(() => {
  subject = new Subject();
  store.replaceState({ count: 0 });
  jest.clearAllMocks();
});

it('commit creates a wire that calls a store mutation with the observable payload', () => {
  const commitWire = commit('add');
  commitWire(subject, store);

  subject.next(10);

  expect(mutationSubscription).toHaveBeenCalledTimes(1);
  expect(mutationSubscription).toHaveBeenCalledWith(
    { type: 'add', payload: 10 },
    expect.any(Object)
  );
});

it('commit creates a wire that calls a store mutation with a static payload', () => {
  const commitWire = commit('add', 1);
  commitWire(subject, store);

  subject.next(10);

  expect(mutationSubscription).toHaveBeenCalledTimes(1);
  expect(mutationSubscription).toHaveBeenCalledWith(
    { type: 'add', payload: 1 },
    expect.any(Object)
  );
});

it('commitWithoutPayload creates a wire that calls a store mutation without any payload', () => {
  const commitWire = commitWithoutPayload('increment');
  commitWire(subject, store);

  subject.next(10);

  expect(mutationSubscription).toHaveBeenCalledTimes(1);
  expect(mutationSubscription).toHaveBeenCalledWith(
    { type: 'increment', payload: undefined },
    expect.any(Object)
  );
});

it('dispatch creates a wire that calls a store action with the observable payload', () => {
  const dispatchWire = dispatch('addTwice');
  dispatchWire(subject, store);

  subject.next(10);

  expect(actionSubscription).toHaveBeenCalledTimes(1);
  expect(actionSubscription).toHaveBeenCalledWith(
    { type: 'addTwice', payload: 10 },
    expect.any(Object)
  );
});

it('dispatch creates a wire that calls a store action with a static payload', () => {
  const dispatchWire = dispatch('addTwice', 1);
  dispatchWire(subject, store);

  subject.next(10);

  expect(actionSubscription).toHaveBeenCalledTimes(1);
  expect(actionSubscription).toHaveBeenCalledWith(
    { type: 'addTwice', payload: 1 },
    expect.any(Object)
  );
});

it('dispatchWithoutPayload creates a wire that calls a store action without any payload', () => {
  const dispatchWire = dispatchWithoutPayload('incrementTwice');
  dispatchWire(subject, store);

  subject.next(10);

  expect(actionSubscription).toHaveBeenCalledTimes(1);
  expect(actionSubscription).toHaveBeenCalledWith(
    { type: 'incrementTwice', payload: undefined },
    expect.any(Object)
  );
});
