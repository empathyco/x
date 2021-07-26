import { NextItem } from '@docusaurus/react-components/Utils';

## How to install XPlugin

:::caution
You have to install the XComponents dependency first.[Install](https://bitbucket.org/colbenson/x-components/src/master/CHANGELOG.md)
:::

After this you need to install the plugin before create your vue instance.

:::caution
The adapter is mandatory. You should use your own adapter or the one that we provide you.
:::

```js
import { installX } from '@empathyco/x-components';

installX({adapter});

new Vue({
  render: h => h(App)
}).$mount('#app');
```

In this case we use our own adapter, to use it you should install it:

:::caution
This is a private dependency you will need credentials to use it: [NPM Repository](https://searchbroker.atlassian.net/wiki/spaces/EAF/pages/172753015/Setting+up+EmpathyBroker+s+private+npm+repository+locally)
:::
:::note
You can check the current search adapter version here: [Search Adapter](https://bitbucket.org/colbenson/search-adapter/src/master/CHANGELOG.md)
:::

```jsx
npm install @empathyco/x-adapter
```

And after that you will import it where you install the plugin:

:::info
The instance id will be the one that we will provide you to use our search services.
:::
:::caution
It is mandatory to import 'reflect-metadata' if you use our adapter!
:::

```js
import 'reflect-metadata';
import { EmpathyAdapterBuilder } from '@empathyco/x-adapter';
import { installX } from '@empathyco/x-components';

const adapter = new EmpathyAdapterBuilder()
  .withConfiguration({instance: 'my-instance-id'})
  .build();

installX({adapter});

new Vue({
  render: h => h(App)
}).$mount('#app');
```

 ## Up next

Before this steps, you will be ready to use the components in your project.

<NextItem color="#e77962" font='white' next="use-components">How to use components</NextItem>
