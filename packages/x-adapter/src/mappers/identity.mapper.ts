/**
 * Maps an entity to itself.
 *
 * @param value - The entity to map.
 *
 * @returns The mapped entity.
 * @public
 */
export function identityMapper<Something>(value: Something): Something {
  return value;
}
