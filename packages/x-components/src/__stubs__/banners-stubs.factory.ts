import { Banner, Tagging } from '@empathy/search-types';
import { DeepPartial } from '../utils/types';

/**
 * Creates {@link @empathy/search-types#Banner | banners} stub.
 *
 * @returns Array of banners stub.
 *
 * @internal
 */
export function getBannersStub(): Banner[] {
  return [
    {
      ...getBannerCommonValues(),
      id: 'xb-001',
      title: 'Banner 01',
      url: 'http://x-components.com',
      image: 'xc-01.jpg',
      tagging: {
        click: getTaggingByAction('click', { productId: 'xc-001' })
      }
    },
    {
      ...getBannerCommonValues(),
      id: 'xb-002',
      title: 'Banner 02',
      url: 'http://x-components.com',
      image: 'xc-02.jpg',
      tagging: {
        click: getTaggingByAction('click', { productId: 'xc-002' })
      }
    }
  ] as Banner[];
}

/**
 * Creates a deep partial banner with common values for all banner stub array.
 *
 * @returns DeepPartial banner.
 *
 * @internal
 */
function getBannerCommonValues(): DeepPartial<Banner> {
  return {
    modelName: 'Banner'
  };
}

/**
 * Creates a {@link @empathy/search-types#Tagging | banner tagging} mocked object.
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
