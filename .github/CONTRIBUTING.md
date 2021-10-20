# Contributing Guidelines

We are really excited that you want to contribute to the Interface X open source project! For more information about the Interface X ecosystem and our product roadmap, see [the project’s README](https://github.com/empathyco/x).

To make it easier for everyone, we’ve put together a set of **guidelines for contributing to the Interface X project** and its packages, which are hosted in the
[Empathy Organization](https://github.com/empathyco) on GitHub.

Don’t take these guidelines as hard and fast rules. Use your **best judgment**, and feel free to **propose changes in a pull request**. 

And above all, a heartfelt **thank you** for making the time to contribute. We’re delighted to have you alongside!

---

#### Table of Contents

- [Code of Conduct](#code-of-conduct)
- [What you need to know before getting started](#what-you-need-to-know-before-getting-started)
    + [Interface X and packages](#interface-x-and-packages)
- [How to contribute](#how-to-contribute)
    + [Report bugs](#report-bugs)
    + [Suggest enhancements](#suggest-new-features-or-enhancements)
    + [Contribute code for the first time](#contribute-code-for-the-first-time)
    + [Set up your development environment](#set-up-your-development-environment)
    + [Pull requests](#pull-requests)

- [Style guides](#style-guides)
    + [Git commit messages](#git-commit-messages)
    + [JavaScript style guide](#javascript-style-guide)
    + [Documentation style guide](#documentation-style-guide)
    + [Testing style guide](#testing-style-guide)
- [Any questions?](#any-questions)


## Code of Conduct

This project and everyone who participates in it is governed by the [Interface X Code of Conduct](CODE_OF_CONDUCT.md). 
By participating, you are expected to adhere to this code. Please report any unacceptable behavior to [x@empathy.co](mailto:x@empathy.co).


## What you need to know before getting started

### Interface X and Packages

Interface X is composed of different packages. New packages will be added here as the project evolves.

- **[@empathyco/x-components](https://github.com/empathyco/x/tree/main/packages/x-components)** - This is the core package of the project.
These standalone and configurable building blocks allow you to quickly construct the search UI for your shop.
- **[@empathyco/x-archetype](https://github.com/empathyco/x-archetype)** - This associated project is Empathy’s vision of the ideal mix of  X Components. A project showing the power of the X Components, ready to connect to any search API with customizable layout through design tokens. 
It is the perfect example to learn how to use the X Components. This package is a project outside this monorepo.
- **[@empathyco/x-deep-merge](/packages/deep-merge)** - This package clones an array of objects into another object.
- **[@empathyco/eslint-plugin-x](/packages/eslint-plugin-x)** - Customized version for the Interface X project of the [ESLint plugin](https://eslint.org/docs/about/), an open source JavaScript linting utility. It also includes a style formatter and best practices beyond the ESLint plugin, such as
  [prettier](https://prettier.io/) and [standard-version](https://github.com/conventional-changelog/standard-version).
- **[@empathyco/x-get-safe-property-chain](/packages/get-safe-property-chain)** - A utility designed to safely retrieve nested values.
- **[@empathyco/x-jest-utils](/packages/jest-utils)** - Jest extensions for easier testing.
- **[@empathyco/x-logger](/packages/logger)** - A custom implementation of a logger.
- **[@empathyco/x-adapter](/packages/search-adapter)** - A search client for Empathy's Search API.
- **[@empathyco/x-types](/packages/search-types)** - TypeScript types & guards for X models.
- **[@empathyco/x-storage-service](/packages/storage-service)** - Storage service with TTL.
- **[@empathyco/x-react-wrapper](/packages/react-wrapper)** - A proxy that transforms Vue components into React components.
- **[@empathyco/x-translations](/packages/x-translations)** - A project that allows you to import and export the translations.


## How to contribute

### Report Bugs

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). 

You can create an issue by filling in the [ bug template](./ISSUE_TEMPLATE/bug_report.yml). Before creating a new bug issue, do a quick check to make sure the issue hasn’t been discussed or created before in the project. 

> **Note:** If you find a **closed** issue that seems to describe the same situation as that you're experiencing, open a new issue and include a link to the original issue in the body.


### Suggest new features or enhancements

We’d love to hear your suggestions for enhancements for Interface X, whether they are completely new features or minor improvements to existing functionality.

To suggest any new feature, file a new issue using the [feature request template](./ISSUE_TEMPLATE/feature_request.yml).


### Contribute code for the first time

Unsure where to start with Interface X? You can start by looking through these `beginner` and `help-wanted` issues:

- [Beginner issues](https://github.com/empathyco/x/labels/good%20first%20issue) - issues that should only require a few lines of code, and a test or two.
- [Help wanted issues](https://github.com/empathyco/x/labels/help-wanted) - issues that are usually a bit more involved than `beginner` issues.

Both issue lists are sorted by the total number of comments. While not perfect, the number of comments is a reasonable proxy for determining the impact that a given change will have.

### Set up your development environment

This monorepo is handled by [Lerna](https://github.com/lerna/lerna) using `npm`. To prepare your development environment, proceed as follows:

1. Fork the X repo and then clone it to your local environment: `git clone https://github.com/empathyco/x.git`.
2. Install the dependencies in the root folder: `npm install`. This links all the projects.
3. Run a build so that the linked projects work: `npm run build`.


### Pull requests

There are a number of steps must follow to have your contribution considered by the repo maintainers. All pull requests (PRs) must be approved by 2 reviewers to be merged into the project:

1. Keep your PRs small - don’t pack multiple changes into the same PR.
2. Perform a self-review before submitting your PR:
   - Create a draft PR and do a full review yourself — complete with comments, docs, and tasks.
     After finishing a piece of code, it's very tempting to just dump your changes in a PR and let other people find the mistakes (particularly if it is a larger change that took a few days). Don’t be lazy — be disciplined; your work is not over yet.
   - You can also use this “self-review” to point things out to your reviewers — “I’m not sure about this name? Can you think of a better one?”, “Should this really be nullable? What do you think?” — Often by writing such questions, you actually find you can answer them yourself and self-reflection becomes part of your everyday coding thought process. In other words, internalizing this self-review process makes you a better developer.
3. Follow all instructions given in [the PR template](./PULL_REQUEST_TEMPLATE.md).
4. Follow the [style guides](#style-guides).
5. After you submit your PR, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing.
6. Acknowledge and respond to each and every comment.


## Style guides

### Git commit messages

Please check the [commit section](./contributing/commits.md), based on the Conventional Commits specification.

### JavaScript style guide

All JavaScript code is linted using the [@empathyco/eslint-plugin-x](https://github.com/empathyco/x/tree/main/packages/eslint-plugin-x) package.

In addition, follow the [naming guide](./contributing/base-naming.md) in every package inside this project, and the [Vue components style guide](./contributing/components.md) for components.

### Testing style guide

Follow our [testing style guide](./contributing/tests.md).

### Documentation style guide

Use [JsDoc](https://github.com/jsdoc/jsdoc) tags. For more information, see [JsDoc documentation](https://jsdoc.app/).

## Any questions?

If you have a question or doubts about the project, you can contact us at  [x@empathy.co](mailto:x@empathy.com).

## License

By contributing your code, you agree to license your contribution under the terms of the APLv2: https://www.apache.org/licenses/LICENSE-2.0

All files are released with the Apache 2.0 license.
