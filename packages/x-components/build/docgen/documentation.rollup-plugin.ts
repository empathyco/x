import type {
  ExtractorMessage,
  ExtractorResult,
  IExtractorInvokeOptions,
} from '@microsoft/api-extractor'
import type { Plugin } from 'rollup'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import {
  ConsoleMessageId,
  Extractor,
  ExtractorConfig,
  ExtractorLogLevel,
} from '@microsoft/api-extractor'
import { ensureDirectoryPathExists, ensureFilePathExists } from '../build.utils'

const rootDir = path.resolve(__dirname, '../../')

interface APIDocumentationPluginOptions {
  /** The path where the build will go. */
  buildPath: string
}

/**
 * Entry point for building the API Documentation.
 *
 * @param options - Options to configure the generation of the documentation.
 * @returns Rollup API documentation plugin.
 */
export function apiDocumentation(options: APIDocumentationPluginOptions): Plugin {
  return {
    name: 'API-Documentation',
    async generateBundle() {
      const reportFolder = path.join(options.buildPath, 'report')
      ensureDirectoryPathExists(reportFolder)
      copyThirdPartyDocModel(reportFolder, 'x-types')
      copyThirdPartyDocModel(reportFolder, 'x-adapter-platform')

      const apiExtractorJsonPath: string = path.join(rootDir, 'build/api-extractor.json')
      const extractorConfig = ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath)
      generateEmptyReportFile(extractorConfig.reportFilePath)
      const extractorResult = Extractor.invoke(extractorConfig, getExtractorInvokeOptions())
      assertExtractorSucceeded(extractorResult)
      copyReportFile(extractorConfig.reportFilePath)
      try {
        await generateDocumentation()
      } catch (error) {
        console.error(error)
      }
    },
  }
}

/**
 * Copies the doc model of \@empathy dependencies into the report directory. This doc model is
 * generated by the api-extractor at build time in these third party dependencies.
 *
 * @param buildPath - Path of report.
 * @param packageName - Empathy package name which contains the doc model of the dependency.
 */
function copyThirdPartyDocModel(buildPath: string, packageName: string): void {
  const docModelName = `${packageName}.api.json`

  let originalLocationPath = path.join(
    rootDir,
    `node_modules/@empathyco/${packageName}/report/${docModelName}`,
  )
  if (!fs.existsSync(originalLocationPath)) {
    originalLocationPath = path.join(
      rootDir,
      '../../',
      `node_modules/@empathyco/${packageName}/report/${docModelName}`,
    )
  }
  const destinationLocationPath = path.join(buildPath, docModelName)
  fs.copyFileSync(originalLocationPath, destinationLocationPath)
}

/**
 * Generates an empty report file so API extractor does not complain when performing a
 * production build.
 *
 * @param reportFilePath - The full path where the report file should be created.
 */
function generateEmptyReportFile(reportFilePath: string): void {
  ensureFilePathExists(reportFilePath)
  fs.writeFileSync(reportFilePath, '')
}

/**
 * Asserts that the execution of the API extractor has succeeded, muting the unneeded
 * `apiReportChanged` warning.
 *
 * @param extractorResult - The API extractor execution result.
 */
function assertExtractorSucceeded(extractorResult: ExtractorResult): void {
  if (!extractorResult.succeeded) {
    throw new Error(
      `API Extractor found ${extractorResult.errorCount} errors and ${extractorResult.warningCount} warnings`,
    )
  }
}

/**
 * Copies the generated report file from the temp folder to its final location.
 *
 * @param reportFilePath - The full path where the report file should be created.
 */
function copyReportFile(reportFilePath: string): void {
  const tempReportFile = path.join(rootDir, 'temp/x-components.api.md')
  fs.copyFileSync(tempReportFile, reportFilePath)
}

/**
 * Configures IExtractorInvokeOptions to set a message callback to avoid
 * the warning message `You have changed the public API signature...` to be sent to the console.
 *
 * @returns Invoke options.
 */
function getExtractorInvokeOptions(): IExtractorInvokeOptions {
  return {
    messageCallback: (message: ExtractorMessage) => {
      if (message.messageId === ConsoleMessageId.ApiReportNotCopied) {
        message.logLevel = ExtractorLogLevel.None
      }
    },
  }
}

/**
 * Runs the command for generating the documentation, wrapping it into a promise for rollup.
 *
 * @returns Promise - A promise that resolves when the documentation command finishes.
 */
async function generateDocumentation(): Promise<void> {
  return new Promise((resolve, reject) => {
    exec('pnpm run gen:docs', error => {
      if (error) {
        reject(error)
      }
      resolve()
    })
  })
}
