# X Components Archetype

Welcome to the X Components Archetype

## What is this repository for?

The purpose of this repository is to be the starting point to a customer setup using the X
Components. Please take a look at the [documentation](./docs/index.md).

This repository uses [Standard Version](https://github.com/conventional-changelog/standard-version)
for the versioning. Keep this in mind when you contribute to this project. Also remember to change
the `header` variable in the `.vesionrc.js` file with the client's name if needed.

If you want to contribute to this project please keep in mind that it uses
[Conventional Commits](https://www.conventionalcommits.org/) for its commit messages and
[commitizen](https://github.com/commitizen/cz-cli) as helping tool to generate the commits. Whenever
you want to create a commit, run `npm run commit` and the commitizen wizard will guide you in
writing the commit message.


## Translations

This project has a couple a of npm commands which allow you to export/import the translations:

- If you want to export to a `csv` file the messages of the project:

```shell
npm run json:csv
```
- If you want to import the translations in a `csv` file to this project:

```shell
npm run csv:json
```

In that case you need to put the `csv` files inside a folder called `output`in the root directory.
