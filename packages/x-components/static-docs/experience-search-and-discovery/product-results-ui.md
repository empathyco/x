---
title: Product results UI
tags:
  - results layout
---

After launching a search, some shoppers may just want to take a quick look around, reviewing only
product thumbnails and quick info on the SERP. While others will prefer to have a more detailed
overview of the product results with large and multiple images. That’s why the display of results is
really issue.

Results are rendered thanks to the combination of different X&nbsp;Components. This way, you can
tailor the display to create the best product discovery experience for your shoppers. Decide the
elements and product-related information you want to include when displaying product results such as
the price, a picture, or even an add-to-cart button.

![X Components for results display](~@assets/media/features/overview-product-results-card.svg)

<FootNote>

**X&nbsp;Components for results display** <br/> (A) Image, (B) Product information, (C) Price, (D)
PDP Link, (E) Rating, (F) Add to cart

</FootNote>

::: interact

To learn more about the display of results, see
[Product results](/explore-empathy-platform/overview/product-results-overview.md).

:::

**A bunch of components for comprehensive product information**  
Decide whether you want to include
the description for the resulting product, a picture, or even rating information:

- **Image**. Include a picture of the product for better product recognition.&nbsp;(A)
- **Result data and product variants**. Retrieve the information to display about the product –name,
  description, reference, brand, category, season, colors, types, sizes, or any data from your
  catalogue.&nbsp;(B)
- **Pricing**. Indicate the original price of the product, discounts, and special prices.&nbsp;(C)
- **Product details**. Link your shoppers to the product detail page (PDP).&nbsp;(D)
- **Rating**. Show how valued a product is among your shoppers.&nbsp;(E)
- **Add to cart**. Allow your shoppers to add a product to the cart from the search engine results
  page (SERP), without going through the PDP.&nbsp;(F)

:::warning

To include rating and add-to-cart options in results, rating and add-to-cart features must be
implemented in your product catalogue.

:::

## Tailor the web experience

- Customize content. Choose and display the product-related information available in your catalogue.
- Add a PDP link to the product name or description, the picture, or to the entire product result.
- Format the price of products with integers and decimals. Decide the length of decimals or whether
  decimals should be rendered or not.
- Select the desired currency for prices.
- Customize the default rendering behavior of pictures when loading or broken.
- Animate the display of product results.

::: interact

Want to know more? Learn how to [configure](/develop-empathy-platform/ui-reference/) your web
experience.

:::

## Extend the performance

Traditionally, search results are displayed on the SERP after the query is launched or instantly as
you type. However, result data is also used by features such as
[Recommendations](/explore-empathy-platform/experience-search-and-discovery/recommendations.md) and
[ID Results](/explore-empathy-platform/experience-search-and-discovery/id-results.md). You can combine
results-related components with these modules to get advanced display options. Include additional
product information in Recommendations and Identifier Results such as prices and pictures for better
recognition and understanding of the products displayed.


