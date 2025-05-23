import type { ExperienceControlsRequest } from '@empathyco/x-types'
import { createExperienceControlsStore, resetExperienceControlsStateWith } from './utils'

describe('testing experience controls module getters', () => {
  const store = createExperienceControlsStore()

  beforeEach(() => {
    resetExperienceControlsStateWith(store)
  })

  describe(`request getter`, () => {
    it('should return a request object', () => {
      resetExperienceControlsStateWith(store, {
        params: {
          store: 'es',
        },
      })

      expect(store.getters.experienceControlsRequest).toEqual<ExperienceControlsRequest>({
        extraParams: {
          store: 'es',
        },
      })
    })
  })
})
