import { isStringEmpty, toKebabCase } from '../string'

describe(`testing ${isStringEmpty.name} utility method`, () => {
  it('returns `true` when the string is `null`, `undefined` or is an empty string', () => {
    expect(isStringEmpty(undefined)).toEqual(true)
    expect(isStringEmpty(null)).toEqual(true)
    expect(isStringEmpty('')).toEqual(true)
  })

  it('returns `false` when the string length is greater than zero', () => {
    expect(isStringEmpty('a')).toEqual(false)
  })
})

describe(`testing ${toKebabCase.name} utility method`, () => {
  it('formats a string to kebab case', () => {
    expect(toKebabCase('camelCase')).toEqual('camel-case')
    expect(toKebabCase('PascalCase')).toEqual('pascal-case')
    expect(toKebabCase('snake_case')).toEqual('snake-case')
    expect(toKebabCase('kebab-case')).toEqual('kebab-case')
    expect(toKebabCase('spaces spaces  spaces')).toEqual('spaces-spaces-spaces')
  })
})
