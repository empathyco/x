# Commerce Search & Discovery: Interface X

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Check branch is releasable](https://github.com/empathyco/x/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/empathyco/x/actions/workflows/build.yml)
[![GitHub contributors](https://img.shields.io/github/contributors/empathyco/x.svg)](https://github.com/empathyco/x/graphs/contributors/)
[![Created by](https://img.shields.io/badge/Created%20by-Empathy.co-green)](https://www.empathy.co)

Whether you use Empathy Search API endpoints, Elasticsearch, Solr or other search APIs, bring your
commerce search and discovery experience to life with Interface X, an irresistible, expressive, and
joyful search UI. Interface X is used within some of the most beautiful commerce search experiences
out there, e.g. [Carrefour.es](https://www.carrefour.es),
[Pull&Bear.com](https://www.pullandbear.com), and [Kroger.com](https://www.kroger.com).

Interface X is a library of standalone, configurable building blocks (available as Vue.js based
X&nbsp;Components) that allow you to quickly construct the search UI for your shop. You can create a
smooth, personalized search and discovery experience, while significantly minimizing development
time.

![X Components](assets/x-components-demo.gif)

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

- Publish extensive documentation covering functional and technical aspects.
  [![Release Docs](https://img.shields.io/badge/Released-August%202021-brightgreen)](https://docs.empathy.co)
- Support
  [URL management](https://docs.empathy.co/develop-empathy-platform/ui-reference/components/url/) to
  set X&nbsp;Components state based on URL parameters.
  [![Release Docs](https://img.shields.io/badge/Released-November%202021-brightgreen)](https://docs.empathy.co/develop-empathy-platform/ui-reference/components/url/)
- Create a
  [tagging module](https://docs.empathy.co/develop-empathy-platform/ui-reference/components/tagging/)
  to track session interactions without storing PII.
  [![Release Docs](https://img.shields.io/badge/Released-December%202021-brightgreen)](https://docs.empathy.co/develop-empathy-platform/ui-reference/components/tagging/)
- Create the [x-adapter](https://github.com/empathyco/x/tree/main/packages/x-adapter) to connect to
  any Search API based on schemas
  [![Release Docs](https://img.shields.io/badge/Released-April%202022-brightgreen)](https://docs.empathy.co)
- [My History](https://docs.empathy.co/explore-empathy-platform/experience-search-and-discovery/my-history.html)
  feature, Control your search history and have access to previous intentions.
  [![Release Docs](https://img.shields.io/badge/Released-July%202022-brightgreen)](https://empathy.co/blog/development-journey-my-history/)
- Use [accessibility eslint plugin](https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility)
  to improve components a11y.
  [![Release Docs](https://img.shields.io/badge/Released-July%202022-brightgreen)](https://docs.empathy.co)
- Next Queries Preview: A set of results that matches searches that other shoppers performed after
  the current to be show within the SERP. This helps the shopper to discover interesting products
  after the search action. This represents Empathy sciences for **Inspiration** and
  **Cross-Selling**.
  [![Release Docs](https://img.shields.io/badge/Released-August%202022-brightgreen)](https://docs.empathy.co)
- Query Results Preview: Provides a list of results matching a query to be inserted before the
  shopper starts typing as inspiration, in the predictive layer for results matching the current
  query, or as inspiration in a no results scenario.
  [![Release Docs](https://img.shields.io/badge/Released-September%202022-brightgreen)](https://docs.empathy.co/develop-empathy-platform/build-search-ui/web-archetype-integration-guide.html#setting-up-the-queries-preview-dynamically)
- Design System Builder POC using Tailwind.
  [![Release Docs](https://img.shields.io/badge/In%20Progress-Q3%202022-yellow)](https://github.com/empathyco/x/tree/main/packages/x-tailwindcss)
- WCAG AA compliance.
- Result Preview component to rapidly discover more result attributed without leaving the SERP.
- Suggestions with filters that allows to select a query suggestion with a specific filter.
- Provide a No Network State for components depending on API requests.
- Incorporate search box power-ups such as animated suggestions or forbidden character set to
  prevent code injection.
- Project generator CLI.

## How to install

This project is a monorepo that is handled by [Lerna](https://github.com/lerna/lerna) using `npm`.
To prepare your development environment, proceed as follows:

1. Fork the X repository and then clone it to your local environment:
   `git clone https://github.com/empathyco/x.git`.
2. Install the dependencies in the root folder: `npm install`. This links all the projects.
3. Run a build so that the linked projects work: `npm run build`.

Have a look to
[this article](https://medium.com/empathyco/moving-to-a-mono-repo-part-1-the-journey-eb63efd8ef64)
to see why we moved to a mono repo and how we did it.

## How to implement Interface X

Once you have installed the project, follow the step-by-step guide -
[How to build your search UI](https://docs.empathy.co/develop-empathy-platform/build-search-ui/).

Watch Ivan Tajes’
[explanation on how to build a search experience using the X Components](https://www.youtube.com/watch?v=JjjIaQlG9aE).

## How to contribute

We are building the Interface X ecosystem. If you are interested in helping us out and being part of
the future of search experiences, please check our
[contributing guidelines](./.github/CONTRIBUTING.md).

## Core Team

| <a href="https://github.com/tajespasarela"><img src="https://avatars.githubusercontent.com/u/5759712?v=4" width="100px;" alt=""/><br /><br /><b>Iván Tajes</b></a>  | <a href="https://github.com/javieri-empathy"><img src="https://avatars.githubusercontent.com/u/68222542?v=4" width="100px;" alt=""/><br /><br /><b>Javier Iglesias</b></a> | <a href="https://github.com/joseacabaneros"><img src="https://avatars.githubusercontent.com/u/10746604?v=4" width="100px;" alt=""/><br /><br /><b>Jose Antonio Cabañeros</b></a> | <a href="https://github.com/LuisMartinez15"><img src="https://avatars.githubusercontent.com/u/6247440?v=4" width="100px;" alt=""/><br /><br /><b>Luís Martínez</b></a> |      <a href="https://github.com/tiborux"><img src="https://avatars.githubusercontent.com/u/6597815?v=4" width="100px;" alt=""/><br /><br /><b>Beltrán García</b></a>      |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <a href="https://github.com/herrardo"><img src="https://avatars.githubusercontent.com/u/4663897?v=4" width="100px;" alt=""/><br /><br /><b>Gerardo Vázquez</b></a>  |  <a href="https://github.com/CachedaCodes"><img src="https://avatars.githubusercontent.com/u/7124620?v=4" width="100px;" alt=""/><br /><br /><b>Guillermo Cacheda</b></a>  |         <a href="https://github.com/mavmaf"><img src="https://avatars.githubusercontent.com/u/77147901?v=4" width="100px;" alt=""/><br /><br /><b>Mavi Fernández</b></a>         |    <a href="https://github.com/diegopf"><img src="https://avatars.githubusercontent.com/u/7504736?v=4" width="100px;" alt=""/><br /><br /><b>Diego Pascual</b></a>     | <a href="https://github.com/mnavarroespinosa"><img src="https://avatars.githubusercontent.com/u/77450928?v=4" width="100px;" alt=""/><br /><br /><b>Manuel Navarro</b></a> |
| <a href="https://github.com/ajperezbau"><img src="https://avatars.githubusercontent.com/u/75546736?v=4" width="100px;" alt=""/><br /><br /><b>Abraham Pérez</b></a> |       <a href="https://github.com/annacv"><img src="https://avatars.githubusercontent.com/u/21217131?v=4" width="100px;" alt=""/><br /><br /><b>Anna Condal</b></a>        |         <a href="https://github.com/alvarodE"><img src="https://avatars.githubusercontent.com/u/72568818?v=4" width="100px;" alt=""/><br /><br /><b>Álvaro Díaz</b></a>          |

## Contributors

<a href="https://github.com/empathyco/x/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=empathyco/x" alt="Contributors image list"/>
</a>

## License

[Apache 2.0](./LICENSE)
