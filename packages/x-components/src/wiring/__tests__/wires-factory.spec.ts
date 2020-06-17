import { Subject } from 'rxjs/Subject';
import { Store } from 'vuex';
import {
  createWireFromFunction,
  wireCommit,
  wireCommitWithoutPayload,
  wireDispatch,
  wireDispatchWithoutPayload
} from '../wires.factory';
import { WirePayload } from '../wiring.types';

describe('testing wires factory', () => {
  const storeMock: Store<any> = {
    dispatch: jest.fn(),
    commit: jest.fn(),
    state: {
      x: {
        searchBox: {
          query: 'this is a query with spaces at end  '
        }
      }
    },
    getters: {
      'x/searchBox/trimmedQuery': 'this is a query with spaces at end'
    }
  } as any;

  let subject: Subject<WirePayload<string>>;

  function next(query: string): void {
    subject.next({ eventPayload: query, metadata: { moduleName: null } });
  }

  beforeEach(() => {
    subject?.complete();
    subject = new Subject();
    jest.clearAllMocks();
  });

  describe('testing generic wires factory', () => {
    test(
      createWireFromFunction.name + // eslint-disable-next-line max-len
        ' receives the store, the observable payload and the metadata object, and invokes a function with them',
      () => {
        const executeFn = jest.fn();
        const wire = createWireFromFunction(executeFn);

        wire(subject, storeMock);
        next('choripan');

        expect(executeFn).toHaveBeenCalledTimes(1);
        expect(executeFn).toHaveBeenCalledWith({
          eventPayload: 'choripan',
          metadata: expect.any(Object),
          store: storeMock
        });
      }
    );
  });

  describe('testing mutations wires factory', () => {
    const mutationName = 'setQuery';

    test(
      wireCommit.name + ' allows creating wires that commit a mutation with the observable payload',
      () => {
        const wire = wireCommit(mutationName);
        const query = 'churrasco';

        wire(subject, storeMock);
        next(query);

        expect(storeMock.commit).toHaveBeenCalledTimes(1);
        expect(storeMock.commit).toHaveBeenCalledWith(mutationName, query);
      }
    );

    test(
      wireCommit.name + ' allows creating wires that commit a mutation with a static payload',
      () => {
        const staticQuery = 'entraña';
        const wire = wireCommit(mutationName, staticQuery);

        wire(subject, storeMock);
        next('cauliflower');

        expect(storeMock.commit).toHaveBeenCalledTimes(1);
        expect(storeMock.commit).toHaveBeenCalledWith(mutationName, staticQuery);
      }
    );

    test(
      wireCommit.name +
        ' allows creating wires that commit a mutation with a function payload' +
        'accessing the store state',
      () => {
        const wire = wireCommit(mutationName, ({ state }) => state.x.searchBox.query);
        wire(subject, storeMock);
        next('');

        expect(storeMock.commit).toHaveBeenCalledTimes(1);
        expect(storeMock.commit).toHaveBeenCalledWith(
          mutationName,
          storeMock.state.x.searchBox.query
        );
      }
    );

    test(
      wireCommit.name +
        ' allows creating wires that commit a mutation with a function payload' +
        'accessing the store getters',
      () => {
        const wire = wireCommit(mutationName, ({ getters }) => getters[`x/searchBox/trimmedQuery`]);
        wire(subject, storeMock);
        next('');

        expect(storeMock.commit).toHaveBeenCalledTimes(1);
        expect(storeMock.commit).toHaveBeenCalledWith(
          mutationName,
          storeMock.getters[`x/searchBox/trimmedQuery`]
        );
      }
    );

    test(
      wireCommitWithoutPayload.name +
        ' allows creating wires that commit a mutation without payload',
      () => {
        const wire = wireCommitWithoutPayload(mutationName);

        wire(subject, storeMock);
        next('zamburiñas');

        expect(storeMock.commit).toHaveBeenCalledTimes(1);
        expect(storeMock.commit).toHaveBeenCalledWith(mutationName);
      }
    );
  });

  describe('testing actions wires factory', () => {
    const actionName = 'search';

    test(
      wireDispatch.name +
        ' allows creating wires that dispatch an action with the observable payload',
      () => {
        const wire = wireDispatch(actionName);
        const query = 'falda';

        wire(subject, storeMock);
        next(query);

        expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
        expect(storeMock.dispatch).toHaveBeenCalledWith(actionName, query);
      }
    );

    test(
      wireDispatch.name + ' allows creating wires that dispatch an action with a static payload',
      () => {
        const staticQuery = 'pluma';
        const wire = wireDispatch(actionName, staticQuery);

        wire(subject, storeMock);
        next('edamame');

        expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
        expect(storeMock.dispatch).toHaveBeenCalledWith(actionName, staticQuery);
      }
    );

    test(
      wireDispatchWithoutPayload.name +
        ' allows creating wires that dispatch an action without payload',
      () => {
        const wire = wireDispatchWithoutPayload(actionName);

        wire(subject, storeMock);
        next('oysters');

        expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
        expect(storeMock.dispatch).toHaveBeenCalledWith(actionName);
      }
    );
  });
});
