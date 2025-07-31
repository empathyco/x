import fs from 'node:fs'
import path from 'node:path'
import expectedJson from '../__tests__/json/en.messages.json'
import { getJSONTranslations } from '../csv-to-json'
import { loadFile } from '../utils'

describe('transform CSV to a JSON', () => {
  const sourcePath = './src/__tests__/csv/en.messages.csv'
  const csvPath = './src/__tests__/csv'
  const targetPath = './translations'
  const absoluteTargetPath = path.resolve(process.cwd(), targetPath)
  const outputPath = path.resolve(process.cwd(), './output')
  const jsonPath = path.resolve(process.cwd(), './src/__tests__/json')

  afterEach(() => {
    if (fs.existsSync(absoluteTargetPath)) {
      fs.rmSync(absoluteTargetPath, { recursive: true })
    }
    if (fs.existsSync(outputPath)) {
      fs.rmSync(outputPath, { recursive: true })
    }
  })

  it('should transform a csv with multiple devices to a JSON', () => {
    process.argv = ['param1', 'param2', sourcePath]
    const json = getJSONTranslations()
    expect(json).toEqual([expectedJson])
  })

  it('should check that multiple files are exported in the default directory', () => {
    process.argv = ['param1', 'param2', csvPath]

    getJSONTranslations()

    expect(fs.existsSync(`${outputPath}/en.messages.json`)).toBe(true)
    expect(fs.existsSync(`${outputPath}/es.messages.json`)).toBe(true)

    expect(loadFile(`${outputPath}/en.messages.json`)).toEqual(
      loadFile(`${jsonPath}/en.messages.json`),
    )
    expect(loadFile(`${outputPath}/es.messages.json`)).toEqual(
      loadFile(`${jsonPath}/es.messages.json`),
    )
  })

  it('should check that multiple files are exported in the path given', () => {
    process.argv = ['param1', 'param2', csvPath, targetPath]

    getJSONTranslations()

    expect(fs.existsSync(`${absoluteTargetPath}/en.messages.json`)).toBe(true)
    expect(fs.existsSync(`${absoluteTargetPath}/es.messages.json`)).toBe(true)

    expect(loadFile(`${absoluteTargetPath}/en.messages.json`)).toEqual(
      loadFile(`${jsonPath}/en.messages.json`),
    )
    expect(loadFile(`${absoluteTargetPath}/es.messages.json`)).toEqual(
      loadFile(`${jsonPath}/es.messages.json`),
    )
  })
})
