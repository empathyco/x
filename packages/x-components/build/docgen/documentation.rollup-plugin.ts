import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import {
  ConsoleMessageId,
  Extractor,
  ExtractorConfig,
  ExtractorLogLevel,
  ExtractorMessage,
  ExtractorResult,
  IExtractorInvokeOptions
} from '@microsoft/api-extractor';
import { Plugin } from 'rollup';
import { copyFolderSync, ensureDirectoryPathExists, ensureFilePathExists } from '../build.utils';
import { modifyDocForRunbooks } from './runbooks-integraton';

const rootDir = path.resolve(__dirname, '../../');

/** Location of the documentation report directory of the project. */
const REPORT_DIR = path.join(rootDir, 'report/');

/**
 * Entry point for building the API Documentation.
 *
 * @returns Rollup API documentation plugin.
 */
export function apiDocumentation(): Plugin {
  return {
    name: 'API-Documentation',
    async writeBundle() {
      ensureDirectoryPathExists(REPORT_DIR);
      copyThirdPartyDocModel('search-types');
      copyThirdPartyDocModel('search-adapter');

      const apiExtractorJsonPath: string = path.join(rootDir, 'build/api-extractor.json');
      const extractorConfig = ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath);
      generateEmptyReportFile(extractorConfig.reportFilePath);
      const extractorResult = Extractor.invoke(extractorConfig, getExtractorInvokeOptions());
      assertExtractorSucceeded(extractorResult);
      copyReportFile(extractorConfig.reportFilePath);
      try {
        await generateDocumentation();
        copyStaticDocumentation('static-docs', 'docs');
        modifyDocForRunbooks('docs');
      } catch (e) {
        console.log(e);
      }
    }
  };
}

/**
 * Copies the doc model of \@empathy dependencies into the report directory. This doc model is
 * generated by the api-extractor at build time in these third party dependencies.
 *
 * @param packageName - Empathy package name which contains the doc model of the dependency.
 */
function copyThirdPartyDocModel(packageName: string): void {
  const docModelName = `${packageName}.api.json`;
  const originalLocationPath = path.join(
    rootDir,
    `node_modules/@empathy/${packageName}/report/${docModelName}`
  );
  const destinationLocationPath = path.join(REPORT_DIR, docModelName);
  fs.copyFileSync(originalLocationPath, destinationLocationPath);
}

/**
 * Generates an empty report file so API extractor does not complain when performing a
 * production build.
 *
 * @param reportFilePath - The full path where the report file should be created.
 */
function generateEmptyReportFile(reportFilePath: string): void {
  ensureFilePathExists(reportFilePath);
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
  const tempReportFile = path.join(rootDir, 'temp/x-components.api.md');
  fs.copyFileSync(tempReportFile, reportFilePath);
}

/**
 * Copies the configuration and setup documentation folder to the docs folder.
 *
 * @param source - The source folder path.
 * @param target - The target folder path.
 */
function copyStaticDocumentation(source: string, target: string): void {
  const sourceFolderPath = path.join(rootDir, source);
  const targetFolderPath = path.join(rootDir, target);
  copyFolderSync(sourceFolderPath, targetFolderPath);
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
    exec('npm run gen:docs', error => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
}
