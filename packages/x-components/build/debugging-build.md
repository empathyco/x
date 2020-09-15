# Debugging The Build

To set breakpoints and debug the build process of X-Components you'll need to create
a custom debug configuration for Node.js:

1. Click the *Run* dropdown menu of the Webstorm's toolbar and select *Edit Configurations...*
2. Click on the + icon at the top left of the window and select the Node.js configuration type
3. Give a name to the configuration. The *Node interpreter* and *Working directory* fields should be already filled
4. In the *Node parameters* field write `--require ts-node/register`
5. In the *JavaScript file* field write your build file path, `build/build.ts`
6. Finally, fill the *Environment variables* field with `TS_NODE_PROJECT=./build/tsconfig.json` and apply the changes

The creation of the new debug configuration is complete. Now, select from the drop-down list on the
top-right corner of Webstorm the configuration that you just created, set the debugging breakpoints
where you want the build process to stop and then start debug process (`^D`).

## Know Issues

Webstorm debugger outputs some info messages to the `stderr` stream. As the documentation plugin
checks if there has been any output to this stream, the build will fail. To fix this, you can simply comment
the following lines in the `documentation.rollup-plugin.ts` file:

```javascript
if (stderr) {
  reject(stderr);
}
```
