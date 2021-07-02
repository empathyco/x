import { Identifiable } from '../identifiable.model';

/**
 * Jest schema for validating Identifiable entities.
 *
 * @public
 */
export const IdentifiableSchema: Identifiable = {
    id: expect.anyOf([String, Number])
};
