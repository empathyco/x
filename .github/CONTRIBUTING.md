# Contributing to the Interface X project

We are really excited that you want to contribute to the Interface X open source project!  Learn more about [why we decided to go open source with X Components](https://medium.com/empathyco/), the web frontend solution of Empathy search experience.

For more information about the Interface X ecosystem and our product roadmap, see [the project’s README](../readme.md).

To make it easier for everyone, we’ve put together a set of guidelines for contributing to the Interface X project and its packages, which are hosted in the
[Empathy Organization](https://github.com/empathyco) on GitHub. 
Don’t take these guidelines as hard and fast rules. Use your best judgment, and feel free to propose changes  in a pull request. And above all, a heartfelt **thank you** for making the time to contribute. We’re delighted to have you alongside!


#### Table of Contents

- [Mission](#mission)
- [Code of Conduct](#code-of-conduct)
- [Any questions?](#any-questions)
- [What you need to know before getting started](#what-you-need-to-know-before-getting-started)
    + [Interface X and packages](#interface-x-and-packages)
- [How to contribute](#how-to-contribute)
    + [Report bugs](#report-bugs)
    + [Suggest enhancements](#suggest-new-features-or-enhancements)
    + [Contribute code for the first time](#contribute-code-for-first-time)
    + [Set up your development environment](#set-up-your-development-environment)
    + [Pull requests](#pull-requests)

- [Style guides](#styleguides)
    + [Git commit messages](#git-commit-messages)
    + [JavaScript style guide](#javascript-styleguide)
    + [Documentation style guide](#documentation-styleguide)
    + [Testing style guide](#testing-styleguide)


## Mission

We want to create attractive products for the users (both users: the website user and the developer user).

We want to create products that are usable, fast, easy to use...

> X = usable + fun + easy + adaptable + beautiful + fast + efficient + effective + ...

But all that are emotions, Positive Emotions: X = Pe

But the emotions are subjective, cultural, not perceived in the same way by all the people. We have to understand the nature of those
emotions, and what observer's perceptions cause those feelings.

Once we have understood that, we have to figure out what we can do to match those emotions, which of those perceptions we can provoke.

So we have to Negotiate those Perceptions: **X = Pe · Np**

## Code of Conduct

This project and everyone who participates in it is governed by the [Interface X Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are
expected to adhere to this code. Please report any unacceptable behavior to [x@empathy.co](mailto:x@empathy.co).


## Any questions?

If you have a question or doubts about the project, you can contact us at  [x@empathy.co](mailto:x@empathy.com).

## What you need to know before getting started

### Interface X and Packages

Interface X is composed of different packages. New packages will be added here as we move to a monorepo.

- **[@empathyco/x-components](https://github.com/empathyco/x/tree/main/packages/x-components)** - This is the core package of the project.
These standalone and configurable building blocks allow you to quickly construct the search UI for your shop.
- **[@empathyco/x-archetype](https://github.com/empathyco/x-archetype)** - This project is Empathy’s vision of the ideal mix of 
  X Components. A project showing the power of the X Components, ready to connect to any search API with customizable layout through design tokens.
  It is the perfect example to learn how to use the X Components. This package is a project outside this monorepo.
- **[@empathyco/x-deep-merge](/packages/deep-merge)** - This package clones an array of objects into another object.
- **[@empathyco/eslint-plugin-x](/packages/eslint-plugin-x)** - The package name is just to follow the
  guidelines of ESLint to develop a custom plugin, but it also includes style formatter and good practices outside ESLint, as
  [prettier](https://prettier.io/) and [standard-version](https://github.com/conventional-changelog/standard-version)
- **[@empathyco/x-get-safe-property-chain](/packages/get-safe-property-chain)** - A utility designed to safely retrieve nested values.
- **[@empathyco/x-jest-utils](/packages/jest-utils)** - Jest extensions for easier testing.
- **[@empathyco/x-logger](/packages/logger)** - A custom implementation of a logger.
- **[@empathyco/x-adapter](/packages/search-adapter)** - A search client for Empathy's Search API.
- **[@empathyco/x-types](/packages/search-types)** - TypeScript types & guards for X models.
- **[@empathyco/x-storage-service](/packages/storage-service)** - Storage service with TTL.
- **[@empathyco/x-react-wrapper](/packages/react-wrapper)** - A proxy that transforms Vue components into React components.
- **[@empathyco/x-translations](/packages/x-translations)** - A project that allows you to import and export the translations.


## How Can I Contribute?

### Reporting Bugs

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). Create an issue on that repository and provide the following information by filling in [the bug template](./ISSUE_TEMPLATE/bug_report.md).

Check the already created issues in the repository to not file a repeated bug.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

### Suggesting new features or enhancements

This section guides you through submitting an enhancement suggestion for Interface X, including completely new features and minor improvements to existing functionality.

To suggest any new feature file a new issue using the [feature request template](./ISSUE_TEMPLATE/feature_request.md)

### Your First Code Contribution

Unsure where to begin contributing to Interface X? You can start by looking through these `beginner` and `help-wanted` issues:

- [Beginner issues][beginner] - issues which should only require a few lines of code, and a test or two.
- [Help wanted issues][help-wanted] - issues which should be a bit more involved than `beginner` issues.

Both issue lists are sorted by total number of comments. While not perfect, number of comments is a reasonable proxy for impact a given change will have.

#### Development setup

This mono-repo is handled by [Lerna](https://github.com/lerna/lerna) using `npm`. Follow the next steps to prepare your
development environment.

1. Clone repository: `git clone https://github.com/empathyco/x.git`.
2. From the root folder, install the dependencies: `npm install`. This will link all the project between themselves.
3. Run a build so linked projects work: `npm run build`.

### Pull Requests

Please follow these steps to have your contribution considered by the maintainers:

1. Keep em small
2. Perform a Self-Review
   - Create a draft PR and do a full review yourself — complete with comments and tasks.
     After finishing a piece of code, it's very tempting to just dump your changes in a PR and let other people find the mistakes,
     particularly if it is a larger change that took a few days. Don’t be lazy — be disciplined, your work is not over yet.
   - You can also use this “self-review” to point things out to your reviewers — “I’m not sure about this name? Can you think of a better one?”,
     “Should this really be nullable?? What do you think?” — often while writing such questions, you find that actually, you can answer them yourself
     and the self-reflection becomes built into your everyday coding thought process. In other words, this process of self-review makes you a better developer.
3. Follow all instructions in [the template](./PULL_REQUEST_TEMPLATE.md)
4. Follow the [styleguides](#styleguides)
5. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing
6. Acknowledge each and every comment
7. You will need 2 approves from the maintainers to merge

## Styleguides

### Git Commit Messages

Please check the [commit's section](./contributing/commits.md) based on conventional commits.

### JavaScript Styleguide

All JavaScript code is linted using the [@empathyco/eslint-plugin-x](https://github.com/empathyco/x/tree/main/packages/eslint-plugin-x) package.

Besides that please follow the [naming guide](./contributing/base-naming.md) in every package inside this project.

And there is a [Vue components style guide](./contributing/components.md) available too.

### Testing Styleguide

Follow our [testing styleguide](./contributing/tests.md)

### Documentation Styleguide

- Use [JsDoc](https://github.com/jsdoc/jsdoc) tags.
