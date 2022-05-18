import {
  Contentable,
  PlatformBanner,
  PlatformCatalog,
  PlatformPromoted,
  PlatformRedirection
} from '../models.types';

export interface PlatformSearchResponse {
  banner: Contentable<PlatformBanner>;
  catalog: PlatformCatalog;
  direct: Contentable<PlatformRedirection>;
  promoted: Contentable<PlatformPromoted>;
}
