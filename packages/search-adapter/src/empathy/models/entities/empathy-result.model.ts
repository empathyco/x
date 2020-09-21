/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathyResult {
  ebTagging: {
    add2cart: string;
    click: string;
    conversion?: string;
    wishlist?: string;
  };
  eb_sku?: string;
  id: string;
  image?: string;
  name: string;
  originalPrice?: number | string;
  price?: number | string;
  rating?: string;
  url: string;
  isWishlisted?: boolean;
}
