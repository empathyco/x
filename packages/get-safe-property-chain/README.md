# x-get-safe-property-chain

A utility for safely retrieving nested values.

### Installation

You can install the package using `npm`

```
npm install @empathyco/x-get-safe-property-chain --save-dev
```

### Usage

```
import { getSafePropertyChain } from '@empathyco/x-get-safe-property-chain';

const obj = { nestedObject: { anotherNestedObject: { message: 'Hell yeah!' } } }; 
const message = getSafePropertyChain(obj, 'nestedObject.anotherNestedObject.message');
console.log(message); // 'Hell yeah!'
```
