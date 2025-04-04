import type { Mapper } from '@empathyco/x-adapter'
import type { TaggingRequest } from '@empathyco/x-types'

/**
 * Default implementation for the TaggingRequestMapper.
 *
 * @param params - The tagging request params.
 * @param params.params - The tagging request params.
 * @returns The tagging request params.
 *
 * @public
 */
export const taggingRequestMapper: Mapper<TaggingRequest, any> = ({ params }: TaggingRequest) =>
  params
