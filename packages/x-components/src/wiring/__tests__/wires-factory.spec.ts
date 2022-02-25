import { BaseXBus } from '../../plugins/x-bus';
import { noOp } from '../../utils/function';
import {
  createWireFromFunction,
  wireCommit,
  wireCommitWithoutPayload,
  wireDispatch,
  wireDispatchWithoutPayload,
  wireService,
  wireServiceWithoutPayload
} from '../wires.factory';
import { createQuerySuggestionsStoreMock, getExpectedWirePayload, SubjectHandler } from './utils';

describe('testing wires factory', () => {
  const storeMock = createQuerySuggestionsStoreMock();
  const subjectHandler = new SubjectHandler();
  const busMock = new BaseXBus();
  const busOnMock = busMock.on.bind(busMock);

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

        wire(subjectHandler.subject, storeMock, busOnMock);
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

        wire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit(query);

        expect(storeMock.commit).toHaveBeenCalledWith(mutationName, query);
      }
    );

    test(
      wireCommit.name + ' allows creating wires that commit a mutation with a static payload',
      () => {
        const staticQuery = 'entraña';
        const wire = wireCommit(mutationName, staticQuery);

        wire(subjectHandler.subject, storeMock, busOnMock);
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

        wire(subjectHandler.subject, storeMock, busOnMock);
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

        wire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit('');

        expect(storeMock.commit).toHaveBeenCalledWith(mutationName, storeMock.getters[getterPath]);
      }
    );

    test(
      wireCommitWithoutPayload.name +
        ' allows creating wires that commit a mutation without payload',
      () => {
        const wire = wireCommitWithoutPayload(mutationName);

        wire(subjectHandler.subject, storeMock, busOnMock);
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

        wire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit(query);

        expect(storeMock.dispatch).toHaveBeenCalledWith(actionName, query);
      }
    );

    test(
      wireDispatch.name + ' allows creating wires that dispatch an action with a static payload',
      () => {
        const staticQuery = 'pluma';
        const wire = wireDispatch(actionName, staticQuery);

        wire(subjectHandler.subject, storeMock, busOnMock);
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

        wire(subjectHandler.subject, storeMock, busOnMock);
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

        wire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit('');

        expect(storeMock.dispatch).toHaveBeenCalledWith(actionName, storeMock.getters[getterPath]);
      }
    );

    test(
      wireDispatchWithoutPayload.name +
        ' allows creating wires that dispatch an action without payload',
      () => {
        const wire = wireDispatchWithoutPayload(actionName);

        wire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit('oysters');

        expect(storeMock.dispatch).toHaveBeenCalledWith(actionName);
      }
    );
  });

  describe('testing wire service factories', () => {
    class TestService {
      public noParametersMethod = jest.fn(noOp);
      public oneOptionalParameterMethod = jest.fn((parameter?: string) => parameter);
      public oneParameterMethod = jest.fn((parameter: string) => parameter);
      public restParametersMethod = jest.fn((...parameters: number[]) => parameters);
      public multipleParametersMethod = jest.fn((a: number, b: number) => a + b);
    }

    describe(`testing ${wireService.name}`, () => {
      it('allows calling methods with no parameters', () => {
        const service = new TestService();
        const wireTestService = wireService(service);
        const wire = wireTestService('noParametersMethod');
        wire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit('something');

        expect(service.noParametersMethod).toHaveBeenCalledTimes(1);
        // Methods that have no parameters will be invoked with the payload.
        expect(service.noParametersMethod).toHaveBeenCalledWith('something');
      });

      it('allows calling methods with one parameter', () => {
        const service = new TestService();
        const wireTestService = wireService(service);
        const wire = wireTestService('oneParameterMethod');
        wire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit('milk');

        expect(service.oneParameterMethod).toHaveBeenCalledTimes(1);
        expect(service.oneParameterMethod).toHaveBeenCalledWith('milk');
      });

      it('allows calling methods with one parameter passed statically', () => {
        const service = new TestService();
        const wireTestService = wireService(service);
        const wire = wireTestService('oneParameterMethod', 'torreznos');
        wire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit('lettuce');

        expect(service.oneParameterMethod).toHaveBeenCalledTimes(1);
        expect(service.oneParameterMethod).toHaveBeenCalledWith('torreznos');
      });

      it('allows calling methods with rest parameters', () => {
        const service = new TestService();
        const wireTestService = wireService(service);
        const wire = wireTestService('restParametersMethod');
        wire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit(10);

        expect(service.restParametersMethod).toHaveBeenCalledTimes(1);
        expect(service.restParametersMethod).toHaveBeenCalledWith(10);
      });

      it('allows calling methods with rest parameters passed statically', () => {
        const service = new TestService();
        const wireTestService = wireService(service);
        const wire = wireTestService('restParametersMethod', 5);
        wire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit(10);

        expect(service.restParametersMethod).toHaveBeenCalledTimes(1);
        expect(service.restParametersMethod).toHaveBeenCalledWith(5);
      });

      // eslint-disable-next-line jest/expect-expect
      it("doesn't allow calling methods with multiple parameters", () => {
        // This check is just to assert that we can't call a method with multiple parameters
        const wireTestService = wireService(new TestService());
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        wireTestService('multipleParametersMethod');
      });
    });

    describe(`testing ${wireServiceWithoutPayload.name}`, () => {
      it('invokes service methods with no parameters', () => {
        const service = new TestService();
        const wireTestService = wireServiceWithoutPayload(service);
        const wire = wireTestService('noParametersMethod');
        wire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit('something');

        expect(service.noParametersMethod).toHaveBeenCalledTimes(1);
        expect(service.noParametersMethod).toHaveBeenCalledWith();
      });

      it('allows calling methods with optional parameters', () => {
        const service = new TestService();
        const wireTestService = wireServiceWithoutPayload(service);
        const wire = wireTestService('oneOptionalParameterMethod');
        wire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit(10);

        expect(service.oneOptionalParameterMethod).toHaveBeenCalledTimes(1);
        expect(service.oneOptionalParameterMethod).toHaveBeenCalledWith();
      });

      it('allows calling methods with rest parameters', () => {
        const service = new TestService();
        const wireTestService = wireServiceWithoutPayload(service);
        const wire = wireTestService('restParametersMethod');
        wire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit(10);

        expect(service.restParametersMethod).toHaveBeenCalledTimes(1);
        expect(service.restParametersMethod).toHaveBeenCalledWith();
      });

      // eslint-disable-next-line jest/expect-expect
      it("doesn't allow calling methods with one or more parameters", () => {
        // This check is just to assert that we can't call methods with compulsory parameters
        const wireTestService = wireServiceWithoutPayload(new TestService());

        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-expect-error
        wireTestService('oneParameterMethod');
        // @ts-expect-error
        wireTestService('multipleParametersMethod');
        /* eslint-enable @typescript-eslint/ban-ts-comment */
      });
    });
  });
});
