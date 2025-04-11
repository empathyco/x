import type { DOMWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { getDataTestSelector } from '../../__tests__/utils'
import BaseRating from '../base-rating.vue'

function renderBaseRating({ template }: RenderBaseRatingOptions): RenderBaseRatingApi {
  const wrapper = mount({ template }, { components: { BaseRating } })

  return {
    getFilledIcons: (): DOMWrapper<Element>[] =>
      wrapper.find(getDataTestSelector('rating-filled')).findAll(':scope > *'),
    getEmptyIcons: (): DOMWrapper<Element>[] =>
      wrapper.find(getDataTestSelector('rating-empty')).findAll(':scope > *'),
  }
}

describe('testing Rating component', () => {
  it('renders the default icons a number of times based on the max prop', () => {
    const { getFilledIcons, getEmptyIcons } = renderBaseRating({
      template: `<BaseRating :value="2.5" :max="10" />`,
    })
    expect(getEmptyIcons()).toHaveLength(10)
    expect(getFilledIcons()).toHaveLength(10)
  })

  it('renders the passed by slot icons a number of times based on the max prop', () => {
    const { getFilledIcons, getEmptyIcons } = renderBaseRating({
      template: `<BaseRating :value="2.5" :max="6" >
                  <template #empty-icon><span class="test-empty-icon" /></template>
                  <template #filled-icon><span class="test-filled-icon" /></template>
                 </BaseRating>`,
    })
    expect(getFilledIcons().filter(w => w.classes('test-filled-icon'))).toHaveLength(6)
    expect(getEmptyIcons().filter(w => w.classes('test-empty-icon'))).toHaveLength(6)
  })
})

interface RenderBaseRatingOptions {
  template: string
}

interface RenderBaseRatingApi {
  getFilledIcons: () => DOMWrapper<Element>[]
  getEmptyIcons: () => DOMWrapper<Element>[]
}
