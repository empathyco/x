import { Promoted, Tagging } from '@empathyco/x-types';
import { DeepPartial } from '../utils/types';

/**
 * Creates {@link @empathyco/x-types#Promoted | promoted} stub.
 *
 * @returns Array of promoteds stub.
 *
 * @internal
 */
export function getPromotedsStub(): Promoted[] {
  return [
    {
      ...getPromotedCommonValues(),
      id: 'xp-001',
      title: 'Promoted 01',
      url: 'http://x-components.com',
      image: 'xc-01.jpg',
      tagging: {
        click: getTaggingByAction('click', { productId: 'xc-001' })
      }
    },
    {
      ...getPromotedCommonValues(),
      id: 'xp-002',
      title: 'Promoted 02',
      url: 'http://x-components.com',
      image: 'xc-02.jpg',
      tagging: {
        click: getTaggingByAction('click', { productId: 'xc-002' })
      }
    }
  ] as Promoted[];
}

/**
 * Creates a deep partial promoted with common values for all promoted stub array.
 *
 * @returns DeepPartial promoted.
 *
 * @internal
 */
function getPromotedCommonValues(): DeepPartial<Promoted> {
  return {
    modelName: 'Promoted'
  };
}

/**
 * Creates a {@link @empathyco/x-types#Tagging | promoted tagging} mocked object.
 *
 * @param action - String with the action to tag.
 * @param params - Params to add to the tagging request.
 *
 * @returns Tagging mocked object.
 *
 * @internal
 */
function getTaggingByAction(action: string, params: Record<string, any>): Tagging {
  return {
    url: `http://x-components.com/tagging/${action}`,
    params: {
      ...params
    }
  };
}
