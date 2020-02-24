# X Components
### 0.0.1 (2020-02-20)


### Features

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
