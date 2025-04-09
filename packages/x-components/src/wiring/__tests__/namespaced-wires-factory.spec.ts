import type { Store } from 'vuex'
import type { RootXStoreState } from '../../store/index'
import { XDummyBus } from '../../__tests__/bus.dummy'
import {
  namespacedWireCommit,
  namespacedWireCommitWithoutPayload,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload,
} from '../namespaced-wires.factory'
import { createQuerySuggestionsStoreMock, SubjectHandler } from './utils'

describe('testing namespaced wires factory', () => {
  const moduleName = 'querySuggestions'
  const storeMock = createQuerySuggestionsStoreMock() as Store<RootXStoreState>
  const busMock = new XDummyBus()
  const busOnMock = busMock.on.bind(busMock)

  const subjectHandler = new SubjectHandler()

  beforeEach(() => {
    subjectHandler.reset()
    jest.clearAllMocks()
  })

  describe('testing namespaced mutation wires factory', () => {
    const mutationName = 'setQuery'
    const querySuggestionsWireCommit = namespacedWireCommit(moduleName)
    const mutationFullPath = `x/${moduleName}/${mutationName}`

    it(`${
      namespacedWireCommit.name
    } allows creating wires that commit a mutation with the observable payload`, () => {
      const wire = querySuggestionsWireCommit(mutationName)
      const query = 'porterhouse steak'

      wire(subjectHandler.subject, storeMock, busOnMock)
      subjectHandler.emit(query)

      expect(storeMock.commit).toHaveBeenCalledWith(mutationFullPath, query)
    })

    it(`${
      namespacedWireCommit.name
    } allows creating wires that commit a mutation with a static payload`, () => {
      const staticQuery = 'tenderloin'
      const wire = querySuggestionsWireCommit(mutationName, staticQuery)

      wire(subjectHandler.subject, storeMock, busOnMock)
      subjectHandler.emit('beans')

      expect(storeMock.commit).toHaveBeenCalledWith(mutationFullPath, staticQuery)
    })

    it(
      `${
        namespacedWireCommit.name
      } allows creating wires that commit a mutation with a function payload that receives the` +
        ` module state`,
      () => {
        const wire = querySuggestionsWireCommit(
          mutationName,
          ({ state }) => `${state.query}_modified`,
        )

        wire(subjectHandler.subject, storeMock, busOnMock)
        subjectHandler.emit('beans')

        expect(storeMock.commit).toHaveBeenCalledWith(
          mutationFullPath,
          `${storeMock.state.x.querySuggestions.query}_modified`,
        )
      },
    )

    it(
      `${
        namespacedWireCommit.name
      } allows creating wires that commit a mutation with a function payload that receives the` +
        ` module getters`,
      () => {
        const wire = querySuggestionsWireCommit(
          mutationName,
          ({ getters }) => `${getters.normalizedQuery}_modified`,
        )

        wire(subjectHandler.subject, storeMock, busOnMock)
        subjectHandler.emit('beans')

        expect(storeMock.commit).toHaveBeenCalledWith(
          mutationFullPath,
          `${storeMock.getters[`x/${moduleName}/normalizedQuery`]}_modified`,
        )
      },
    )

    it(`${
      namespacedWireCommitWithoutPayload.name
    } allows creating wires that commit a mutation without payload`, () => {
      // Tested module does not have any mutations without payload. It is a hack type to test it
      const wire = namespacedWireCommitWithoutPayload(moduleName)(mutationName as never)

      wire(subjectHandler.subject, storeMock, busOnMock)
      subjectHandler.emit('beetroot')

      expect(storeMock.commit).toHaveBeenCalledWith(mutationFullPath)
    })
  })

  describe('testing namespaced actions wires factory', () => {
    const actionName = 'fetchAndSaveSuggestions'
    const querySuggestionsWireDispatch = namespacedWireDispatch(moduleName)
    const actionFullPath = `x/${moduleName}/${actionName}`

    it(`${
      namespacedWireDispatch.name
    } allows creating wires that dispatch an action with the observable payload`, () => {
      const wire = querySuggestionsWireDispatch(actionName)
      const query = 'osobuco'

      wire(subjectHandler.subject, storeMock, busOnMock)
      subjectHandler.emit(query)

      expect(storeMock.dispatch).toHaveBeenCalledWith(actionFullPath, query)
    })

    it(`${
      namespacedWireDispatch.name
    } allows creating wires that dispatch an action with a static payload`, () => {
      const staticQuery = 'pork knuckle'
      // The tested module does not have any actions with payload. It is a hack type to test it
      const wire = querySuggestionsWireDispatch(actionName as never, staticQuery as never)

      wire(subjectHandler.subject, storeMock, busOnMock)
      subjectHandler.emit('cucumber')

      expect(storeMock.dispatch).toHaveBeenCalledWith(actionFullPath, staticQuery)
    })

    it(
      `${
        namespacedWireDispatch.name
      } allows creating wires that dispatch an action with a function payload that receives the` +
        ` module state`,
      () => {
        // The tested module does not have any actions with payload. It is a hack type to test it
        const wire = querySuggestionsWireDispatch(
          actionName as never,
          ({ state }) => `${state.query}_modified` as never,
        )

        wire(subjectHandler.subject, storeMock, busOnMock)
        subjectHandler.emit('beans')

        expect(storeMock.dispatch).toHaveBeenCalledWith(
          actionFullPath,
          `${storeMock.state.x.querySuggestions.query}_modified`,
        )
      },
    )

    it(
      `${
        namespacedWireDispatch.name
      } allows creating wires that dispatch a action with a function payload that receives` +
        ` the module getters`,
      () => {
        // The tested module does not have any actions with payload. It is a hack type to test it
        const wire = querySuggestionsWireDispatch(
          actionName as never,
          ({ getters }) => `${getters.normalizedQuery}_modified` as never,
        )

        wire(subjectHandler.subject, storeMock, busOnMock)
        subjectHandler.emit('beans')

        expect(storeMock.dispatch).toHaveBeenCalledWith(
          actionFullPath,
          `${storeMock.getters[`x/${moduleName}/normalizedQuery`]}_modified`,
        )
      },
    )

    it(`${
      namespacedWireDispatchWithoutPayload.name
    } allows creating wires that dispatch an action without payload`, () => {
      const wire = namespacedWireDispatchWithoutPayload(moduleName)('cancelFetchAndSaveSuggestions')

      wire(subjectHandler.subject, storeMock, busOnMock)
      subjectHandler.emit('celery')

      expect(storeMock.dispatch).toHaveBeenCalledWith(
        `x/${moduleName}/cancelFetchAndSaveSuggestions`,
      )
    })
  })
})
