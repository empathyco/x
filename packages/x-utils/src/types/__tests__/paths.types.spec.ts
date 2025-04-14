import type { ExtractPath, ExtractPathByType, ExtractType } from '../paths.types'

interface Example {
  anString: string
  aNumber: number
  anObject: {
    something: {
      deep: boolean
    }
  }
  anArray: { property: string }[]
  aNumberArray: number[]
  record: Record<'a' | 'b' | 'c', { property: string }>
  complexUnion: number | { property: string }
  unknown: unknown
  optional?: { property: string }
  recursive: Example
  person: Person
}

interface Person {
  name: string
  address: {
    zipCode: string
    street: string
  }
  age: number
  cars: { model: string; year: number }[]
  friends: Person[]
}

/**
 * The following tests might look like silly ones that are not doing anything at all. However,
 * the goal of having them is to trigger typescript to check that the types are valid,
 * even if the assertions are not useful. So if we refactor the types and break something
 * typescript will complain when running the tests, and they will fail.
 */
describe('paths.types tests', () => {
  describe('extractPath', () => {
    it('safe types the string path to a property', () => {
      const test: ExtractPath<Example>[] = [
        'anString',
        'anObject.something',
        'anObject.something.deep',
        'anArray.0',
        'anArray.0.property',
        'unknown',
        'record.b',
        'record.a.property',
        'complexUnion.property',
        'optional.property',
        'aNumberArray',
        'aNumberArray.0',
        'recursive.recursive',
        'person.cars.0.model',
        'person.friends.0.friends',
        // @ts-expect-error - TS error.
        'anString.something',
        // @ts-expect-error - TS error.
        'anObject.notKeyName',
        // @ts-expect-error - TS error.
        'person.friends.4.notKeyName',
        // @ts-expect-error - TS error.
        'recursive.notKeyName',
        // @ts-expect-error - TS error.
        'record.notKeyName',
        // @ts-expect-error - TS error.
        'nonexistent',
        // @ts-expect-error - TS error.
        'anString.',
        // @ts-expect-error - TS error.
        'unknown.something',
        // @ts-expect-error - TS error.
        'unknown.',
        // @ts-expect-error - TS error.
        'complexUnion.toFixed',
      ]
      expect(test[0]).toBe('anString')
    })
  })

  describe('extractType', () => {
    it('returns the a boolean property', () => {
      type BooleanProperty = ExtractType<Example, 'anObject.something.deep'>
      // @ts-expect-error - TS error.
      let test: BooleanProperty = {}
      // @ts-expect-error - TS error.
      test = 'some string'
      // @ts-expect-error - TS error.
      test = 5
      test = true
      expect(typeof test).toBe('boolean')
    })

    it('returns an array property', () => {
      type ArrayOfObjects = ExtractType<Example, 'anArray'>
      // @ts-expect-error - TS error.
      let testArray: ArrayOfObjects = {}
      // @ts-expect-error - TS error.
      testArray = true
      // @ts-expect-error - TS error.
      testArray = 'some string'
      testArray = [{ property: 'test' }]
      expect(typeof testArray).toBe('object')
    })

    it('returns a complex union property', () => {
      type NumberOrObjectWithProperty = ExtractType<Example, 'complexUnion'>
      // @ts-expect-error - TS error.
      let testComplexUnion: NumberOrObjectWithProperty = 'some string'
      // @ts-expect-error - TS error.
      testComplexUnion = true
      // @ts-expect-error - TS error.
      testComplexUnion = []
      testComplexUnion = 5
      testComplexUnion = { property: 'str' }
      expect(typeof testComplexUnion).toBe('object')
    })

    it('returns a recursive object', () => {
      type RecursiveObject = ExtractType<Example, 'recursive.recursive'>
      // @ts-expect-error - TS error.
      let testRecursiveObject: Partial<RecursiveObject> = true
      // @ts-expect-error - TS error.
      testRecursiveObject = 'some string'
      // @ts-expect-error - TS error.
      testRecursiveObject = []
      // @ts-expect-error - TS error.
      testRecursiveObject = 5
      testRecursiveObject = { anString: 'some string' }
      expect(typeof testRecursiveObject).toBe('object')
    })

    it('returns a recursive number property', () => {
      type RecursiveFriendAge = ExtractType<
        Example,
        'person.friends.0.friends.1.friends.2.friends.3.friends.4.friends.5.friends.6.friends.7.friends.8.friends.9.friends.10.age'
      >

      // @ts-expect-error - TS error.
      let testRecursiveFriendAge: RecursiveFriendAge = {}
      // @ts-expect-error - TS error.
      testRecursiveFriendAge = 'some string'
      // @ts-expect-error - TS error.
      testRecursiveFriendAge = true
      // @ts-expect-error - TS error.
      testRecursiveFriendAge = []
      testRecursiveFriendAge = 33
      expect(typeof testRecursiveFriendAge).toBe('number')
    })

    it('returns a recursive string property', () => {
      type RecursiveFriendName = ExtractType<
        Example,
        'person.friends.0.friends.1.friends.2.friends.3.friends.4.friends.5.friends.6.friends.7.friends.8.friends.9.friends.10.name'
      >

      // @ts-expect-error - TS error.
      let testRecursiveFriendName: RecursiveFriendName = {}
      // @ts-expect-error - TS error.
      testRecursiveFriendName = 5
      // @ts-expect-error - TS error.
      testRecursiveFriendName = true
      testRecursiveFriendName = 'some name'
      expect(typeof testRecursiveFriendName).toBe('string')
    })

    it('returns a deep recursive array item', () => {
      type RecursiveFriend = ExtractType<
        Example,
        'person.friends.0.friends.1.friends.2.friends.3.friends.4.friends.5.friends.6.friends.7.friends.8.friends.9.friends.10'
      >

      // @ts-expect-error - TS error.
      let testRecursiveFriend: Partial<RecursiveFriend> = 5
      // @ts-expect-error - TS error.
      testRecursiveFriend = true
      // @ts-expect-error - TS error.
      testRecursiveFriend = { randomKey: 5 }
      testRecursiveFriend = { name: 'Some team' }
      expect(typeof testRecursiveFriend).toBe('object')
    })
  })

  describe('extractPathByType', () => {
    interface PathsExample {
      stringKey: string
      optionalStringKey?: string
      numberKey: number
      booleanKey: boolean
      objectKey: {
        innerStringKey: string
      }
      functionKey: (random: any) => any
      arrayKey: string[]
    }

    it('extracts the property paths of the provided object that match the given type', () => {
      const test: ExtractPathByType<PathsExample, string>[] = [
        'stringKey',
        'objectKey.innerStringKey',
        'arrayKey.0',
        // @ts-expect-error - TS error.
        'optionalStringKey',
        // @ts-expect-error - TS error.
        'numberKey',
        // @ts-expect-error - TS error.
        'booleanKey',
        // @ts-expect-error - TS error.
        'objectKey',
        // @ts-expect-error - TS error.
        'functionKey',
      ]

      expect(typeof test).toBe('object')
    })
  })
})
