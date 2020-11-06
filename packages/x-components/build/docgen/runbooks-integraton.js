const fs = require('fs');
const { join, basename, dirname } = require('path');
const glob = require('glob');

const DOCUSAURUS_FOLDER = getDocusaurusFolder();

/**
 * This function is used to not include some docs into runbooks, because they are not ready.
 * @param file - The full path of each documentation file.
 * @returns {boolean} - Returns true if the file is included in runbooks or false otherwise.
 */
function filterDocFiles(file) {
  return !file.includes('API-reference/api/');
}

/**
 * This function modifies the documentation files to integrate them in the Runbooks project.
 * So it does 3 different things:
 * 1. Generate a 'sidebar.json' file.
 * 2. Add the Runbooks headers to the .md files.
 * 3. Modify the imports inside the documentation to point to the Runbooks destination folder.
 *
 * @param destinationPath {string} - Path where the documentation files are generated.
 */
function modifyDocForRunbooks(destinationPath) {
  const { sidebarTree, headers, docusaurusFolderPaths } = generateData(destinationPath);
  generateSidebar(destinationPath, sidebarTree);
  injectHeaders(headers);
  replaceDocusaurusFolderPath(docusaurusFolderPaths);
}

/**
 * This function iterates recursively the documentation folder and process each .md file found. It
 * generates data that will be used for:
 * 1. Generate the 'sidebar.json' file.
 * 2. Add the Runbooks headers to the .md files.
 * 3. Modify the imports inside the documentation to point to the Runbooks destination folder.
 *
 * @param docsFolderPath {string} - The path of the folder that contains the static doc.
 * @returns {object} - An object with the 3 data structures for each task.
 */
function generateData(docsFolderPath) {
  const files = glob.sync(`${docsFolderPath}/**/*.md`, {
    cwd: join(__dirname, '../../')
  });
  const sidebarTree = [];
  const headers = {};
  const docusaurusFolderPaths = {};

  files.filter(filterDocFiles).forEach(file => {
    const path = file.split('/').slice(1, -1);
    const filePath = join(...path, basename(file));
    addSidebarTreeRecursively(sidebarTree, path, filePath);
    createHeader(headers, join(docsFolderPath, filePath));
    createDocusaurusFolderPath(docusaurusFolderPaths, path, join(docsFolderPath, filePath));
  });
  return { sidebarTree, headers, docusaurusFolderPaths };
}

/**
 * This function creates recursively the tree structure of the sidebar.
 *
 * @param node {*[]} - The current node of the tree.
 * @param folders {string[]} - The list of folders to the documentation file.
 * @param file {string} - The current documentation file path processed.
 */
function addSidebarTreeRecursively(node, [currentFolder, ...remainingFolders], file) {
  if (currentFolder === undefined) {
    const fileId = getFileId(file);
    const path = dirname(file);
    node.push(`${DOCUSAURUS_FOLDER}/${path}/${fileId}`);
  } else {
    const title = getFileTitle(currentFolder);
    let nextNode = node.find(child => !!child[title]);
    if (!nextNode) {
      nextNode = { [title]: [] };
      node.push(nextNode);
    }
    addSidebarTreeRecursively(nextNode[title], remainingFolders, file);
  }
}

/**
 * Function to create the header of each documentation file. It stores the generated header in the
 * headers object using the file path as key.
 *
 * @param headers {object} - Object where headers are stored.
 * @param filePath {string} -  The path to the documentation file.
 */
function createHeader(headers, filePath) {
  const fileId = getFileId(filePath);
  const title = getFileTitle(basename(filePath, '.md'));
  headers[filePath] = `---
id: ${fileId}
title: ${title}
sidebar_label: ${title}
---
`;
}

/**
 * This function generates the necessary path to get the destination folder in Runbooks, relative
 * to each .md file.
 *
 * @param docusaurusFolderPaths {object} - The map the paths are stored.
 * @param path {string[]} - The list of the folders in the path to file.
 * @param fullFilePath {string} - The full path of the file.
 */
function createDocusaurusFolderPath(docusaurusFolderPaths, path, fullFilePath) {
  docusaurusFolderPaths[fullFilePath] = path.map(() => '..').join('/');
}

/**
 * This function generates the final version of the sidebar.json file in the docs folder.
 *
 * @param destinationPath {string} - The path (including the file name and extension) where the
 *   sidebar file is generated.
 * @param sidebarTree {*[]} The tree data to generate the sidebar.
 */
function generateSidebar(destinationPath, sidebarTree) {
  const fixedSidebarData = sidebarTree.reduce((fullDoc, sidebarTreeNode) => {
    return Object.assign(fullDoc, sidebarTreeNode);
  }, {});
  fs.writeFileSync(
    join(destinationPath, 'sidebar.json'),
    JSON.stringify(fixedSidebarData),
    'utf-8'
  );
}

/**
 * Function that adds the headers to the documentation files.
 *
 * @param headersData {$ObjMap} - The map where the key is the doc file and the value is the
 * header to add to the .md.
 */
function injectHeaders(headersData) {
  Object.entries(headersData).forEach(([docFilePath, header]) => {
    updateFile(docFilePath, fileDocContent => header + fileDocContent);
  });
}

/**
 * Function that replaces the `@docusaurus` path in the .md files by a relative path to the runbooks
 * destination folder.
 * @param reactComponentsPaths {object} - The map where the key is the doc file and the value is the
 * relative path to runbooks folder.
 */
function replaceDocusaurusFolderPath(reactComponentsPaths) {
  Object.entries(reactComponentsPaths).forEach(([docFilePath, reactComponentsPath]) => {
    updateFile(docFilePath, fileDocContent =>
      fileDocContent.replace(/@docusaurus/gm, reactComponentsPath)
    );
  });
}

/**
 * Auxiliary function to update the .md files using a `updaterFunction`
 * @param filePath {string} - The path of the doc file to modify.
 * @param updaterFunction {function} - The function that receives the file content and returns the
 * new modified content of the file.
 */
function updateFile(filePath, updaterFunction) {
  let fileDocContent = fs.readFileSync(filePath, 'utf-8');
  fileDocContent = updaterFunction(fileDocContent);
  fs.writeFileSync(filePath, fileDocContent);
}

/**
 * This function converts the path of the doc files into a title to use in sidebar.
 * @param str {string} - The path name.
 * @returns {string} - The title.
 */
function getFileTitle(str) {
  return str
    .replace('x-components.', '')
    .split('-')
    .map(string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`)
    .join(' ');
}

/**
 * Function that generates the file id used in the headers and in the sidebar paths.
 * @param file {string} - The path to the documentation file.
 * @returns {string} - The file id generated.
 */
function getFileId(file) {
  return `x-components.${basename(file, '.md')}`;
}

/**
 * Function that extract the docusaurus destination folder from the `Jenkinsfile`. This will be
 * used to compose the paths of the sidebar.
 * @returns {string} the path to the docusaurus destination folder.
 */
function getDocusaurusFolder() {
  const JenkinsfileContent = fs.readFileSync('Jenkinsfile', 'utf-8');
  const [, folder] = /docusaurusFolder='(.+)'/.exec(JenkinsfileContent);
  return folder;
}

module.exports = {
  modifyDocForRunbooks
};
