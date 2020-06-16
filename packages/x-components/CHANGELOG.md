# X Components
## [1.0.0-alpha.3](https://bitbucket.org/colbenson/x-components/branches/compare/v1.0.0-alpha.3%0Dv1.0.0-alpha.2) (2020-06-15)


### Features

* **currency-filter:** add currency filter and formatter ([9cf9f9e](https://bitbucket.org/colbenson/x-components/commits/9cf9f9e4a754e20698d616923e073afa7d41950d)), closes [EX-1913](https://searchbroker.atlassian.net/browse/EX-1913)
* **docs:** add static md file to be copied to docs folder on build proccess ([2aa9937](https://bitbucket.org/colbenson/x-components/commits/2aa99377d0811861f12f6a7a9c50985efbad4746)), closes [EX-1943](https://searchbroker.atlassian.net/browse/EX-1943)


### Bug Fixes

* **spatial-navigation:** filter out focusable elements if they can't be focused ([9b4829b](https://bitbucket.org/colbenson/x-components/commits/9b4829b43b0e7d8665400595e3714d9ab1bc4d93)), closes [EX-1924](https://searchbroker.atlassian.net/browse/EX-1924)


### Features

* **base-result-previous-price:** add base result previous price component ([a51df82](https://bitbucket.org/colbenson/x-components/commits/a51df8225c268513fe95e7e8ef505934f72d6c3d)), closes [EX-1913](https://searchbroker.atlassian.net/browse/EX-1913)
* **related-tags:** add e2e testing for the related tags ([98c80e3](https://bitbucket.org/colbenson/x-components/commits/98c80e305a5e39e6f47c7104a099a944cc70bc35)), closes [EX-1968](https://searchbroker.atlassian.net/browse/EX-1968)
* **spatial-navigation:** ability to move between any component and the keyboard-navigation component ([0d80db8](https://bitbucket.org/colbenson/x-components/commits/0d80db89f65d3eb1ef34979fe8ff98f4d83f389a)), closes [EX-1924](https://searchbroker.atlassian.net/browse/EX-1924)


### Testing

* **keyboard-navigation:** e2e testing for keyboard-navigation ([18821c5](https://bitbucket.org/colbenson/x-components/commits/18821c5a03b482060995f5adf3bca21e6864ed11)), closes [EX-1924](https://searchbroker.atlassian.net/browse/EX-1924)

## 1.0.0-alpha.1 (2020-06-10)


### Features

* **animations:** fade and slide animation component ([5ac5a0e](https://bitbucket.org/colbenson/x-components/commits/5ac5a0e94896550c6e9b8b6f0eacefd35e60b565)), closes [EX-1867](https://searchbroker.atlassian.net/browse/EX-1867)
* **base-modal-container:** add base-modal-container component ([cd5d22b](https://bitbucket.org/colbenson/x-components/commits/cd5d22b36d5d2c76eb98adf83cb3ac69de9edc44)), closes [EX-1765](https://searchbroker.atlassian.net/browse/EX-1765)
* **base-result-current-price:** create base result current price component ([6684fd3](https://bitbucket.org/colbenson/x-components/commits/6684fd3c53905345a842dd58546549cf55be9e0a)), closes [EX-1913](https://searchbroker.atlassian.net/browse/EX-1913)
* **base-result-image:** add the base result image with lazy loading also fallback and placeholder ([d19ead6](https://bitbucket.org/colbenson/x-components/commits/d19ead60777d8faebbc30c38ec0982e4134a8478))
* **base-result-link:** refactor BaseResultLink component to receive origin and events by injection ([8233b1b](https://bitbucket.org/colbenson/x-components/commits/8233b1b388a4e94d98f5d3c75253a31558a3ff5e)), closes [EX-1971](https://searchbroker.atlassian.net/browse/EX-1971)
* **base-suggestion:** allow string in matching part to retain accent marks ([94c4ddf](https://bitbucket.org/colbenson/x-components/commits/94c4ddf3d186527462794a2af39a96c93200c885)), closes [EX-1886](https://searchbroker.atlassian.net/browse/EX-1886)
* **bus:** make metadata parameter optional ([9d61ce4](https://bitbucket.org/colbenson/x-components/commits/9d61ce436d8e9abc52a780b84ff2d7e9985a753b)), closes [EX-1695](https://searchbroker.atlassian.net/browse/EX-1695)
* **clear-search-input:** add clear-search-input button ([0b5ec3b](https://bitbucket.org/colbenson/x-components/commits/0b5ec3b52ff4ed6d1f46398639d08a5b7e32f6ae)), closes [EX-1663](https://searchbroker.atlassian.net/browse/EX-1663)
* **close-button:** add close-button component ([b0a07dc](https://bitbucket.org/colbenson/x-components/commits/b0a07dc5c3f989b2ad5519efc32a8a13434a7076)), closes [EX-1765](https://searchbroker.atlassian.net/browse/EX-1765)
* **compile-message:** add compileMessage filter and register it globally ([8fe4710](https://bitbucket.org/colbenson/x-components/commits/8fe471063f92eed9d90667c1970eed28bd62598b)), closes [EX-1779](https://searchbroker.atlassian.net/browse/EX-1779)
* **conventional-commits:** add conventional-commits and commitizen npm packages ([e3bdcd4](https://bitbucket.org/colbenson/x-components/commits/e3bdcd413f990b5934fafd0190bb8ef5820f18ff)), closes [EX-1614](https://searchbroker.atlassian.net/browse/EX-1614)
* **cypress:** add @cypress/webpack-preprocessor to support TypeScript ([52aa5ad](https://bitbucket.org/colbenson/x-components/commits/52aa5adc3c7166ea063a136193b43591dd0ce516)), closes [EX-1790](https://searchbroker.atlassian.net/browse/EX-1790)
* **cypress:** add custom command for cypress ([c988994](https://bitbucket.org/colbenson/x-components/commits/c988994a7e773a1762c7e6134c7e9efcfd344e5a)), closes [EX-1792](https://searchbroker.atlassian.net/browse/EX-1792)
* **cypress:** disable video recording in Cypress e2e tests ([cf9beeb](https://bitbucket.org/colbenson/x-components/commits/cf9beebea12f25ef8ea49380de6705984f1c9c4f)), closes [EX-1866](https://searchbroker.atlassian.net/browse/EX-1866)
* **cypress:** inject XComponents to the global window object when Cypress is running ([4591cd2](https://bitbucket.org/colbenson/x-components/commits/4591cd20773838a777af1af0f83a64f49b2894d9)), closes [EX-1768](https://searchbroker.atlassian.net/browse/EX-1768)
* **docs:** docusaurus integration ([80af715](https://bitbucket.org/colbenson/x-components/commits/80af715744a01868f1b9df198b8545e3f9b397e3)), closes [EX-1869](https://searchbroker.atlassian.net/browse/EX-1869)
* **empathize:** create empty Empathize module ([74441d1](https://bitbucket.org/colbenson/x-components/commits/74441d1dec34e2298df6e6a2ddfa3e2e3cc6be19)), closes [EX-1804](https://searchbroker.atlassian.net/browse/EX-1804)
* **empathize:** keyboardNavigation component which deals with arrow keys pressed inside it ([3191215](https://bitbucket.org/colbenson/x-components/commits/31912159bbc860e3c622c4d9561e1afcff3bcff9)), closes [EX-1804](https://searchbroker.atlassian.net/browse/EX-1804)
* **eslint:** configure ESLint by subfolder and cypress rules ([734717e](https://bitbucket.org/colbenson/x-components/commits/734717e1058b10481ec237413fc3c5a44361b870)), closes [EX-1675](https://searchbroker.atlassian.net/browse/EX-1675)
* **event-button:** add metadata target property to emitted events ([812a678](https://bitbucket.org/colbenson/x-components/commits/812a678ca479006dd1d534ad2c9b4a0b6ce425c1)), closes [EX-1663](https://searchbroker.atlassian.net/browse/EX-1663)
* **event-metadata:** add metadata parameter ([d2128e8](https://bitbucket.org/colbenson/x-components/commits/d2128e8ab1aae7a3e75f387835f0dec7fb63a6b2)), closes [EX-1617](https://searchbroker.atlassian.net/browse/EX-1617)
* **eventbutton:** add EventButton reusable component ([3c29f32](https://bitbucket.org/colbenson/x-components/commits/3c29f32ae4aea62bc3d6a37b9a224f57af10c2df)), closes [EX-1680](https://searchbroker.atlassian.net/browse/EX-1680)
* **global-config:** add global configuration XConfig ([4f0bc33](https://bitbucket.org/colbenson/x-components/commits/4f0bc33ee698041979de4fc64afc55f3e245551b)), closes [EX-1604](https://searchbroker.atlassian.net/browse/EX-1604)
* **history-queries:** add actions ([e2192a1](https://bitbucket.org/colbenson/x-components/commits/e2192a1de8cc0f1c6743ec1bf585ffdca6dace24)), closes [EX-1764](https://searchbroker.atlassian.net/browse/EX-1764)
* **history-queries:** add ClearHistoryQueries Component ([6bf6da6](https://bitbucket.org/colbenson/x-components/commits/6bf6da64cd41e1570cf3d0ee7cbdb3a3e1bf2d58)), closes [EX-1763](https://searchbroker.atlassian.net/browse/EX-1763)
* **history-queries:** add delete-history-query component ([c442b1a](https://bitbucket.org/colbenson/x-components/commits/c442b1aff0e6a929ebe2dc159a5b320f683c4503)), closes [EX-1778](https://searchbroker.atlassian.net/browse/EX-1778)
* **history-queries:** add DeleteHistoryQuery component ([80e060e](https://bitbucket.org/colbenson/x-components/commits/80e060e851b1a9801e021cb6cb1ddd39e7b5578b)), closes [EX-1778](https://searchbroker.atlassian.net/browse/EX-1778)
* **history-queries:** add history queries emitters ([2d30d86](https://bitbucket.org/colbenson/x-components/commits/2d30d868f35264cacb6838862a4cc32afc00f945)), closes [EX-1738](https://searchbroker.atlassian.net/browse/EX-1738)
* **history-queries:** add history queries getters ([9a7fea4](https://bitbucket.org/colbenson/x-components/commits/9a7fea440f0f3b1c90222f28a35e5638c6a07b5e)), closes [EX-1735](https://searchbroker.atlassian.net/browse/EX-1735)
* **history-queries:** add history queries module wiring. ([3337b54](https://bitbucket.org/colbenson/x-components/commits/3337b548bcc5710aa7f77192690f8d1defa41367)), closes [EX-1738](https://searchbroker.atlassian.net/browse/EX-1738)
* **history-queries:** add history queries store for its x-module ([463aab1](https://bitbucket.org/colbenson/x-components/commits/463aab1209704aec64f3f164813621e68e194033)), closes [EX-1764](https://searchbroker.atlassian.net/browse/EX-1764)
* **history-queries:** add history queries x-module skeleton ([2217dc1](https://bitbucket.org/colbenson/x-components/commits/2217dc1ab5e5fb80ccca15ba1e1c247ca19a4c28)), closes [EX-1735](https://searchbroker.atlassian.net/browse/EX-1735)
* **history-queries:** add history-queries module to app & its e2e testing ([e3a61ec](https://bitbucket.org/colbenson/x-components/commits/e3a61ec0bf068db7ee540d03d8bc056c468b3a92)), closes [EX-1762](https://searchbroker.atlassian.net/browse/EX-1762)
* **history-queries:** add HistoryQueries component ([99bfc13](https://bitbucket.org/colbenson/x-components/commits/99bfc13047c56e6e11d6f308fff4f0c79c6c33a2)), closes [EX-1739](https://searchbroker.atlassian.net/browse/EX-1739)
* **history-queries:** add load history queries action ([66c8a97](https://bitbucket.org/colbenson/x-components/commits/66c8a97c9e8e34b0b108ecd898564a87207bd540)), closes [EX-1764](https://searchbroker.atlassian.net/browse/EX-1764)
* **history-queries:** add module events ([ea577b4](https://bitbucket.org/colbenson/x-components/commits/ea577b44548b57c02d32749bc498a1ed0216742d)), closes [EX-1736](https://searchbroker.atlassian.net/browse/EX-1736)
* **history-queries:** trim query before storing it ([c8ccee0](https://bitbucket.org/colbenson/x-components/commits/c8ccee0b8b05854832e688032c81fd5a08748caf)), closes [EX-1764](https://searchbroker.atlassian.net/browse/EX-1764)
* **immediate-store-emitters:** add immediate option for store emitters configuration ([dd35599](https://bitbucket.org/colbenson/x-components/commits/dd355993443131f06801cdbb1267d788c5bc3474)), closes [EX-1642](https://searchbroker.atlassian.net/browse/EX-1642)
* **keyboard-navigation:** add SpatialNavigation service to use in keyboard navigation component ([c42fa13](https://bitbucket.org/colbenson/x-components/commits/c42fa13dd51a9458063ed81d90a0b49d6d3a295c)), closes [EX-1924](https://searchbroker.atlassian.net/browse/EX-1924)
* **next-queries:** add config for the next queries module ([220b72e](https://bitbucket.org/colbenson/x-components/commits/220b72e424b25313f7fe1847b178d40edd7f549b)), closes [EX-1731](https://searchbroker.atlassian.net/browse/EX-1731)
* **next-queries:** add events types for the next queries module ([0336ac7](https://bitbucket.org/colbenson/x-components/commits/0336ac71dc6427a83b1b46ec60e46e869f53d119)), closes [EX-1730](https://searchbroker.atlassian.net/browse/EX-1730)
* **next-queries:** add Next Queries Component ([1ac7f3a](https://bitbucket.org/colbenson/x-components/commits/1ac7f3a3867bf700ec0595f227529fd98cec8ca8)), closes [EX-1734](https://searchbroker.atlassian.net/browse/EX-1734)
* **next-queries:** add next-queries x-module ([1f40a88](https://bitbucket.org/colbenson/x-components/commits/1f40a88fb39ac738109cb2c73eb762eb64c604fb)), closes [EX-1627](https://searchbroker.atlassian.net/browse/EX-1627)
* **next-queries:** add NextQueriesChanged emitter to next queries emitters ([efc68d0](https://bitbucket.org/colbenson/x-components/commits/efc68d07de1c88989296f9596a0514be87f0eabb)), closes [EX-1732](https://searchbroker.atlassian.net/browse/EX-1732)
* **next-queries:** add NextQueriesChanged emitter to next queries emitters ([8a0f0ce](https://bitbucket.org/colbenson/x-components/commits/8a0f0ce4700a49eccdb016e99ad2abe4902c4a75)), closes [EX-1732](https://searchbroker.atlassian.net/browse/EX-1732)
* **next-queries:** add the NextQuery component ([45ea468](https://bitbucket.org/colbenson/x-components/commits/45ea4680d9f6265e91e050dae2913002db989cff)), closes [EX-1733](https://searchbroker.atlassian.net/browse/EX-1733)
* **no-suggestions:** append no-suggestions component ([709a82b](https://bitbucket.org/colbenson/x-components/commits/709a82b5fa7225853e62cf16846ea784a549d26f)), closes [EX-1741](https://searchbroker.atlassian.net/browse/EX-1741)
* **no-suggestions:** append store, configuration, wiring and skeleton no-suggestions x-module ([677590e](https://bitbucket.org/colbenson/x-components/commits/677590ef2fd9892f06d195b4ad858dd10079dd62)), closes [EX-1741](https://searchbroker.atlassian.net/browse/EX-1741)
* **open-button:** add open-button component ([128b0f7](https://bitbucket.org/colbenson/x-components/commits/128b0f7c8a0d41ddebce9501b67d403707923ba2)), closes [EX-1765](https://searchbroker.atlassian.net/browse/EX-1765)
* **popular-searches:** add config to popular-searches x-module ([adcc31f](https://bitbucket.org/colbenson/x-components/commits/adcc31f38a5359bb3c962ad527907f6521793565)), closes [EX-1714](https://searchbroker.atlassian.net/browse/EX-1714)
* **popular-searches:** add popular-searches x-module ([3dd6eaa](https://bitbucket.org/colbenson/x-components/commits/3dd6eaa90a0476c3d6725ff80211127331f58c20)), closes [EX-1610](https://searchbroker.atlassian.net/browse/EX-1610)
* **popular-searches:** append popular searches x-modules events ([9d3b8f6](https://bitbucket.org/colbenson/x-components/commits/9d3b8f62b32025c98feeb0e0c4927da8afbdeb0a)), closes [EX-1713](https://searchbroker.atlassian.net/browse/EX-1713)
* **popular-searches:** append PopularSearch component ([f66da46](https://bitbucket.org/colbenson/x-components/commits/f66da46b03c6c5f68da02b0bb271647bb41942c9)), closes [EX-1717](https://searchbroker.atlassian.net/browse/EX-1717)
* **prettier:** add prettier-organize-imports plugin ([b78370e](https://bitbucket.org/colbenson/x-components/commits/b78370e97bab944621023845fa1293ee79a1e876)), closes [EX-1787](https://searchbroker.atlassian.net/browse/EX-1787)
* **pure-suggestion:** add base suggestion to reuse in every suggestion type ([a20be15](https://bitbucket.org/colbenson/x-components/commits/a20be1516b5660189ffdd0ce220263739c60075b)), closes [EX-1748](https://searchbroker.atlassian.net/browse/EX-1748)
* **query-suggestions:** add query suggestions events ([a2be5e3](https://bitbucket.org/colbenson/x-components/commits/a2be5e3a12781417fe0bca9c9140f5127fbd598d)), closes [EX-1707](https://searchbroker.atlassian.net/browse/EX-1707)
* **query-suggestions:** add query-suggestion component ([b7c2133](https://bitbucket.org/colbenson/x-components/commits/b7c2133df7ef4fcd9ed6c5a34f56381be2f54ad7)), closes [EX-1711](https://searchbroker.atlassian.net/browse/EX-1711)
* **query-suggestions:** add query-suggestions component ([b5e980e](https://bitbucket.org/colbenson/x-components/commits/b5e980e1eb74c676165175d8c79591257c62d91d)), closes [EX-1710](https://searchbroker.atlassian.net/browse/EX-1710)
* **query-suggestions-actions:** refactor actions to an independent files and add test ([9cfda2a](https://bitbucket.org/colbenson/x-components/commits/9cfda2ab8b4b97680d9b5c3dd3c775a429136cf6)), closes [EX-1774](https://searchbroker.atlassian.net/browse/EX-1774)
* **query-suggestions-getters:** refactor getters in separated files and testing ([7b5fe02](https://bitbucket.org/colbenson/x-components/commits/7b5fe028b28fc61c31843266954376462b380b17)), closes [EX-1774](https://searchbroker.atlassian.net/browse/EX-1774)
* **query-suggestions-wiring:** add query suggestions wiring ([500da00](https://bitbucket.org/colbenson/x-components/commits/500da00f13a536d8c73d69c70d9d00019f3b28e7)), closes [EX-1709](https://searchbroker.atlassian.net/browse/EX-1709)
* **recommendations:** create recommendations x-module ([c14a265](https://bitbucket.org/colbenson/x-components/commits/c14a265cd6e939a0598e9ad5fa17d52028156f67)), closes [EX-1917](https://searchbroker.atlassian.net/browse/EX-1917)
* **recommendations:** recommendations actions, getters & mutations ([29b959d](https://bitbucket.org/colbenson/x-components/commits/29b959d8f50c1a3529a0af3700d2fa367771a990)), closes [EX-1918](https://searchbroker.atlassian.net/browse/EX-1918)
* **recommendations:** recommendations component and its test ([9af2d37](https://bitbucket.org/colbenson/x-components/commits/9af2d37f76474c2ebb58bf533051ea3e6149ae28)), closes [EX-1919](https://searchbroker.atlassian.net/browse/EX-1919)
* **recommendations:** recommendations wiring, emitters and events ([77452d9](https://bitbucket.org/colbenson/x-components/commits/77452d91a6a4ceb597590d3ae9c473220284e11b)), closes [EX-1919](https://searchbroker.atlassian.net/browse/EX-1919)
* **related-tags:** add empty related tags module ([e476b22](https://bitbucket.org/colbenson/x-components/commits/e476b224cf87684a40692b8eea349c9124557f80)), closes [EX-1749](https://searchbroker.atlassian.net/browse/EX-1749)
* **related-tags:** add mutations and getters for the related tags module. Add testing for getters ([359d16f](https://bitbucket.org/colbenson/x-components/commits/359d16f201b83bc62f0e404736c7ef96228ee2af)), closes [EX-1749](https://searchbroker.atlassian.net/browse/EX-1749)
* **related-tags:** add related tags actions and testing ([6bedca9](https://bitbucket.org/colbenson/x-components/commits/6bedca920a8a69384014eef4b1d7c6961a7f0122)), closes [EX-1750](https://searchbroker.atlassian.net/browse/EX-1750)
* **related-tags:** add related tags state ([ac4c9c9](https://bitbucket.org/colbenson/x-components/commits/ac4c9c91ecd49a61786b0482cffe4efef6e55ab5)), closes [EX-1749](https://searchbroker.atlassian.net/browse/EX-1749)
* **related-tags:** add wiring and emitters for the related tags ([d7e4af2](https://bitbucket.org/colbenson/x-components/commits/d7e4af27fa540a3994050a80495d16dd63524efd)), closes [EX-1750](https://searchbroker.atlassian.net/browse/EX-1750)
* **related-tags:** add related-tags component ([cb5cf8b](https://bitbucket.org/colbenson/x-components/commits/cb5cf8b390707f19683197f52b4a5c9d75c0d7dc)), closes [EX-1753](https://searchbroker.atlassian.net/browse/EX-1753)
* **related-tags:** add the selected related tags to the request ([dab7b7f](https://bitbucket.org/colbenson/x-components/commits/dab7b7fc38f53e360fa085eb0ee0f9d58af6d365)), closes [EX-1967](https://searchbroker.atlassian.net/browse/EX-1967)
* **result-add-to-cart:** add BaseResultAddToCart component ([ff5a473](https://bitbucket.org/colbenson/x-components/commits/ff5a473e4aef9148505d67efe7be65cf90c7d169)), closes [EX-1914](https://searchbroker.atlassian.net/browse/EX-1914)
* **result-link:** create BaseResultLink component and events associated with it ([54b708a](https://bitbucket.org/colbenson/x-components/commits/54b708a1f895623a4c0f4e8ac5e096162251fa52)), closes [EX-1911](https://searchbroker.atlassian.net/browse/EX-1911)
* **sanitize:** add sanitize function to encode characters in a string ([657d26a](https://bitbucket.org/colbenson/x-components/commits/657d26a851cb93881fed81247edfea72266271a1)), closes [EX-1721](https://searchbroker.atlassian.net/browse/EX-1721)
* **search-box:** add event UserClearedQuery to be emitted when search-box is cleared in any way ([34ae32f](https://bitbucket.org/colbenson/x-components/commits/34ae32f631d5218569ec7a50bf9daf51d4aaab46)), closes [EX-1916](https://searchbroker.atlassian.net/browse/EX-1916)
* **search-box:** add instant search to SearchInput component ([ad02b5b](https://bitbucket.org/colbenson/x-components/commits/ad02b5b710465ad4db02883ce331b72d1cd62d7e)), closes [EX-1934](https://searchbroker.atlassian.net/browse/EX-1934)
* **search-box-config:** add default config for search-box x-module ([d885140](https://bitbucket.org/colbenson/x-components/commits/d885140d0b7020691fb88ab495f1ab6b488b3834)), closes [EX-1678](https://searchbroker.atlassian.net/browse/EX-1678)
* **search-box-module-events:** add new events of search-box module ([9898997](https://bitbucket.org/colbenson/x-components/commits/98989975d514ce43750b881c6a50219eb69cc6d2)), closes [EX-1679](https://searchbroker.atlassian.net/browse/EX-1679)
* **search-box-wiring:** add wires in search-box wiring ([b8ce7a6](https://bitbucket.org/colbenson/x-components/commits/b8ce7a615c909065673697303a5a5ecf3aaf75da)), closes [EX-1664](https://searchbroker.atlassian.net/browse/EX-1664)
* **search-button:** add search-button component ([90812f6](https://bitbucket.org/colbenson/x-components/commits/90812f63b4bb37b665769af7d0966ced0cb164ab)), closes [EX-1662](https://searchbroker.atlassian.net/browse/EX-1662)
* **search-input:** add search input component ([4a384b2](https://bitbucket.org/colbenson/x-components/commits/4a384b2bb13a56cd3ce29d01d86a654c25c7b7e5)), closes [EX-1661](https://searchbroker.atlassian.net/browse/EX-1661)
* **search-types:** include the search-types.api.json file to generate the package documentation ([e2aad39](https://bitbucket.org/colbenson/x-components/commits/e2aad390b889f72bde7f528f93de96ef19c20471)), closes [EX-1776](https://searchbroker.atlassian.net/browse/EX-1776)
* **standard-version:** append ci type into standard version configuration ([025b74d](https://bitbucket.org/colbenson/x-components/commits/025b74da35e61262e82153773c78908bc691ff37)), closes [EX-1723](https://searchbroker.atlassian.net/browse/EX-1723)
* **suggestions:** add suggestions generic component ([0080134](https://bitbucket.org/colbenson/x-components/commits/0080134e7a4e431792051ef610fd1ac0e019410c)), closes [EX-1692](https://searchbroker.atlassian.net/browse/EX-1692)
* **term-suggestions-config:** add term-suggestions config ([2a396cf](https://bitbucket.org/colbenson/x-components/commits/2a396cf2fd64836ea86c90eeefc43c3dacc7d51b)), closes [EX-1708](https://searchbroker.atlassian.net/browse/EX-1708)
* **test-utils:** add utility functions to make easier testing with jest ([6b9e577](https://bitbucket.org/colbenson/x-components/commits/6b9e577830b9d450f458bb1d2f8b0f348a194d94)), closes [EX-1788](https://searchbroker.atlassian.net/browse/EX-1788)
* **ts-doc:** add support to tsdoc and jsdoc eslint plugins ([c68ad15](https://bitbucket.org/colbenson/x-components/commits/c68ad150af4bbc562fec09fe619bb90023836592)), closes [EX-1689](https://searchbroker.atlassian.net/browse/EX-1689)
* **ts-es-lint:** add support to TypeScript ES-lint through new plugin ([abf1fd1](https://bitbucket.org/colbenson/x-components/commits/abf1fd13afd6c490733fe0cc16e712803c8115c2)), closes [EX-1619](https://searchbroker.atlassian.net/browse/EX-1619)
* **utils:** add array and normalize shared utility functions ([67875e0](https://bitbucket.org/colbenson/x-components/commits/67875e0ec900d8f4ca52899ced4b23b2a15cddf9)), closes [EX-1764](https://searchbroker.atlassian.net/browse/EX-1764)
* **utils:** add debounce util ([71bdd63](https://bitbucket.org/colbenson/x-components/commits/71bdd6353a8d2f0455d08d34514059e671db8cea)), closes [EX-1934](https://searchbroker.atlassian.net/browse/EX-1934)
* **vue-styleguidist:** add vue styleguidist to document components ([22f436d](https://bitbucket.org/colbenson/x-components/commits/22f436d9e62a1993f14a835ed1458b55fcfc27a1)), closes [EX-1576](https://searchbroker.atlassian.net/browse/EX-1576)
* **wires-factory:** add implementation to NamespacedWireFactory.wireCommit with a function payload ([2aa1cc7](https://bitbucket.org/colbenson/x-components/commits/2aa1cc7f450c69a35b41741e50957ff1f5296cd5)), closes [EX-1594](https://searchbroker.atlassian.net/browse/EX-1594)
* **wiring:** add WirePayloadParams type and modified NamespacedWireFactory ([3099985](https://bitbucket.org/colbenson/x-components/commits/30999852ba83e888be04c6e07a14d8f5a757da2e)), closes [EX-1594](https://searchbroker.atlassian.net/browse/EX-1594)
* **wiring:** allow wiring operators to access store to retrieve data ([a471289](https://bitbucket.org/colbenson/x-components/commits/a47128949e2c97cb631ecf98b29f00a2021e71a1)), closes [EX-1888](https://searchbroker.atlassian.net/browse/EX-1888)
* **wiring-operators:** add filterWhitelistedModules & filterBlacklistedModules operators ([5e895bc](https://bitbucket.org/colbenson/x-components/commits/5e895bc0eb8a1ed7d7290cbf162031a2b670ac7c)), closes [EX-1618](https://searchbroker.atlassian.net/browse/EX-1618)
* **x-api:** append X API and installX middleware function to install X ([e52441a](https://bitbucket.org/colbenson/x-components/commits/e52441a4f512dcb3dda6c5b10c18fb7348f50c19)), closes [EX-1756](https://searchbroker.atlassian.net/browse/EX-1756)
* **x-component.utils:** add `getXComponentXModuleName` util function ([b705b5b](https://bitbucket.org/colbenson/x-components/commits/b705b5bd9cfac0ec627a143cdf545792a31f9543)), closes [EX-1617](https://searchbroker.atlassian.net/browse/EX-1617)
* **x-plugin:** add a logic to save component configurations to store ([5e57c19](https://bitbucket.org/colbenson/x-components/commits/5e57c191fa2e168adc94e042ba8e3a1c0c9fe5c8)), closes [EX-1603](https://searchbroker.atlassian.net/browse/EX-1603)
* **xon-decorator:** add XOn decorator to handle the subscription/unsubscription of an XEvent ([1ada448](https://bitbucket.org/colbenson/x-components/commits/1ada448caf0dfe67cad15f97092034af3371e564)), closes [EX-1724](https://searchbroker.atlassian.net/browse/EX-1724)
* **xplugin-search-adapter:** extract adapter to XPlugin and add subscription to adapterConfigChanged ([e159189](https://bitbucket.org/colbenson/x-components/commits/e15918908b996d2e90f247dcc8d993d387b186eb)), closes [EX-1605](https://searchbroker.atlassian.net/browse/EX-1605)
* **wiring:** add `createWireFromFunction` wire factory function. Add `filter`, `filterTruthyPayload`, `filterFalsyPayload`, `debounce` & `throttle` wire operator functions ([d0cd25c](https://bitbucket.org/colbenson/x-components/commits/d0cd25cc0e84344ec274929a9dbda827145e0a09)), closes [EX-1623](https://searchbroker.atlassian.net/browse/EX-1623)
* **bus:** remove circular dependency from `BaseXBus` and Vue components. Make bus emit only from root component. ([262d251](https://bitbucket.org/colbenson/x-components/commits/262d251e9f3e52c1bca7163b0c462a5b33693fc6)), closes [EX-1621](https://searchbroker.atlassian.net/browse/EX-1621)
* **build:** add rollup build ([697c007](https://bitbucket.org/colbenson/x-components/commits/697c00734af1ac48635bc31131d93b2a6c012986)), closes [EX-1562](https://searchbroker.atlassian.net/browse/EX-1562)
* **decorators:** add type safe `State` and `Getter` decorators for accessing state and getters in class components ([8e18674](https://bitbucket.org/colbenson/x-components/commits/8e1867422ccceb302e703e737500b5523c86f1b9)), closes [EX-1620](https://searchbroker.atlassian.net/browse/EX-1620)
* **term-suggestions:** add term-suggestions x-module skeleton ([ec1b881](https://bitbucket.org/colbenson/x-components/commits/ec1b8816255296d338300dbd1398c23a48b3cfd4)), closes [EX-1588](https://searchbroker.atlassian.net/browse/EX-1588)
* **search-box:** add search-box x-module skeleton ([f96d496](https://bitbucket.org/colbenson/x-components/commits/f96d49656c1409aa2bdd6085405400c89e3f9b66)), closes [EX-1588](https://searchbroker.atlassian.net/browse/EX-1588)
* **typing:** remove unnecessary `XStoreTree` type ([2335f68](https://bitbucket.org/colbenson/x-components/commits/2335f6817c6b5daec2fe08fa3c564b5cb841a82e)), closes [EX-1612](https://searchbroker.atlassian.net/browse/EX-1612)
* **x-module:** add `withModule` function to create `XModule` scoped wires ([764ab12](https://bitbucket.org/colbenson/x-components/commits/764ab12e47aee10a096496daace5e3c417890a47)), closes [EX-1584](https://searchbroker.atlassian.net/browse/EX-1584)
* **x-module:** remove `Emitters` and `Wiring` generic types from `XModule` ([c1a7c1f](https://bitbucket.org/colbenson/x-components/commits/c1a7c1fdc59daa1a1479967c86b95d6e25b5e39e)), closes [EX-1613](https://searchbroker.atlassian.net/browse/EX-1613)
* **store:** add Store and StoreEmitters to the X-Module ([207ba71](https://bitbucket.org/colbenson/x-components/commits/207ba718d9d59e1c7b2ff6abaa919f73ce1b91fb)), closes [EX-1559](https://searchbroker.atlassian.net/browse/EX-1559)
* **wiring:** add wiring system ([7cb8983](https://bitbucket.org/colbenson/x-components/commits/7cb89836252b63df1db8d18827d7abc6ae3b8987)), closes [EX-1554](https://searchbroker.atlassian.net/browse/EX-1554)
* **wiring-factory:** add wiring factory methods ([c64afda](https://bitbucket.org/colbenson/x-components/commits/c64afda084fa420cd738d61c4ae0b1afdf075b07)), closes [EX-1564](https://searchbroker.atlassian.net/browse/EX-1564)
* **project:** create project with basic shared utils ([5c6b521](https://bitbucket.org/colbenson/x-components/commits/5c6b521d9dc20ab545a940b2734ee8983f857935)), closes [EX-1563](https://searchbroker.atlassian.net/browse/EX-1563)


### Bug Fixes

* **build:** make build fail if api-extractor has errors ([bdf7b3a](https://bitbucket.org/colbenson/x-components/commits/bdf7b3a051e80f6f0c43a0038745bf45a460112d)), closes [EX-1803](https://searchbroker.atlassian.net/browse/EX-1803)
* **components:** fix vue components exports ([fafc908](https://bitbucket.org/colbenson/x-components/commits/fafc9086b43a6f4b304c028420fcf421f582c56e)), closes [EX-1884](https://searchbroker.atlassian.net/browse/EX-1884)
* **cypress:** fix Cypress webpack/preprocessor config to avoid .ts transpilation file issues ([39645f0](https://bitbucket.org/colbenson/x-components/commits/39645f063e2bde07278e05d1ff6bac4d61134e58)), closes [EX-1870](https://searchbroker.atlassian.net/browse/EX-1870)
* **debounce:** remove wireDebounce to avoid side effects ([ff9abc5](https://bitbucket.org/colbenson/x-components/commits/ff9abc5b7001ddacc2559b36e01ee4798a033e6b)), closes [EX-1955](https://searchbroker.atlassian.net/browse/EX-1955)
* **history-queries:** fix class selector in history queries' e2e test ([72cc49c](https://bitbucket.org/colbenson/x-components/commits/72cc49c7d0d34781632550f8bdc26f568025c98d)), closes [EX-1857](https://searchbroker.atlassian.net/browse/EX-1857)
* **history-queries:** fix history queries removing queries when replacing last stored query ([8cb272f](https://bitbucket.org/colbenson/x-components/commits/8cb272f430ab982069f79627ee2dd10fefc91a65)), closes [EX-1764](https://searchbroker.atlassian.net/browse/EX-1764)
* **jenkins:** add test command for Jenkins CI ([bcef8eb](https://bitbucket.org/colbenson/x-components/commits/bcef8eb5191f44fb6e053e09e3beeb08f918f44b)), closes [EX-1702](https://searchbroker.atlassian.net/browse/EX-1702)
* **jest:** fix testMatch option to look into src instead all project ([fbe126c](https://bitbucket.org/colbenson/x-components/commits/fbe126c12ae83faf36735ed3ea7f6d0ece3ecb9a)), closes [EX-1802](https://searchbroker.atlassian.net/browse/EX-1802)
* **next-queries:** avoid clearing next-queries when the query is empty ([b93bfc7](https://bitbucket.org/colbenson/x-components/commits/b93bfc70ee8fafbf85d94996c036211c652d8ad6)), closes [EX-1880](https://searchbroker.atlassian.net/browse/EX-1880)
* **query-suggestion:** use getter of normalizedQuery to use as query in the component ([30b1099](https://bitbucket.org/colbenson/x-components/commits/30b10993da864c1ac3c3620a7e441408deddd575)), closes [EX-1886](https://searchbroker.atlassian.net/browse/EX-1886)
* **query-suggestions:** fix missing css class, slots docs, slot naming to kebab case and binds ([5b17870](https://bitbucket.org/colbenson/x-components/commits/5b178709703ddde34e6f19d8e28fc7aa3a6acfcd)), closes [EX-1794](https://searchbroker.atlassian.net/browse/EX-1794)
* **request-getters:** avoid constructing a request when the query is empty or has spaces ([519ef93](https://bitbucket.org/colbenson/x-components/commits/519ef93e6e3a13d4e1c406f4d4ef78cfc8c7bcf2)), closes [EX-1881](https://searchbroker.atlassian.net/browse/EX-1881)
* **rxjs:** fix rxjs imports to support rollup commonjs plugin ([bc0ca32](https://bitbucket.org/colbenson/x-components/commits/bc0ca32c52f0cf9398b98b171f072760d7a33e51)), closes [EX-1884](https://searchbroker.atlassian.net/browse/EX-1884)
* **storage-service:** add dummy local storage service for node environment ([60f1891](https://bitbucket.org/colbenson/x-components/commits/60f18911ccba830f8596b2e9acfc575ecc73030b))
* **tests-fix:** fix tests making them wait until Vue updates reactive dependencies ([8497ddd](https://bitbucket.org/colbenson/x-components/commits/8497ddd842cc86bb7e93cce44aacedc3d0c4f6ba)), closes [EX-1697](https://searchbroker.atlassian.net/browse/EX-1697)
* **types:** fix store generic type constraint for Mutations and Actions ([1838f4e](https://bitbucket.org/colbenson/x-components/commits/1838f4ed900c956eac16ca6bb6b505a23fb82320)), closes [EX-1631](https://searchbroker.atlassian.net/browse/EX-1631)
* **vue-styleguidist:** create a props template to overwrite the default styleguidist template ([4d81cff](https://bitbucket.org/colbenson/x-components/commits/4d81cff2816f3d2793c6fb8119860e1587596a46)), closes [EX-1875](https://searchbroker.atlassian.net/browse/EX-1875)
* **vue-styleguidist:** create a vue-docgen slots template to overwrite the default one. Close tags within the documentation between backslashes. ([70e9d54](https://bitbucket.org/colbenson/x-components/commits/70e9d540ff0749673ad0ce0b9e1d7a5fd8e5ff3b)), closes [EX-1875](https://searchbroker.atlassian.net/browse/EX-1875)
* **x-plugin:** make immediate emitters async ([d28d504](https://bitbucket.org/colbenson/x-components/commits/d28d504d21e4c46e8473a02d69465c9dae5dafd1)), closes [EX-1849](https://searchbroker.atlassian.net/browse/EX-1849)
* **x-plugin.mixin:** refactor $x to get root XComponent inside bus emit ([8a54043](https://bitbucket.org/colbenson/x-components/commits/8a5404334e3038fb9d3825c0b324b535d1bb195a)), closes [EX-1698](https://searchbroker.atlassian.net/browse/EX-1698)


### Continuous Integration

* **package.json:** configure E2E tests command for CI Jenkins integration ([3a6e0a5](https://bitbucket.org/colbenson/x-components/commits/3a6e0a5224597d9160bf1519b880ec62c38132bd)), closes [EX-1723](https://searchbroker.atlassian.net/browse/EX-1723)


### Documentation

* **api-extractor:** add API Extractor to generate the documentation ([6240c7b](https://bitbucket.org/colbenson/x-components/commits/6240c7be3ed9a7a70e6fa9821f6d0524742003f9)), closes [EX-1558](https://searchbroker.atlassian.net/browse/EX-1558)
* **api-extractor:** add missing api extractor marks ([9abb585](https://bitbucket.org/colbenson/x-components/commits/9abb5851b26adfa8540c91745fb7b9c639c8d639)), closes [EX-1617](https://searchbroker.atlassian.net/browse/EX-1617)
* **docgen.config:** fix the naming of the md files generated from components ([53ccfd9](https://bitbucket.org/colbenson/x-components/commits/53ccfd988dee0ea822209329c08a90ad73b7a68f)), closes [EX-1875](https://searchbroker.atlassian.net/browse/EX-1875)
* **history-queries:** fix remove-history-query doc link ([a694eb5](https://bitbucket.org/colbenson/x-components/commits/a694eb58a68c450e9871c62ff4f3cf3fa7525d02)), closes [EX-1778](https://searchbroker.atlassian.net/browse/EX-1778)


### Testing

* **base-modal-container:** add e2e test to base-modal-container component ([33f6814](https://bitbucket.org/colbenson/x-components/commits/33f68148d22b689da63ba56ff34a8e15dee55a16)), closes [EX-1765](https://searchbroker.atlassian.net/browse/EX-1765)
* **e2e-popular-searches-tests:** add e2e test for popular-searches ([13f1908](https://bitbucket.org/colbenson/x-components/commits/13f190813cc6715e367f1996249d91ddb02a6723)), closes [EX-1761](https://searchbroker.atlassian.net/browse/EX-1761)
* **next-queries:** add e2e test for next queries ([fb83c77](https://bitbucket.org/colbenson/x-components/commits/fb83c7798cd2b3572ed1461631568d543d713840)), closes [EX-1840](https://searchbroker.atlassian.net/browse/EX-1840)
* **no-suggestions:** add e2e tests ([8aeeb3b](https://bitbucket.org/colbenson/x-components/commits/8aeeb3b72ac4713655821bbb5321c897f75ad16a)), closes [EX-1741](https://searchbroker.atlassian.net/browse/EX-1741)
* **x-plugin:** fix tests to use the installNewXPlugin helper ([fc54c61](https://bitbucket.org/colbenson/x-components/commits/fc54c61a612e61f4a530857f6e29d23ab3381768)), closes [EX-1854](https://searchbroker.atlassian.net/browse/EX-1854)


### Code Refactoring

* **base-components:** remove pure folder and refactor base components names ([f0e50dc](https://bitbucket.org/colbenson/x-components/commits/f0e50dc506ffd7c6b7d352ef2464dbed8ae2aa8f)), closes [EX-1793](https://searchbroker.atlassian.net/browse/EX-1793)
* **bem-css-classes:** refactor css classes following BEM ([ca72ffc](https://bitbucket.org/colbenson/x-components/commits/ca72ffc115efb0e3494948c77e785145a77bcd31)), closes [EX-1785](https://searchbroker.atlassian.net/browse/EX-1785)
* **bus:** replaced `Subject` with `ReplaySubject` ([8fcdebd](https://bitbucket.org/colbenson/x-components/commits/8fcdebd6bf783b515d46a5362b05fd99e0395d7e)), closes [EX-1849](https://searchbroker.atlassian.net/browse/EX-1849)
* **extractstate & extractgetters types:** refactor ExtractState and ExtractGetters types ([d801c07](https://bitbucket.org/colbenson/x-components/commits/d801c07101b9651a386622330a37597fd94b69c1)), closes [EX-1594](https://searchbroker.atlassian.net/browse/EX-1594)
* **history-queries:** move history queries to the root utils folder ([2e08948](https://bitbucket.org/colbenson/x-components/commits/2e0894817cbd1deba6bc0eddc96d079f1024d6df)), closes [EX-1850](https://searchbroker.atlassian.net/browse/EX-1850)
* **history-queries:** refactor removeFromHistory action to accept a `HistoryQuery` instead of an string ([c3ab74f](https://bitbucket.org/colbenson/x-components/commits/c3ab74f6a2f6fa0a3ba460248879c6e703ed4d06)), closes [EX-1738](https://searchbroker.atlassian.net/browse/EX-1738)
* **history-queries:** rename DeleteHistoryQuery to use keyword `remove` ([601fee4](https://bitbucket.org/colbenson/x-components/commits/601fee475b7a1b4c2e31c8fb5c689a1432b5a52d)), closes [EX-1811](https://searchbroker.atlassian.net/browse/EX-1811)
* **next-queries:** move actions to an independent folder ([2346947](https://bitbucket.org/colbenson/x-components/commits/2346947edf5caed80e7a9ab5d278411d9d35918d)), closes [EX-1836](https://searchbroker.atlassian.net/browse/EX-1836)
* **next-queries:** move getters to an independent folder ([63b5b90](https://bitbucket.org/colbenson/x-components/commits/63b5b9068894780154965b6f54a8fc827925b504)), closes [EX-1836](https://searchbroker.atlassian.net/browse/EX-1836)
* **next-queries:** refactor the next-queries x-module that was already created ([73a0b56](https://bitbucket.org/colbenson/x-components/commits/73a0b56298eefbfc40363fb17b3c1d8aa2d0bc7d)), closes [EX-1729](https://searchbroker.atlassian.net/browse/EX-1729)
* **popular-searches:** extract getters from module ([d44ae00](https://bitbucket.org/colbenson/x-components/commits/d44ae00db8ac69a59c6e22465a988bccea2f3104)), closes [EX-1789](https://searchbroker.atlassian.net/browse/EX-1789)
* **popular-searches:** extract module actions to an independent files ([a0b4db7](https://bitbucket.org/colbenson/x-components/commits/a0b4db7fb33f022a5e9c17cf6745efaf8eacf1b4)), closes [EX-1789](https://searchbroker.atlassian.net/browse/EX-1789)
* **popular-searches:** refactor slot and state names, update docs and refactor variable in test ([6622052](https://bitbucket.org/colbenson/x-components/commits/662205208ef03cc0398cce5be708a114d11fa561)), closes [EX-1786](https://searchbroker.atlassian.net/browse/EX-1786)
* **query-suggestions:** rename term-suggestions to query-suggestions ([84da098](https://bitbucket.org/colbenson/x-components/commits/84da0982b16ee57b80349f2c38c6ce96fbadce3a)), closes [EX-1767](https://searchbroker.atlassian.net/browse/EX-1767)
* **search-input:** refactor to use XOn decorator instead of creating manually subscription ([bd42501](https://bitbucket.org/colbenson/x-components/commits/bd42501f7a9cfb7cdc4a6d5e120c56b14ecf6687)), closes [EX-1781](https://searchbroker.atlassian.net/browse/EX-1781)
* **x-plugin:** extract getters Proxy creation from XPlugin ([800b634](https://bitbucket.org/colbenson/x-components/commits/800b63490bdf85bcdc30820b8765a2d763323278)), closes [EX-1594](https://searchbroker.atlassian.net/browse/EX-1594)
* **x-plugin:** remove global messages object in favour of individual messages ([4fafbad](https://bitbucket.org/colbenson/x-components/commits/4fafbad08bc0cbedf4cf5abb244a92173d8d72ab)), closes [EX-1842](https://searchbroker.atlassian.net/browse/EX-1842)
* **x-plugin:** remove x-plugin singleton and improve testability ([1ce38d5](https://bitbucket.org/colbenson/x-components/commits/1ce38d524c7329a6da95d11a37a84f1114774533)), closes [EX-1854](https://searchbroker.atlassian.net/browse/EX-1854)
* **xevents:** refactor XEvents into their respective module ([dd6663b](https://bitbucket.org/colbenson/x-components/commits/dd6663b9562fc57cd977fed909f6ec6a97394581)), closes [EX-1847](https://searchbroker.atlassian.net/browse/EX-1847)


### Build System

* **browserslist:** add browserslist configuration ([53192b8](https://bitbucket.org/colbenson/x-components/commits/53192b84059ec3589a1a37187e0b244f1a175b2c)), closes [EX-1561](https://searchbroker.atlassian.net/browse/EX-1561)
* **dependencies:** update `[@empathy](https://bitbucket.org/empathy)` dependencies ([3a657b1](https://bitbucket.org/colbenson/x-components/commits/3a657b1d5d5203671cd1e1624e5630a153a68fde)), closes [EX-1903](https://searchbroker.atlassian.net/browse/EX-1903)
* **dependencies:** update dependencies to match with the rest of the projects ([ab64828](https://bitbucket.org/colbenson/x-components/commits/ab648286f9ca7397d9f14f3d6eb5095ef8139c14)), closes [EX-1884](https://searchbroker.atlassian.net/browse/EX-1884)
