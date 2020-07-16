import {
  createWireFromFunction,
  wireCommit,
  wireCommitWithoutPayload,
  wireDispatch,
  wireDispatchWithoutPayload
} from '../wires.factory';
import { createQuerySuggestionsStoreMock, getExpectedWirePayload, SubjectHandler } from './utils';

describe('testing wires factory', () => {
  const storeMock = createQuerySuggestionsStoreMock();
  const subjectHandler = new SubjectHandler();

  beforeEach(() => {
    subjectHandler.reset();
    jest.clearAllMocks();
  });

  describe('testing generic wires factory', () => {
    test(
      createWireFromFunction.name +
        ' receives the store, the observable payload and the metadata object, and invokes a' +
        ' function with them',
      () => {
        const executeFn = jest.fn();
        const wire = createWireFromFunction(executeFn);

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('choripan');

        expect(executeFn).toHaveBeenCalledWith(getExpectedWirePayload('choripan', storeMock));
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

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit(query);

        expect(storeMock.commit).toHaveBeenCalledWith(mutationName, query);
      }
    );

    test(
      wireCommit.name + ' allows creating wires that commit a mutation with a static payload',
      () => {
        const staticQuery = 'entraña';
        const wire = wireCommit(mutationName, staticQuery);

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('cauliflower');

        expect(storeMock.commit).toHaveBeenCalledWith(mutationName, staticQuery);
      }
    );

    test(
      wireCommit.name +
        ' allows creating wires that commit a mutation with a function payload accessing the' +
        ' store state',
      () => {
        const wire = wireCommit(mutationName, ({ state }) => state.x.querySuggestions.query);

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('');

        expect(storeMock.commit).toHaveBeenCalledWith(
          mutationName,
          storeMock.state.x.querySuggestions.query
        );
      }
    );

    test(
      wireCommit.name +
        ' allows creating wires that commit a mutation with a function payload accessing the' +
        ' store getters',
      () => {
        const getterPath = `x/querySuggestions/trimmedQuery`;
        const wire = wireCommit(mutationName, ({ getters }) => getters[getterPath]);

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('');

        expect(storeMock.commit).toHaveBeenCalledWith(mutationName, storeMock.getters[getterPath]);
      }
    );

    test(
      wireCommitWithoutPayload.name +
        ' allows creating wires that commit a mutation without payload',
      () => {
        const wire = wireCommitWithoutPayload(mutationName);

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('zamburiñas');

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

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit(query);

        expect(storeMock.dispatch).toHaveBeenCalledWith(actionName, query);
      }
    );

    test(
      wireDispatch.name + ' allows creating wires that dispatch an action with a static payload',
      () => {
        const staticQuery = 'pluma';
        const wire = wireDispatch(actionName, staticQuery);

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('edamame');

        expect(storeMock.dispatch).toHaveBeenCalledWith(actionName, staticQuery);
      }
    );

    test(
      wireDispatch.name +
        ' allows creating wires that dispatch an action with a function payload accessing the' +
        ' store state',
      () => {
        const wire = wireDispatch(actionName, ({ state }) => state.x.querySuggestions.query);

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('');

        expect(storeMock.dispatch).toHaveBeenCalledWith(
          actionName,
          storeMock.state.x.querySuggestions.query
        );
      }
    );

    test(
      wireDispatch.name +
        ' allows creating wires that dispatch an action with a function payload accessing the' +
        ' store getters',
      () => {
        const getterPath = `x/querySuggestions/trimmedQuery`;
        const wire = wireDispatch(actionName, ({ getters }) => getters[getterPath]);

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('');

        expect(storeMock.dispatch).toHaveBeenCalledWith(actionName, storeMock.getters[getterPath]);
      }
    );

    test(
      wireDispatchWithoutPayload.name +
        ' allows creating wires that dispatch an action without payload',
      () => {
        const wire = wireDispatchWithoutPayload(actionName);

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('oysters');

        expect(storeMock.dispatch).toHaveBeenCalledWith(actionName);
      }
    );
  });
});
