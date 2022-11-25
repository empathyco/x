# Convert SVGs into Vue components to use with the X Design System

This project generates Vue components from SVGs in a folder, with the format required for the XDS

## How to use it

### Params

It receives two parameters, the first one should be the path to the folder containing the SVGs. The
second one indicates if the source SVGs should be deleted at the end of the process (`--keep-svgs`).
By default, the SVGs are deleted.

- **sourcePath**: path of the folder with the SVGs.
- **keepSVGs**: indicates if the SVGs are deleted at the end. `false` by default.

### Run it as script

Run the following command to generate a Vue component from each SVG in the source folder:

```
ts-node ./src/svg-to-vue.ts ./yourSourceFolder
```

If you want to keep the source SVGs, add the `--keep-svgs` param:

```
ts-node ./src/svg-to-vue.ts ./yourSourceFolder --keep-svgs
```
