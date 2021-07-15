# x-types

TypeScript model types, guards, and jest schemas to use across the X project.

### How to install

```
npm install @empathyco/x-types --save
```

### How to use

The package export several model types that can be used to safely create objects that
match the expectations of X packages.

```ts
import { RelatedTag } from "@empathyco/x-types";

const relatedTag: RelatedTag = {
  query: "lego",
  tag: "city",
  selected: false,
  previous: "lego",
};
```

Additionally it also exposes some type guards to check between different types.

```ts
import { Filter, isHierarchicalFilter } from "@empathyco/x-types";

const filter: Filter = {
  modelName: "HierarchicalFilter",
  id: "color:red",
  facetId: "color",
  label: "red",
  selected: false,
  children: [],
};
// You can't access filter.children before the `if` because you have a `Filter`, not a `HierarchicalFilter`.

if (isHierarchicalFilter(filter)) {
  // But after using the `isHierarchicalFilter` guard, you can acces it.
  console.log("Children:", filter.children);
}
```

Finally, there are some `jest` schemas helpers that you could use to validate your objects.

```ts
import { HierarchicalFilterSchema } from "@empathyco/x-types/schemas";
import { Filter, isHierarchicalFilter } from "@empathyco/x-types";

it("is a hierarchical filter", () => {
  const filter: Filter = {
    modelName: "HierarchicalFilter",
    id: "color:red",
    facetId: "color",
    label: "red",
    selected: false,
    children: [],
  };

  expect(filter).toEqual(HierarchicalFilterSchema);
});
```

### How to update the version

You can check if a new version has been published running [npm outdated](https://docs.npmjs.com/cli/outdated):

`npm outdated @empathyco/x-types`

And update it using [npm update](https://docs.npmjs.com/cli/update):

`npm update --save @empathyco/x-types`
