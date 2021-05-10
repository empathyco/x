# Contributing to Interface X

Let us begin saying that we are really excited that you are open to contribute!

The following is a set of guidelines for contributing to Interface X and its packages, which are hosted in the 
[Empathy Organization](https://github.com/empathyco) on GitHub. These are mostly guidelines, not rules. 
Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents

[Mission](#mission)

[Code of Conduct](#code-of-conduct)

[I have a question](#i-have-a-question)

[What should I know before I get started?](#what-should-i-know-before-i-get-started)
  * [Interface X and packages](#interface-x-and-packages)

[How Can I Contribute?](#how-can-i-contribute)
  * [Reporting Bugs](#reporting-bugs)
  * [Suggesting Enhancements](#suggesting-new-features-or-enhancements)
  * [Your First Code Contribution](#your-first-code-contribution)
  * [Development Setup](#development-setup)
  * [Pull Requests](#pull-requests)

[Styleguides](#styleguides)
  * [Git Commit Messages](#git-commit-messages)
  * [JavaScript Styleguide](#javascript-styleguide)
  * [Documentation Styleguide](#documentation-styleguide)
  * [Testing Styleguide](#testing-styleguide)

  
## Mission

We want to create attractive products for the users (both users: the website user and the developer user). 

We want to create products that are usable, fast, easy to use...

> X = usable + fun + easy + adaptable + beautiful + fast + efficient + effective + ...

But all that are emotions, Positive Emotions: X = Pe 

But the emotions are subjective, cultural, not perceived in the same way by all the people. We have to understand the nature of those 
emotions, and what observer's perceptions cause those feelings. 

Once we have understood that, we have to figure out what we can do to match those emotions, which of those perceptions we can provoke.

So we have to Negotiate those Perceptions: __X = Pe · Np__

## Code of Conduct

This project and everyone participating in it is governed by the [Interface X Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are 
expected to uphold this code. Please report unacceptable behavior to [x@empathy.co](mailto:x@empathy.co).

## I have a question!!!

If you have a question you can file it through the email account [x@empathy.co](mailto:x@empathy.com)


## What should I know before I get started?

### Interface X and Packages

Interface X is composed of some different packages. New packages will be added here because we are moving to this mono-repo.

* [@empathyco/x-components](https://github.com/empathyco/x/tree/main/packages/components) - This is the core package of this project. 
These are standalone and configurable building blocks that allow you to quickly construct the search UI for your shop. 
You can create a smooth, personalised search and discovery experience, while significantly minimising development time. 
* [@empathyco/x-archetype](https://github.com/empathyco/x/tree/main/packages/archetype) - This is package is the Empathy vision of the 
perfect components mixing. A project ready to connect to any Search API with customizable layout through Design Tokens. 
* [@empathyco/eslint-plugin-x](https://github.com/empathyco/x/tree/main/packages/eslint-plugin-x) - The package name is just to follow the 
guidelines of ESLint to develop a custom plugin, but it includes also style formatter and good practices outside ESLint, as 
[prettier](https://prettier.io/) and [standard-version](https://github.com/conventional-changelog/standard-version) 

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

* [Beginner issues][beginner] - issues which should only require a few lines of code, and a test or two.
* [Help wanted issues][help-wanted] - issues which should be a bit more involved than `beginner` issues.

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
3. Follow all instructions in [the template](./PULL_REQUEST_TEMPLATE/PULL_REQUEST_TEMPLATE.md)
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

* Use [JsDoc](https://github.com/jsdoc/jsdoc) tags.
