import { Subject } from 'rxjs/Subject';
import { Store } from 'vuex';
import {
  wireCommit,
  wireCommitWithoutPayload,
  wireDispatch,
  wireDispatchWithoutPayload,
  withModule
} from '../wires.factory';

const store: Store<any> = {
  dispatch: jest.fn(),
  commit: jest.fn()
} as any;

let subject: Subject<string>;

beforeEach(() => {
  subject?.complete();
  subject = new Subject();
  jest.clearAllMocks();
});

describe('testing mutations wires factory', () => {
  const mutationName = 'setQuery';

  it('allows creating wires that commit a mutation with the observable payload', () => {
    const wire = wireCommit(mutationName);
    const query = 'churrasco';

    wire(subject, store);
    subject.next(query);

    expect(store.commit).toHaveBeenCalledTimes(1);
    expect(store.commit).toHaveBeenCalledWith(mutationName, query);
  });

  it('allows creating wires that commit a mutation with a static payload', () => {
    const staticQuery = 'entraña';
    const wire = wireCommit(mutationName, staticQuery);

    wire(subject, store);
    subject.next('cauliflower');

    expect(store.commit).toHaveBeenCalledTimes(1);
    expect(store.commit).toHaveBeenCalledWith(mutationName, staticQuery);
  });

  it('allows creating wires that commit a mutation without payload', () => {
    const wire = wireCommitWithoutPayload(mutationName);

    wire(subject, store);
    subject.next('zamburiñas');

    expect(store.commit).toHaveBeenCalledTimes(1);
    expect(store.commit).toHaveBeenCalledWith(mutationName);
  });
});

describe('testing actions wires factory', () => {
  const actionName = 'search';

  it('allows creating wires that dispatch an action with the observable payload', () => {
    const wire = wireDispatch(actionName);
    const query = 'falda';

    wire(subject, store);
    subject.next(query);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(actionName, query);
  });

  it('allows creating wires that dispatch an action with a static payload', () => {
    const staticQuery = 'pluma';
    const wire = wireDispatch(actionName, staticQuery);

    wire(subject, store);
    subject.next('edamame');

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(actionName, staticQuery);
  });

  it('allows creating wires that dispatch an action without payload', () => {
    const wire = wireDispatchWithoutPayload(actionName);

    wire(subject, store);
    subject.next('oysters');

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(actionName);
  });
});

describe('testing namespaced wire factory', () => {
  const moduleName = 'searchBox';
  const searchBoxModule = withModule(moduleName);

  describe('testing namespaced mutation wires factory', () => {
    const mutationName = 'setQuery';

    it('allows creating wires that commit a mutation with the observable payload', () => {
      const wire = searchBoxModule.wireCommit(mutationName);
      const query = 'porterhouse steak';

      wire(subject, store);
      subject.next(query);

      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith(
        `x/${moduleName}/${mutationName}`,
        query
      );
    });

    it('allows creating wires that commit a mutation with a static payload', () => {
      const staticQuery = 'tenderloin';
      const wire = searchBoxModule.wireCommit(mutationName, staticQuery);

      wire(subject, store);
      subject.next('beans');

      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith(
        `x/${moduleName}/${mutationName}`,
        staticQuery
      );
    });

    it('allows creating wires that commit a mutation without payload', () => {
      const wire = searchBoxModule.wireCommitWithoutPayload(mutationName);

      wire(subject, store);
      subject.next('beetroot');

      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith(
        `x/${moduleName}/${mutationName}`
      );
    });
  });

  describe('testing namespaced actions wires factory', () => {
    const actionName = 'search';

    it('allows creating wires that dispatch an action with the observable payload', () => {
      const wire = searchBoxModule.wireDispatch(actionName);
      const query = 'osobuco';

      wire(subject, store);
      subject.next(query);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        `x/${moduleName}/${actionName}`,
        query
      );
    });

    it('allows creating wires that dispatch an action with a static payload', () => {
      const staticQuery = 'pork knuckle';
      const wire = searchBoxModule.wireDispatch(actionName, staticQuery);

      wire(subject, store);
      subject.next('cucumber');

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        `x/${moduleName}/${actionName}`,
        staticQuery
      );
    });

    it('allows creating wires that dispatch an action without payload', () => {
      const wire = searchBoxModule.wireDispatchWithoutPayload(actionName);

      wire(subject, store);
      subject.next('celery');

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        `x/${moduleName}/${actionName}`
      );
    });
  });
});
