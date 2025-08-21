import type { ExtraParamsRequest } from '../request.model'

/**
 * Request for the task endpoint.
 *
 * @public
 */
export interface AiTasksRequest extends ExtraParamsRequest {
  taskId: string
}
