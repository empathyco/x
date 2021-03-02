import { Promoted } from '@empathy/search-types';

/**
 * Creates {@link @empathy/search-types#Promoted | Promoted} stub.
 *
 * @returns Array of Promoted stub.
 *
 * @internal
 */
export function getPromotedStub(): Promoted[] {
  return [createPromoted('1'), createPromoted('2')];
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
function createPromoted(identifier: string): Promoted {
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
