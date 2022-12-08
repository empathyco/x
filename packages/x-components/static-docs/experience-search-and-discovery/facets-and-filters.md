---
title: Facets & Filters UI
tag:
  - faceted
---

Facets and Filters allow your shoppers to organize your product catalogue in different categories
and narrow the search results to better find what they are looking for. Shoppers can set filters
according to the categories or facets defined in the faceted menu, which is usually located on the
left or upper side of the search engine results page or product listing page.

![Facets](~@assets/media/interface/x-facets.gif)

X&nbsp;Components for facets present how you have categorized your products, displaying the
different aspects available (brand, price, color…), while the filter-related components render the
values for those aspects that shoppers can use to filter by ("Nestlé", "Kellogg’s" for _brand_;
“€0 - €10”, “€10 - €50” for _price_; “blue”, “black”, “white” for _color_), allowing you to
determine how to display them.

<!--Originally, the X&nbsp;Components for facets and filters were designed for **search**. However,
since they can precisely organize and filter your product catalogue to bring out the products that
best fit your shoppers’ needs, you can also use them for **catalogue navigation** and **product
discovery**. You can guide shoppers through your product catalogue faster, allowing them to navigate
and browse different product classifications directly from the faceted menu in your shop, without
having to search.-->

::: interact

Can't quite capture the concept? Learn more about
[Facets and Filters](../overview/facets-and-filters-overview.md).

:::

## Build a faceted experience with X Components

There is no need to reinvent the wheel to design a good faceting experience, but rather it’s better
to understand the shopper’s journey and the frontend options available.

Facets and filters can display as different UI element types (select list, search, range…) using the
numerous X&nbsp;Components available. Flexibly combine X&nbsp;Components to build the connection
with the product attributes in your catalogue. **Guide** shoppers towards relevant results in record
time, giving them the opportunity to establish a **dialogue** with your product catalogue and easily
decide what results to display by adding and clearing filters, or make information on product
results **clearer and more accessible**, meeting different types of faceting layouts.

![Facets](~@assets/media/interface/x-facets.svg)

::: details Rendering facets and filters

X&nbsp;Components for facets and filters not only enhances your shoppers’ experience by supporting
and rendering faceted search and navigation, but also provides different ways to display a faceted
experience:

</br>

- **Standard facets**: a single-select list that offers a way to describe a product attribute,
  together with the values available to filter by. For example, a _Color_ facet can include values
  such as “red”, “blue”, “white”, “black”, or “green”.
- **Hierarchical facets**: present filter values organized hierarchically, providing a parent-child
  filtering relationship. Shoppers can filter using the parent subfacet or choose the child subfacet
  as a more precise filter. For example, the _Category_ facet in a jewellery store can display
  “Button”, “Short”, and “Long” as child filters for the “Earrings” parent filter.
- **Number range facets**: allow shoppers to select a range of numerical values and narrow the
  results within those ranges. Intended for price or size facets that have numeric value type
  attributes. For example, the _Price_ facet in a grocery store can display “< €0.99”, “€1 – €4.99”,
  “€5 – €9.99”, or “€10 – €19.99”. Implement **editable number range facets** and let your shoppers
  define the numerical ranges they want to filter by. Shoppers can type the desired price range to
  filter by in the _From_ - _To_ or _Min_ - _Max_ input fields available.

:::

::: details Extending facets and filters UI

Apart from the main X&nbsp;Components for facets and filters that render product categories and
their corresponding attributes in different ways, there are components available offering advanced
options to enhance the faceted experience.

</br>

- **Collapse & expand** to initially display facets collapsed on page load with a predetermined
  number of filter values. Use a Show more button to expand the full list.
- **Search box** to perform a text-based search on the filter values so that shoppers quickly find
  the filters to apply to the results set.
- **Selected filters list** to keep track of the shopper’s selection and understand the results
  displayed. Selected filters can be displayed together under the same list or be organized by
  facets. Shoppers can deselect any of the previously applied filters or clear all at once to try
  different filtering values.
- **Selected filters first** to change the order in which filters are initially displayed within a
  facet so that the selected filters come first in the list. Note that the order of facets and
  filters is determined by your Search microservice, usually showing the filters with the highest
  number of products.
- **Product count** to display the number of matches or occurrences next to the facet filter.
  Shoppers can instantly see how many products each filter contains, offering a valuable insight on
  your product catalog.
- **Zero count** to only display filter values for those filters that **match a product result**,
  omitting all those filters that have zero occurrences. For example, the query “skirts” in a retail
  shop returns a large number of results for women and kids, but none for men. In this case, the
  _Category_ facet only displays the filters “Woman”, “Girl”, and “Baby”.

</br>

Besides, you can use X&nbsp;Components to customize other attributes and behaviors. Transform a
value returned from the Search microservice of “20 - 50” into “€20 - €50” or turn a numerical value
into icons or images such as stars for average rating-based filtering, for example.

</br>

You can also change the default single-select behavior and activate **multi-select** controls so
that shoppers can select more than one filter value at a time from the same facet to expand results.

:::

## Tailor the web experience

**Layout, location, and display**:

- Place the facets menu wherever you prefer. However, facets are commonly positioned in the left
  sidebar or as top horizontal facets.
- Hide or show the facets & filter menu when search results are displayed. Display facets and
  filters as collapsed lists at first.
- Animate the display of different elements: facets, filters, and related lists (e.g. selected
  filters list).
- Build the layout of facets and filters at your ease: from dropdowns and checkboxes to switches,
  tags, and sliders.

**Data and content**:

- Select which facets defined in your product catalogue you want to display according to your
  business strategy or your shoppers’ needs.
- Configure the content of filters. Allow shoppers to filter results using text, icons, or
  checkboxes.
- Configure the content of related buttons (e.g. Show more button). Show whatever you need: text or
  icons.
- Customize labels in the facets and filters list. Add a custom title for facets, filters, and
  related lists (e.g. selected filters list).
- Customize facet data at your ease. You can opt to render facets defined in your product catalogue
  automatically, display custom facets, or even render a mix of them.

::: warning

Make sure your current Search microservice is compatible with this kind of configuration.

:::

::: interact

Want to know more? Learn how to [configure](/develop-empathy-platform/ui-reference/components/facets/) your web
experience.

:::


