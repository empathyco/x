/**
 *     questions: endpointAdapterFactory<QuestionsRequest, QuestionsResponse>({
 *       endpoint: `${questionsApi}/mymotivemarketplace/conversational`,
 *       requestMapper: questionsRequestMapper,
 *       responseMapper: questionsResponseMapper,
 *       defaultRequestOptions: {
 *         cancelable: false,
 *         sendParamsInBody: true,
 *         properties: {
 *           method: 'POST',
 *           headers: {
 *             'content-type': 'application/json',
 *           },
 *         },
 *       },
 *     }),
 */
