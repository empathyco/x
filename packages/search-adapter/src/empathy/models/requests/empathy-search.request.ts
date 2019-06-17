export interface EmpathySearchRequest {
  catalogue?: string;
  filter: string[];
  lang: string;
  origin?: string;
  q: string;
  rows?: number;
  scope?: string;
  sort?: string;
  start?: number;
  store?: string;
  warehouse?: string;
}
