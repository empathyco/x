export interface EmpathyUserInfoRequest {
  user: string;
  session: string;
  user_type: string;
}

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

export interface EmpathyClicksRecommendationsRequest extends BaseDiscoveryWallRecommendationsRequest, Partial<EmpathyUserInfoRequest> {
  productId: string[];
}

export interface EmpathyQueriesRecommendationsRequest extends BaseDiscoveryWallRecommendationsRequest, Partial<EmpathyUserInfoRequest> {
  query: string[];
}

export interface EmpathySectionRecommendationsRequest extends BaseDiscoveryWallRecommendationsRequest, Partial<EmpathyUserInfoRequest> {
  section: string;
}

export interface EmpathyUserRecommendationsRequest extends BaseDiscoveryWallRecommendationsRequest, EmpathyUserInfoRequest {}
