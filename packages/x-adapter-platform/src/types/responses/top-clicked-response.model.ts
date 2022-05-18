import { Result } from '@empathyco/x-types';
import { PlatformResult } from '../models.types';

export interface PlatformTopClickedResponse {
  topclicked: {
    content: PlatformResult[];
    numFound: number;
  };
}

export interface TopClickedResponse {
  results: Result[];
}
