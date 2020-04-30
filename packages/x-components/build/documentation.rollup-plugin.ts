import {
  ConsoleMessageId,
  Extractor,
  ExtractorConfig,
  ExtractorLogLevel,
  ExtractorMessage,
  ExtractorResult,
  IExtractorInvokeOptions
} from '@microsoft/api-extractor';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Plugin } from 'rollup';
import { ensureDirectoryExists } from './build.utils';

/**
 * Entry point for building the API Documentation.
 *
 * @returns Rollup API documentation plugin.
 */
export function apiDocumentation(): Plugin {
  return {
    name: 'API-Documentation',
    writeBundle() {
      const apiExtractorJsonPath: string = path.join(__dirname, './api-extractor.json');
      const extractorConfig = ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath);
      generateEmptyReportFile(extractorConfig.reportFilePath);
      const extractorResult = Extractor.invoke(extractorConfig, getExtractorInvokeOptions());
      assertExtractorSucceeded(extractorResult);
      copyReportFile(extractorConfig.reportFilePath);
      return generateDocumentation();
    }
  };
}

/**
 * Generates an empty report file so API extractor does not complain when performing a
 * production build.
 *
 * @param reportFilePath - The full path where the report file should be created.
 */
function generateEmptyReportFile(reportFilePath: string): void {
  ensureDirectoryExists(reportFilePath);
  fs.writeFileSync(reportFilePath, '');
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
      // eslint-disable-next-line max-len
      `API Extractor found ${extractorResult.errorCount} errors and ${extractorResult.warningCount} warnings`
    );
  }
}

/**
 * Copies the generated report file from the temp folder to its final location.
 *
 * @param reportFilePath - The full path where the report file should be created.
 */
function copyReportFile(reportFilePath: string): void {
  const tempReportFile = path.join(__dirname, '../temp/x-components.api.md');
  fs.copyFileSync(tempReportFile, reportFilePath);
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
        message.logLevel = ExtractorLogLevel.None;
      }
    }
  };
}

/**
 * Runs the command for generating the documentation, wrapping it into a promise for rollup.
 *
 * @returns Promise - A promise that resolves when the documentation command finishes.
 */
function generateDocumentation(): Promise<void> {
  return new Promise((resolve, reject) => {
    exec('npm run gen:docs', (error, _, stderr) => {
      if (error) {
        reject(error);
      }
      if (stderr) {
        reject(stderr);
      }
      resolve();
    });
  });
}
