import { Suggestion } from '@empathyco/x-types';
import { PlatformSuggestion } from '../models.types';

export interface PlatformEmpathizeResponse {
  topTrends: {
    content: PlatformSuggestion[];
    spellcheck?: string;
  };
}

export interface EmpathizeResponse {
  suggestions: Suggestion[];
  spellcheck?: string;
}
