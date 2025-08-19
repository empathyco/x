import type { ExtraParamsRequest } from '../request.model'

export interface AiTasksRequest extends ExtraParamsRequest {
  taskId: string
}
