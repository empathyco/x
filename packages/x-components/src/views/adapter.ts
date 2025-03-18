import {
  getTaggingInfoFromUrl,
  PlatformAdapter,
  platformAdapter,
  PlatformRelatedPromptsResponse
} from '@empathyco/x-adapter-platform';
import { e2eAdapter } from '../adapter/e2e-adapter';
import { createMutableSchema, MapperContext, schemaMapperFactory } from '@empathyco/x-adapter';
import { RelatedPrompt } from '@empathyco/x-types';

export const adapterConfig = {
  e2e: 'Cypress' in window ? true : false
};

const experienceControlsAdapter = platformAdapter.experienceControls.extends({
  endpoint: 'https://config-service.internal.test.empathy.co/public/configs'
});

export interface MMRelatedPrompts {
  data: {
    relatedprompts: RelatedPrompt[];
  };
}

export interface RelatedPrompts {
  relatedPrompts: RelatedPrompt[];
}

/* The `relatedPromptsSchema` used to map related prompts. */
const relatedPromptsSchema = createMutableSchema<unknown, unknown>({
  relatedPrompts: (
    { data }: PlatformRelatedPromptsResponse,
    { requestParameters }: MapperContext
  ) => {
    const relatedPrompts: RelatedPrompt[] = data.relatedprompts.map(({ tagging, ...rest }) => ({
      modelName: 'RelatedPrompt',
      ...rest
      /*tagging: {
        toolingDisplayTagging: getTaggingInfoFromUrl(tagging?.toolingDisplay),
        toolingDisplayClickTagging: getTaggingInfoFromUrl(tagging?.toolingDisplayClick),
        nextQueriesTagging: rest.nextQueries.map(nextQuery => ({
          query: nextQuery,
          toolingDisplayTagging: getTaggingInfoFromUrl(
            tagging.nextQueries[nextQuery].toolingDisplay
          ),
          toolingDisplayClickTagging: getTaggingInfoFromUrl(
            tagging.nextQueries[nextQuery].toolingDisplayClick
          ),
          toolingDisplayAdd2CartTagging: getTaggingInfoFromUrl(
            tagging.nextQueries[nextQuery].toolingDisplayAdd2Cart
          )
        }))
      }*/
    }));

    return relatedPrompts;
  }
});
export const relatedPromptsMapper = schemaMapperFactory<unknown, unknown>(relatedPromptsSchema) as (
  from: Readonly<MMRelatedPrompts>,
  context: MapperContext
) => RelatedPrompts;

const relatedPromptsAdapter = platformAdapter.relatedPrompts.extends({
  endpoint: 'https://api.empathy.co/relatedprompts/mymotivemarketplace',
  requestMapper: from => ({
    instance: 'mymotivemarketplace',
    lang: 'es',
    area: 'Asturias'
  }),
  responseMapper: relatedPromptsMapper
});

platformAdapter.experienceControls = experienceControlsAdapter;
platformAdapter.relatedPrompts = relatedPromptsAdapter;

export const adapter = new Proxy(platformAdapter, {
  get: (obj: PlatformAdapter, prop: keyof PlatformAdapter) =>
    adapterConfig.e2e ? e2eAdapter[prop] : obj[prop]
});
