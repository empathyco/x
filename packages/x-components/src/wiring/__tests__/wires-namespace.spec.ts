import { Subject } from 'rxjs/Subject';
import { Store } from 'vuex';
import { XModuleName } from '../../x-modules/x-modules.types';
import { createWireFromFunction } from '../wires.factory';
import { withModule } from '../wires.namespace';
import { WirePayload } from '../wiring.types';

describe('testing wires namespace', () => {
  const moduleName = 'querySuggestions';
  const querySuggestionsWireFactory = withModule(moduleName);

  const storeMock: Store<any> = {
    state: {
      x: {
        querySuggestions: {
          config: { debounceInMs: 200 }
        }
      }
    },
    dispatch: jest.fn(),
    commit: jest.fn(),
    getters: {}
  } as any;

  let subject: Subject<WirePayload<any>>;

  function next(value: any, moduleName: XModuleName | null = null): void {
    subject.next({ eventPayload: value, metadata: { moduleName } });
  }

  beforeEach(() => {
    subject?.complete();
    subject = new Subject();
    jest.clearAllMocks();
  });

  describe('testing namespaced mutation wires factory', () => {
    const mutationName = 'setQuery';

    test(
      querySuggestionsWireFactory.wireCommit.name +
        ' allows creating wires that commit a mutation with the observable payload',
      () => {
        const wire = querySuggestionsWireFactory.wireCommit(mutationName);
        const query = 'porterhouse steak';

        wire(subject, storeMock);
        next(query);

        expect(storeMock.commit).toHaveBeenCalledTimes(1);
        expect(storeMock.commit).toHaveBeenCalledWith(`x/${moduleName}/${mutationName}`, query);
      }
    );

    test(
      querySuggestionsWireFactory.wireCommit.name +
        ' allows creating wires that commit a mutation with a static payload',
      () => {
        const staticQuery = 'tenderloin';
        const wire = querySuggestionsWireFactory.wireCommit(mutationName, staticQuery);

        wire(subject, storeMock);
        next('beans');

        expect(storeMock.commit).toHaveBeenCalledTimes(1);
        expect(storeMock.commit).toHaveBeenCalledWith(
          `x/${moduleName}/${mutationName}`,
          staticQuery
        );
      }
    );

    test(
      querySuggestionsWireFactory.wireCommit.name + // eslint-disable-next-line max-len
        ' allows creating wires that commit a mutation with a function payload that receives the module state',
      () => {
        const wire = querySuggestionsWireFactory.wireCommit(
          mutationName,
          ({ state }) => state.query + '_modified'
        );
        wire(subject, storeMock);
        next('beans');

        expect(storeMock.commit).toHaveBeenCalledTimes(1);
        expect(storeMock.commit).toHaveBeenCalledWith(
          `x/${moduleName}/${mutationName}`,
          `${storeMock.state.x.querySuggestions.query as string}_modified`
        );
      }
    );

    test(
      querySuggestionsWireFactory.wireCommit.name + // eslint-disable-next-line max-len
        ' allows creating wires that commit a mutation with a function payload that receives the module getters',
      () => {
        const wire = querySuggestionsWireFactory.wireCommit(
          mutationName,
          ({ getters }) => getters.normalizedQuery + '_modified'
        );
        wire(subject, storeMock);
        next('beans');

        expect(storeMock.commit).toHaveBeenCalledTimes(1);
        expect(storeMock.commit).toHaveBeenCalledWith(
          `x/${moduleName}/${mutationName}`,
          `${storeMock.getters[`x/${moduleName}/normalizedQuery`] as string}_modified`
        );
      }
    );

    test(
      querySuggestionsWireFactory.wireCommitWithoutPayload.name +
        ' allows creating wires that commit a mutation without payload',
      () => {
        // Tested module does not have any mutations without payload. It is a hack type to test it
        const wire = querySuggestionsWireFactory.wireCommitWithoutPayload(mutationName as never);

        wire(subject, storeMock);
        next('beetroot');

        expect(storeMock.commit).toHaveBeenCalledTimes(1);
        expect(storeMock.commit).toHaveBeenCalledWith(`x/${moduleName}/${mutationName}`);
      }
    );
  });

  describe('testing namespaced actions wires factory', () => {
    const actionName = 'getAndSaveSuggestions';

    test(
      querySuggestionsWireFactory.wireDispatch.name +
        ' allows creating wires that dispatch an action with the observable payload',
      () => {
        // The tested module does not have any actions. It is a hack type to test it
        const wire = querySuggestionsWireFactory.wireDispatch(actionName as never);
        const query = 'osobuco';

        wire(subject as any, storeMock);
        next(query);

        expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
        expect(storeMock.dispatch).toHaveBeenCalledWith(`x/${moduleName}/${actionName}`, query);
      }
    );

    test(
      querySuggestionsWireFactory.wireDispatch.name +
        ' allows creating wires that dispatch an action with a static payload',
      () => {
        const staticQuery = 'pork knuckle';
        // The tested module does not have any actions. It is a hack type to test it
        const wire = querySuggestionsWireFactory.wireDispatch(
          actionName as never,
          staticQuery as never
        );

        wire(subject, storeMock);
        next('cucumber');

        expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
        expect(storeMock.dispatch).toHaveBeenCalledWith(
          `x/${moduleName}/${actionName}`,
          staticQuery
        );
      }
    );

    test(
      querySuggestionsWireFactory.wireCommitWithoutPayload.name +
        ' allows creating wires that dispatch an action without payload',
      () => {
        // The tested module does not have any actions without payloads.
        // It is a hack type to test it
        const wire = querySuggestionsWireFactory.wireDispatchWithoutPayload(actionName as never);

        wire(subject, storeMock);
        next('celery');

        expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
        expect(storeMock.dispatch).toHaveBeenCalledWith(`x/${moduleName}/${actionName}`);
      }
    );
  });

  describe('testing namespaced operators wires factory', () => {
    const executeFunction = jest.fn();
    const wire = createWireFromFunction<any>(executeFunction);

    beforeAll(jest.useFakeTimers);
    afterAll(jest.useRealTimers);

    test(
      querySuggestionsWireFactory.wireDebounce.name +
        ' allows creating wires with debounced time retrieved from the store',
      () => {
        const debouncedWire = querySuggestionsWireFactory.wireDebounce(
          wire,
          ({ state }) => state.config.debounceInMs
        );
        debouncedWire(subject, storeMock);

        next(1);
        next(2);
        next(3);
        next(4);
        next(5);

        expect(executeFunction).not.toHaveBeenCalled();
        jest.runAllTimers();

        expect(executeFunction).toHaveBeenCalledTimes(1);
        expect(executeFunction).toHaveBeenCalledWith(getValueCalledWith(5));
      }
    );

    test(
      querySuggestionsWireFactory.wireThrottle.name +
        ' allows creating wires with throttled time retrieved from the store',
      () => {
        const throttledWire = querySuggestionsWireFactory.wireThrottle(
          wire,
          ({ state }) => state.config.debounceInMs
        );
        throttledWire(subject, storeMock);

        next(1);
        next(2);
        next(3);
        next(4);
        next(5);

        expect(executeFunction).toHaveBeenCalledTimes(1);
        expect(executeFunction).toHaveBeenCalledWith(getValueCalledWith(1));
        jest.runAllTimers();

        expect(executeFunction).toHaveBeenCalledTimes(2);
        expect(executeFunction).toHaveBeenCalledWith(getValueCalledWith(5));
      }
    );

    function getValueCalledWith(eventPayload: number): any {
      return {
        store: storeMock,
        eventPayload,
        metadata: expect.any(Object)
      };
    }
  });
});
