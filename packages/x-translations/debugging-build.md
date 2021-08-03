# Debugging The Build

To set breakpoints and debug the build process of X-Translations you'll need to create
a custom debug configuration for Node.js:

1. Click the *Run* dropdown menu of the Webstorm's toolbar and select *Edit Configurations...*
2. Click on the + icon at the top left of the window and select the Node.js configuration type
3. Give a name to the configuration. The *Node interpreter* and *Working directory* fields should be already filled
4. In the *Node parameters* field write `--require ts-node/register`
5. In the *JavaScript file* field write your build file path, `src/json-to-csv.ts`
6. In the *Application parameters* field write your params, `./tests/json/en_translations.json`
7. Finally, fill the *Environment variables* field with `TS_NODE_PROJECT=./tsconfig.json` and apply the changes

The creation of the new debug configuration is complete. Now, select from the drop-down list on the
top-right corner of Webstorm the configuration that you just created, set the debugging breakpoints
where you want the build process to stop and then start debug process (`^D`).
