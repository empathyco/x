/**
 *    tasks: endpointAdapterFactory<TasksRequest, TasksResponse>({
 *       endpoint: ({ taskId }) => `${tasksApi}/${taskId}`,
 *       requestMapper: request => request,
 *       responseMapper: tasksResponseMapper,
 *     }),
 */
