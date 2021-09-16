import { Promoted } from '@empathyco/x-types';

/**
 * Creates a {@link @empathyco/x-types#Promoted | Promoted} stub.
 *
 * @returns Array of Promoted stub.
 *
 * @internal
 */
export function getPromotedsStub(): Promoted[] {
  return [createPromotedStub('1'), createPromotedStub('2')];
}

/**
 * Creates a promoted with a "unique" identifier.
 *
 * @param identifier - The promoted identifier.
 *
 * @returns The promoted.
 *
 * @internal
 */
export function createPromotedStub(identifier: string): Promoted {
  return {
    id: `xp-${identifier}`,
    title: `Promoted ${identifier}`,
    url: `http://x-components-promoted-${identifier}.com`,
    image: `xp-${identifier}.jpg`,
    tagging: {
      click: {
        params: {},
        url: ''
      }
    },
    modelName: 'Promoted'
  };
}
