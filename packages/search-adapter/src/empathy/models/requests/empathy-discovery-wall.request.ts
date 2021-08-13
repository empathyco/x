/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathyUserInfoRequest {
  user: string;
  session: string;
  user_type: string;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @internal
 */
interface BaseDiscoveryWallRecommendationsRequest {
  lang: string;
  rows?: number;
  start?: number;
  catalogue?: string;
  store?: string;
  warehouse?: string;
  origin?: string;
  // Sending the section on every endpoint should retrieve better results, but is not mandatory
  section?: string;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathyClicksRecommendationsRequest extends BaseDiscoveryWallRecommendationsRequest, Partial<EmpathyUserInfoRequest> {
  productId: string[];
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathyQueriesRecommendationsRequest extends BaseDiscoveryWallRecommendationsRequest, Partial<EmpathyUserInfoRequest> {
  query: string[];
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathySectionRecommendationsRequest extends BaseDiscoveryWallRecommendationsRequest, Partial<EmpathyUserInfoRequest> {
  section: string;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathyUserRecommendationsRequest extends BaseDiscoveryWallRecommendationsRequest, EmpathyUserInfoRequest {}
