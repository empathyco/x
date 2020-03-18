import { Subject } from 'rxjs/Subject';
import { Store } from 'vuex';
import {
  createWireFromFunction,
  wireCommit,
  wireCommitWithoutPayload,
  wireDispatch,
  wireDispatchWithoutPayload,
  withModule
} from '../wires.factory';
import { WirePayload } from '../wiring.types';

describe('testing wire factory functions', () => {
  const store: Store<any> = {
    dispatch: jest.fn(),
    commit: jest.fn()
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
    test(`${createWireFromFunction.name} receives the store, the observable payload and the metadata object, and invokes a function with them`, () => {
      const executeFn = jest.fn();
      const wire = createWireFromFunction(executeFn);

      wire(subject, store);
      next('choripan');

      expect(executeFn).toHaveBeenCalledTimes(1);
      expect(executeFn).toHaveBeenCalledWith({
        eventPayload: 'choripan',
        metadata: expect.any(Object),
        store
      });
    });
  });

  describe('testing mutations wires factory', () => {
    const mutationName = 'setQuery';

    test(`${wireCommit.name} allows creating wires that commit a mutation with the observable payload`, () => {
      const wire = wireCommit(mutationName);
      const query = 'churrasco';

      wire(subject, store);
      next(query);

      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith(mutationName, query);
    });

    test(`${wireCommit.name} allows creating wires that commit a mutation with a static payload`, () => {
      const staticQuery = 'entraña';
      const wire = wireCommit(mutationName, staticQuery);

      wire(subject, store);
      next('cauliflower');

      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith(mutationName, staticQuery);
    });

    test(`${wireCommitWithoutPayload.name} allows creating wires that commit a mutation without payload`, () => {
      const wire = wireCommitWithoutPayload(mutationName);

      wire(subject, store);
      next('zamburiñas');

      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith(mutationName);
    });
  });

  describe('testing actions wires factory', () => {
    const actionName = 'search';

    test(`${wireDispatch.name} allows creating wires that dispatch an action with the observable payload`, () => {
      const wire = wireDispatch(actionName);
      const query = 'falda';

      wire(subject, store);
      next(query);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(actionName, query);
    });

    test(`${wireDispatch.name} allows creating wires that dispatch an action with a static payload`, () => {
      const staticQuery = 'pluma';
      const wire = wireDispatch(actionName, staticQuery);

      wire(subject, store);
      next('edamame');

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(actionName, staticQuery);
    });

    test(`${wireDispatchWithoutPayload.name} allows creating wires that dispatch an action without payload`, () => {
      const wire = wireDispatchWithoutPayload(actionName);

      wire(subject, store);
      next('oysters');

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(actionName);
    });
  });

  describe('testing namespaced wire factory', () => {
    const moduleName = 'searchBox';
    const searchBoxModule = withModule(moduleName);

    describe('testing namespaced mutation wires factory', () => {
      const mutationName = 'setQuery';

      test(`${searchBoxModule.wireCommit.name} allows creating wires that commit a mutation with the observable payload`, () => {
        const wire = searchBoxModule.wireCommit(mutationName);
        const query = 'porterhouse steak';

        wire(subject, store);
        next(query);

        expect(store.commit).toHaveBeenCalledTimes(1);
        expect(store.commit).toHaveBeenCalledWith(`x/${moduleName}/${mutationName}`, query);
      });

      test(`${searchBoxModule.wireCommit.name} allows creating wires that commit a mutation with a static payload`, () => {
        const staticQuery = 'tenderloin';
        const wire = searchBoxModule.wireCommit(mutationName, staticQuery);

        wire(subject, store);
        next('beans');

        expect(store.commit).toHaveBeenCalledTimes(1);
        expect(store.commit).toHaveBeenCalledWith(`x/${moduleName}/${mutationName}`, staticQuery);
      });

      test(`${searchBoxModule.wireCommitWithoutPayload.name} allows creating wires that commit a mutation without payload`, () => {
        // Tested module does not have any mutations without payload. It is a hack type to test it
        const wire = searchBoxModule.wireCommitWithoutPayload(mutationName as never);

        wire(subject, store);
        next('beetroot');

        expect(store.commit).toHaveBeenCalledTimes(1);
        expect(store.commit).toHaveBeenCalledWith(`x/${moduleName}/${mutationName}`);
      });
    });

    describe('testing namespaced actions wires factory', () => {
      const actionName = 'search';

      test(`${searchBoxModule.wireDispatch.name} allows creating wires that dispatch an action with the observable payload`, () => {
        // The tested module does not have any actions. It is a hack type to test it
        const wire = searchBoxModule.wireDispatch(actionName as never);
        const query = 'osobuco';

        wire(subject as any, store);
        next(query);

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(`x/${moduleName}/${actionName}`, query);
      });

      test(`${searchBoxModule.wireDispatch.name} allows creating wires that dispatch an action with a static payload`, () => {
        const staticQuery = 'pork knuckle';
        // The tested module does not have any actions. It is a hack type to test it
        const wire = searchBoxModule.wireDispatch(actionName as never, staticQuery as never);

        wire(subject, store);
        next('cucumber');

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(`x/${moduleName}/${actionName}`, staticQuery);
      });

      test(`${searchBoxModule.wireCommitWithoutPayload.name} allows creating wires that dispatch an action without payload`, () => {
        // The tested module does not have any actions without payloads. It is a hack type to test it
        const wire = searchBoxModule.wireDispatchWithoutPayload(actionName as never);

        wire(subject, store);
        next('celery');

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(`x/${moduleName}/${actionName}`);
      });
    });
  });
});
