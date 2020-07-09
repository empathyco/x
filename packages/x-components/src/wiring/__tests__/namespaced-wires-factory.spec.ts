import {
  namespacedWireCommit,
  namespacedWireCommitWithoutPayload,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload
} from '../namespaced-wires.factory';
import { createQuerySuggestionsStoreMock, SubjectHandler } from './utils';

describe('testing namespaced wires factory', () => {
  const moduleName = 'querySuggestions';
  const storeMock = createQuerySuggestionsStoreMock();

  const subjectHandler = new SubjectHandler();

  beforeEach(() => {
    subjectHandler.reset();
    jest.clearAllMocks();
  });

  describe('testing namespaced mutation wires factory', () => {
    const mutationName = 'setQuery';
    const querySuggestionsWireCommit = namespacedWireCommit(moduleName);

    test(
      namespacedWireCommit.name +
        ' allows creating wires that commit a mutation with the observable payload',
      () => {
        const wire = querySuggestionsWireCommit(mutationName);
        const query = 'porterhouse steak';

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit(query);

        expect(storeMock.commit).toHaveBeenCalledWith(`x/${moduleName}/${mutationName}`, query);
      }
    );

    test(
      namespacedWireCommit.name +
        ' allows creating wires that commit a mutation with a static payload',
      () => {
        const staticQuery = 'tenderloin';
        const wire = querySuggestionsWireCommit(mutationName, staticQuery);

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('beans');

        expect(storeMock.commit).toHaveBeenCalledWith(
          `x/${moduleName}/${mutationName}`,
          staticQuery
        );
      }
    );

    test(
      namespacedWireCommit.name +
        ' allows creating wires that commit a mutation with a function payload that receives the' +
        ' module state',
      () => {
        const wire = querySuggestionsWireCommit(
          mutationName,
          ({ state }) => state.query + '_modified'
        );

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('beans');

        expect(storeMock.commit).toHaveBeenCalledWith(
          `x/${moduleName}/${mutationName}`,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `${storeMock.state.x.querySuggestions.query}_modified`
        );
      }
    );

    test(
      namespacedWireCommit.name +
        ' allows creating wires that commit a mutation with a function payload that receives the' +
        ' module getters',
      () => {
        const wire = querySuggestionsWireCommit(
          mutationName,
          ({ getters }) => getters.normalizedQuery + '_modified'
        );

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('beans');

        expect(storeMock.commit).toHaveBeenCalledWith(
          `x/${moduleName}/${mutationName}`,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `${storeMock.getters[`x/${moduleName}/normalizedQuery`]}_modified`
        );
      }
    );

    test(
      namespacedWireCommitWithoutPayload.name +
        ' allows creating wires that commit a mutation without payload',
      () => {
        // Tested module does not have any mutations without payload. It is a hack type to test it
        const wire = namespacedWireCommitWithoutPayload(moduleName)(mutationName as never);

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('beetroot');

        expect(storeMock.commit).toHaveBeenCalledWith(`x/${moduleName}/${mutationName}`);
      }
    );
  });

  describe('testing namespaced actions wires factory', () => {
    const actionName = 'getAndSaveSuggestions';
    const querySuggestionsWireDispatch = namespacedWireDispatch(moduleName);

    test(
      namespacedWireDispatch.name +
        ' allows creating wires that dispatch an action with the observable payload',
      () => {
        // The tested module does not have any actions. It is a hack type to test it
        const wire = querySuggestionsWireDispatch(actionName);
        const query = 'osobuco';

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit(query);

        expect(storeMock.dispatch).toHaveBeenCalledWith(`x/${moduleName}/${actionName}`, query);
      }
    );

    test(
      namespacedWireDispatch.name +
        ' allows creating wires that dispatch an action with a static payload',
      () => {
        const staticQuery = 'pork knuckle';
        // The tested module does not have any actions. It is a hack type to test it
        const wire = querySuggestionsWireDispatch(actionName as never, staticQuery as never);

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('cucumber');

        expect(storeMock.dispatch).toHaveBeenCalledWith(
          `x/${moduleName}/${actionName}`,
          staticQuery
        );
      }
    );

    test(
      namespacedWireDispatchWithoutPayload.name +
        ' allows creating wires that dispatch an action without payload',
      () => {
        // The tested module does not have any actions without payloads.
        // It is a hack type to test it
        const wire = namespacedWireDispatchWithoutPayload(moduleName)(actionName as never);

        wire(subjectHandler.subject, storeMock);
        subjectHandler.emit('celery');

        expect(storeMock.dispatch).toHaveBeenCalledWith(`x/${moduleName}/${actionName}`);
      }
    );
  });
});
