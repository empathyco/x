# Commerce Search & Discovery: Interface X

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Check branch is releasable](https://github.com/empathyco/x/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/empathyco/x/actions/workflows/build.yml)
[![GitHub contributors](https://img.shields.io/github/contributors/empathyco/x.svg)](https://github.com/empathyco/x/graphs/contributors/)
[![Created by](https://img.shields.io/badge/Created%20by-Empathy.co-green)](https://www.empathy.co)

Whether you use Empathy Search API endpoints, Elasticsearch, Solr or other search APIs, bring your
commerce search and discovery experience to life with Interface X, an irresistible, expressive, and
joyful search UI. Interface X is used within some of the most beautiful commerce search experiences
out there, e.g. [Primor.eu](https://www.primor.eu/es_es/?query=brocha),
[Carrefour.es](https://www.carrefour.es/?q=queso),
[Tous.es](https://www.tous.com/es-es/?query=anillo),
[Casadellibro.es](https://www.casadellibro.com/?query=novela) and
[MotiveMarket.com](https://www.motivemarket.com/amagijon?query=queso).

Interface X is a library of standalone, configurable building blocks (available as Vue.js based
X&nbsp;Components) that allow you to quickly construct the search UI for your shop. You can create a
smooth, personalized search and discovery experience, while significantly minimizing development
time.

Each component represents a graphical part of the UI, with its own unique view and behavior. They’ve
been smartly designed to work together yet independently, so a single component adds real value to
your UI by itself. The more components you add and combine, the more functionality you get. You can
craft your own UI bundle with the right components for your shop. There are numerous components to
choose from, and the catalog evolves quickly with new experiences.

See an
[overview of the Empathy Platform features](https://docs.empathy.co/explore-empathy-platform/features/)
supported by Interface X.

## Highlights

- **Easy-to-add interface layer**. Installing and setting up the interface is simple: just add a few
  lines of code.
- **Use it anywhere.** A search interface layer that is easy to integrate into any website, with X
  Components ready to use in your Vue.js and React projects.
- **Interoperable**. Interface X can adapt and work independently with any search service endpoints!
- **Fully customizable experience**. Choose the configuration components, layouts, styles, and
  behaviors to craft exclusive search and discovery experiences.
- **Expressive design**. Wrap the experience up in a neat, intuitive, and interactive UI design that
  fully matches your brand identity and your website’s look and feel.
- **Scalable solution**. Extend the experience whenever you want with additional features and
  components.
- **Intuitive search**. Interface X learns from shopper behavior and queries to understand shopper
  intent.

## About the Interface X ecosystem

Interface X is formed by [multiple packages](./.github/CONTRIBUTING.md#interface-x-and-packages).
Watch this space as the project will be updated regularly.

While most of the packages are minor dependencies, there is a key package to bear in mind:

- **[@empathyco/x-components](https://github.com/empathyco/x/tree/main/packages/x-components)** -
  This is the core package of the project. These standalone and configurable building blocks allow
  you to quickly build the search UI for your shop. Create a smooth, personalized search and
  discovery experience, while significantly minimizing development time.

On top of the packages of this monorepo, there is another project using all the X-Components to
build a search experience:

- **[@empathyco/x-archetype](https://github.com/empathyco/x-archetype)** - This project is Empathy’s
  vision of the ideal mix of X&nbsp;Components. A project showing the power of the
  X&nbsp;Components, ready to connect to any search API with customizable layout through design
  tokens. It is the perfect example to learn how to use the X&nbsp;Components to get you started.
  This package is now a project outside this monorepo.

## Product documentation

Each component contains inline comments. Alternatively, you can read the product documentation on
Empathy’s eDocs documentation portal.

- [Overview of X Components](https://docs.empathy.co/explore-empathy-platform/experience-search-and-discovery/)
- [Interface X architecture](https://docs.empathy.co/develop-empathy-platform/build-search-ui/web-x-architecture/)
- [Full UI Reference](https://docs.empathy.co/develop-empathy-platform/ui-reference/)
<!--- [Frequently Asked Questions](Content to be developed for GitHub project)--->

## Roadmap

We are working on many key features to consolidate Interface X, including these milestones:

- Publish **extensive documentation** covering functional and technical aspects.
  [![Release Docs](https://img.shields.io/badge/Released-August%202021-brightgreen)](https://docs.empathy.co)
- Support
  **[URL management](https://docs.empathy.co/develop-empathy-platform/ui-reference/components/url/)**
  to set X&nbsp;Components state based on URL parameters.
  [![Release Docs](https://img.shields.io/badge/Released-November%202021-brightgreen)](https://docs.empathy.co/develop-empathy-platform/ui-reference/components/url/)
- Create a
  **[tagging module](https://docs.empathy.co/develop-empathy-platform/ui-reference/components/tagging/)**
  to track session interactions without storing PII.
  [![Release Docs](https://img.shields.io/badge/Released-December%202021-brightgreen)](https://docs.empathy.co/develop-empathy-platform/ui-reference/components/tagging/)
- Create the **[x-adapter](https://github.com/empathyco/x/tree/main/packages/x-adapter)** to connect
  to any Search API based on schemas
  [![Release Docs](https://img.shields.io/badge/Released-April%202022-brightgreen)](https://docs.empathy.co)
- **[My History](https://docs.empathy.co/explore-empathy-platform/experience-search-and-discovery/my-history.html)**
  feature, Control your search history and have access to previous intentions.
  [![Release Docs](https://img.shields.io/badge/Released-July%202022-brightgreen)](https://empathy.co/blog/development-journey-my-history/)
- Use
  **[accessibility eslint plugin](https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility)**
  to improve components a11y.
  [![Release Docs](https://img.shields.io/badge/Released-July%202022-brightgreen)](https://docs.empathy.co)
- **[Next Queries Preview](https://docs.empathy.co/develop-empathy-platform/ui-reference/components/next-queries/x-components.next-query-preview.html)**:
  A set of results that matches searches that other shoppers performed after the current to be show
  within the SERP. This helps the shopper to discover interesting products after the search action.
  This represents Empathy sciences for **Inspiration** and **Cross-Selling**.
  [![Release Docs](https://img.shields.io/badge/Released-August%202022-brightgreen)](https://docs.empathy.co)
- **[Query Results Preview](https://docs.empathy.co/develop-empathy-platform/ui-reference/components/queries-preview/x-components.query-preview.html)**:
  Provides a list of results matching a query to be inserted before the shopper starts typing as
  inspiration, in the predictive layer for results matching the current query, or as inspiration in
  a no results scenario. If you are facing an Archetype type integration,
  [this is how you set the query preview source of data](https://docs.empathy.co/develop-empathy-platform/build-search-ui/web-archetype-integration-guide.html#dynamic-query-results-preview).
  [![Release Docs](https://img.shields.io/badge/Released-September%202022-brightgreen)](https://docs.empathy.co/develop-empathy-platform/ui-reference/components/queries-preview/x-components.query-preview.html)
- **Search box power-ups** such as
  [animated suggestions](https://docs.empathy.co/develop-empathy-platform/ui-reference/components/search-box/x-components.search-input-placeholder.html)
  or [forbidden character](https://github.com/empathyco/x/pull/433) set to prevent code injection.
  [![Release Docs](https://img.shields.io/badge/Released-January%202023-brightgreen)](https://docs.empathy.co/develop-empathy-platform/ui-reference/components/search-box/x-components.search-input-placeholder.html)
- Create the **x-bus**, a library that provides an event bus to help with event orchestration.
  [![Release Docs](https://img.shields.io/badge/Released-February%202023-brightgreen)](https://github.com/empathyco/x/tree/main/packages/x-bus)
- **XDS: Interface X Design System Builder** is a Tailwind plugin thought to generate a new design
  system for every customer, for every search experience look&feel. XDS brings the concept of
  components to UI as X Components do with functional behavior.
  [![Release Docs](https://img.shields.io/badge/Released-April%202023-brightgreen)](https://github.com/empathyco/x/tree/main/packages/x-tailwindcss)
- **[Vectorized Recommendations](https://docs.empathy.co/explore-empathy-platform/features/vector-recommendations-overview.html)**:
  These recommendations are relevant product suggestions based on query semantic affinities. They
  usually show up as product carousels to amaze shoppers with product discovery inspirations.
- **Filtering Strategies**: Added filtering capabilities to History Queries and Brand
  Recommendations
  [![Release Docs](https://img.shields.io/badge/Released-October%202023-brightgreen)](https://docs.empathy.co/explore-empathy-platform/experience-search-and-discovery/history-queries.html)
- **Experience Controls**: Add capability of loading configurations from an external service
  [![Release Docs](https://img.shields.io/badge/Released-November%202023-brightgreen)](https://vuejs.org/)
- **Vue 3 Migration**.
  [![Release Docs](https://img.shields.io/badge/Released-November%202024-brightgreen)](https://vuejs.org/)
- **Network Request failure transparency**.
- **Project generator CLI**.
- **Observability**: Error capturing & monitoring.

## How to install

This project is a monorepo that is handled by [Lerna](https://github.com/lerna/lerna) &
[pnpm](https://pnpm.io/) & [Nx](https://nx.dev/). To prepare your development environment, proceed
as follows:

1. [Install pnpm (Recommended v9.15.9)](https://pnpm.io/installation)
2. Fork the X repository and then clone it to your local environment:
   `git clone https://github.com/empathyco/x.git`.
3. Install the dependencies in the root folder: `pnpm install --frozen-lockfile`. This links all the
   projects.

> Have a look to
> [this article](https://medium.com/empathyco/moving-to-a-mono-repo-part-1-the-journey-eb63efd8ef64)
> to see why we moved to a mono repo and how we did it. Take into account that the article talks
> about the previous version of this monorepo managed by Lerna & npm.

## How to implement Interface X

Once you have installed the project, follow the step-by-step guide -
[How to build your search UI](https://docs.empathy.co/develop-empathy-platform/build-search-ui/).

Watch Ivan Tajes’
[explanation on how to build a search experience using the X Components](https://www.youtube.com/watch?v=JjjIaQlG9aE).

## How to contribute

We are building the Interface X ecosystem. If you are interested in helping us out and being part of
the future of search experiences, please check our
[contributing guidelines](./.github/CONTRIBUTING.md).

## Contributors

<a href="https://github.com/empathyco/x/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=empathyco/x" alt="Contributors image list"/>
</a>

## License

[Apache 2.0](./LICENSE)
