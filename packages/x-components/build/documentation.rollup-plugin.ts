import { Extractor, ExtractorConfig, ExtractorResult } from '@microsoft/api-extractor';
import fs from 'fs';
import path from 'path';
import { Plugin } from 'rollup';
import { ensureDirectoryExists } from './build.utils';
import { exec } from 'child_process';

export function apiDocumentation(): Plugin {
  return {
    name: 'API-Documentation',
    writeBundle() {
      const apiExtractorJsonPath: string = path.join(__dirname, './api-extractor.json');
      const extractorConfig = ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath);
      generateEmptyReportFile(extractorConfig.reportFilePath);
      const extractorResult = Extractor.invoke(extractorConfig);
      assertExtractorSucceeded(extractorResult);
      copyReportFile(extractorConfig.reportFilePath);
      return generateDocumentation();
    }
  };
}

/**
 * Generates an empty report file so API extractor does not complain when performing a
 * production build
 *
 * @param reportFilePath - The full path where the report file should be created
 */
function generateEmptyReportFile(reportFilePath: string): void {
  ensureDirectoryExists(reportFilePath);
  fs.writeFileSync(reportFilePath, '');
}

/**
 * Asserts that the execution of the API extractor has succeeded, muting the unneeded `apiReportChanged`
 * warning
 *
 * @param extractorResult - The API extractor execution result
 */
function assertExtractorSucceeded(extractorResult: ExtractorResult): void {
  if (!extractorResult.succeeded && isNotAPIChangeWarning(extractorResult)) {
    throw new Error(
      `API Extractor found ${extractorResult.errorCount} errors and ${extractorResult.warningCount} warnings`
    );
  }
}

/**
 * Copies the generated report file from the temp folder to its final location
 *
 * @param reportFilePath - The full path where the report file should be created
 */
function copyReportFile(reportFilePath: string): void {
  const tempReportFile = path.join(__dirname, '../temp/x-components.api.md');
  fs.copyFileSync(tempReportFile, reportFilePath);
}

/**
 * Checks the API extractor execution result, and checks if it has any errors or warning different
 * than the `apiReportChanged` warning
 *
 * @param extractorResult - The API extractor execution result
 * @returns `true` if there is any warning or error that is not an API warning, `false` otherwise
 */
function isNotAPIChangeWarning(extractorResult: ExtractorResult): boolean {
  return (
    extractorResult.errorCount > 0 ||
    extractorResult.warningCount > 1 ||
    (extractorResult.warningCount === 1 && !extractorResult.apiReportChanged)
  );
}

/**
 * Runs the command for generating the documentation, wrapping it into a promise for rollup
 *
 * @returns Promise - A promise that resolves when the documentation command finishes
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
