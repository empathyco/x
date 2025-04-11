# Debugging The Build

To set breakpoints and debug the build process of X-Translations you'll need to create
a custom debug configuration for Node.js:

1. Click the _Run_ dropdown menu of the Webstorm's toolbar and select _Edit Configurations..._
2. Click on the + icon at the top left of the window and select the Node.js configuration type
3. Give a name to the configuration. The _Node interpreter_ and _Working directory_ fields should be already filled
4. In the _Node parameters_ field write `--require ts-node/register`
5. In the _JavaScript file_ field write your build file path, `src/json-to-csv.ts`
6. In the _Application parameters_ field write your params, `./tests/json/en_translations.json`
7. Finally, fill the _Environment variables_ field with `TS_NODE_PROJECT=./tsconfig.json` and apply the changes

The creation of the new debug configuration is complete. Now, select from the drop-down list on the
top-right corner of Webstorm the configuration that you just created, set the debugging breakpoints
where you want the build process to stop and then start debug process (`^D`).
