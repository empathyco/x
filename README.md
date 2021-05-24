# Interface X
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Check branch is releasable](https://github.com/empathyco/x/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/empathyco/x/actions/workflows/build.yml)
[![Created by](https://img.shields.io/badge/Created%20by-Empathy.co-green)](https://www.empathy.co)

Search inevitably is key when people look for specific products in an online shop. Search is the door to the entire product catalogue, so having an outstanding, well-structured, and optimised UI is a must.

Interface X is the solution. This renewed search experience interface layer, available for web and mobile, renders the magic of search and delights your shoppers with all experiences in one: user, search, navigation, and product discovery.

Transform your search UI, simplify product discovery, and configure the shopper experience with cutting-edge technology based on Vue.js and out-of-the-box components.


## Ecosystem

Interface X is formed by [some packages](./.github/CONTRIBUTING.md#interface-x-and-packages) that are being moved to this mono-repo during the 2021 Spring-Summer. 
We encourage you to watch this project as it will be updated every week. 

As you can see there are a few packages but most of them are minor dependencies, we recommend to focus on two of them:

* [@empathyco/x-components](https://github.com/empathyco/x/tree/main/packages/components) - This is the core package of this project. 
These are standalone and configurable building blocks that allow you to quickly construct the search UI for your shop. 
You can create a smooth, personalised search and discovery experience, while significantly minimising development time. (To be moved here soon) 
* [@empathyco/x-archetype](https://github.com/empathyco/x/tree/main/packages/archetype) - This package is the Empathy vision of the 
perfect X-Components mixing. A project showing the power of the components ready to connect to any Search API with customizable layout through Design Tokens. 
This is a perfect example to know how to use the X-Components. (To be moved here soon) 

## Roadmap

2021 will be the year to consolidate Interface X, the roadmap includes these highlighted milestones:

* Build the Archetype configurations and No-Code design system.
* URL Management to set X-Components state based on URL parameters
* Create a tagging system to track user interactions
* Search box power ups as animated suggestions or forbidden character set to prevent code injection
* Publish a extensive documentation covering functional and technical sides.
* To be an open source project! 

## Fast, flexible, and straightforward 

* **Easy-to-add interface layer**. Installation and setup of the interface is simple: just add a few lines of code.
* **Use it anywhere.** A search interface layer that is easy to integrate into any website, with X Components ready to use in your Vue.js and React projects.  
* **Interoperable**. Interface X can adapt and work independently with any search service!
* **Fully personalisable experience**. Choose the configuration components, layouts, styles, and behaviours to craft exclusive search and discovery experiences.
* **Expressive design**. Wrap the experience up in a neat, intuitive, and interactive UI design that fully matches your brand identity and your website’s look and feel.
* **Scalable solution**. Extend the experience whenever you want with additional features and components.
* **Intuitive search**. Interface X learns from shopper behaviour and queries to understand shopper intent.


## Contributing

We are building the Interface X ecosystem, if you are interested in helping us out through the process and be part of the future of Search Experiences please check our [contributing guidelines](./.github/CONTRIBUTING.md)


## See how to build a search experience

If you want to see an example about how to build a search experience with X-Components, check [Ivan Tajes's video](https://www.youtube.com/watch?v=JjjIaQlG9aE)


## Core Team

|    <a href="https://github.com/tajespasarela"><img src="https://avatars.githubusercontent.com/u/5759712?v=4" width="100px;" alt=""/><br /><br /><b>Iván Tajes</b></a>    	| <a href="https://github.com/javieri-empathy"><img src="https://avatars.githubusercontent.com/u/68222542?v=4" width="100px;" alt=""/><br /><br /><b>Javier Iglesias</b></a> 	| <a href="https://github.com/joseacabaneros"><img src="https://avatars.githubusercontent.com/u/10746604?v=4" width="100px;" alt=""/><br /><br /><b>Jose Antonio Cabañeros</b></a> 	|  <a href="https://github.com/LuisMartinez15"><img src="https://avatars.githubusercontent.com/u/6247440?v=4" width="100px;" alt=""/><br /><br /><b>Luís Martínez</b></a> 	| <a href="https://github.com/tiborux"><img src="https://avatars.githubusercontent.com/u/6597815?v=4" width="100px;" alt=""/><br /><br /><b>Beltrán García</b></a> 	| <a href="https://github.com/herrardo"><img src="https://avatars.githubusercontent.com/u/4663897?v=4" width="100px;" alt=""/><br /><br /><b>Gerardo Vázquez</b></a> 	|
|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------:	|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------:	|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:	|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------:	|:----------------------------------------------------------------------------------------------------------------------------------------------------------------:	|:------------------------------------------------------------------------------------------------------------------------------------------------------------------:	|
| <a href="https://github.com/CachedaCodes"><img src="https://avatars.githubusercontent.com/u/7124620?v=4" width="100px;" alt=""/><br /><br /><b>Guillermo Cacheda</b></a> 	|    <a href="https://github.com/davidmfempathy"><img src="https://avatars.githubusercontent.com/u/72139200?v=4" width="100px;" alt=""/><br /><br /><b>David Manso</b></a>   	|             <a href="https://github.com/pmareke"><img src="https://avatars.githubusercontent.com/u/3502075?v=4" width="100px;" alt=""/><br /><br /><b>Pedro López</b>            	| <a href="https://github.com/guillei10"><img src="https://avatars.githubusercontent.com/u/77337158?v=4" width="100px;" alt=""/><br /><br /><b>Guillermo Iglesias</b></a> 	| <a href="https://github.com/mavmaf"><img src="https://avatars.githubusercontent.com/u/77147901?v=4" width="100px;" alt=""/><br /><br /><b>Mavi Fernández</b></a> 	|                                                                                                                                                                    	|

## Development configuration

This mono-repo is handled by [Lerna](https://github.com/lerna/lerna) using `npm`. Follow the next steps to prepare your
development environment.

1. Clone repository: `git clone https://github.com/empathyco/x.git`.
2. From the root folder, install the dependencies: `npm install`. This will link all the project between themselves.
3. Run a build so linked projects work: `npm run build`.

## License

[Apache 2.0](./LICENSE)

