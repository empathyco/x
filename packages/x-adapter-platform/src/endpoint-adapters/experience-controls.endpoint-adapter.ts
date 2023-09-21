import { endpointAdapterFactory } from '@empathyco/x-adapter';

/**.
 * Default adapter for the experience controls endpoint.
 *
 * TODO: change RequestMapper and ResponseMapper
 *
 * @public
 */
export const experienceControlsEndpointAdapter = endpointAdapterFactory<any, any>({
  endpoint:
    'https://config-service.internal.test.empathy.co/public/configs' +
    '?service=xcontrols&instance={extraParams.instance}',
  requestMapper: undefined,
  responseMapper: undefined,
  defaultRequestOptions: {
    id: 'experience-controls',
    parameters: {
      internal: true
    }
  }
});
