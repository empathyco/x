import type { RangeValue } from '@empathyco/x-types'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { getDataTestSelector } from '../../__tests__/utils'
import BaseSlider from '../base-slider.vue'

const thresholdStub = { min: 0, max: 100 }

function render({
  modelValue = { min: 10, max: 20 },
  threshold = thresholdStub,
}: { modelValue?: RangeValue; threshold?: { min: number; max: number } } = {}) {
  const wrapper = mount(BaseSlider, {
    props: {
      modelValue,
      threshold,
    },
  })

  return {
    wrapper,
    minText: () => wrapper.find(getDataTestSelector('base-slider-min')).text(),
    maxText: () => wrapper.find(getDataTestSelector('base-slider-max')).text(),
  }
}

describe('testing BaseSlider component', () => {
  it('should render the selected min and max values', () => {
    const { minText, maxText } = render({ modelValue: { min: 10, max: 20 } })

    expect(minText()).toContain('10')
    expect(maxText()).toContain('20')
  })

  it('should emit update:modelValue with the new values when the threshold changes', async () => {
    const { wrapper } = render()

    await wrapper.setProps({ threshold: { min: 10, max: 50 } })

    expect(wrapper.emitted('update:modelValue')).toEqual([[{ min: 10, max: 50 }]])
  })

  it('should update the rendered values when the modelValue changes within the threshold', async () => {
    const { wrapper, minText, maxText } = render()

    await wrapper.setProps({ modelValue: { min: 5, max: 30 } })
    await nextTick()

    expect(minText()).toContain('5')
    expect(maxText()).toContain('30')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('should emit threshold values when the modelValue is outside the threshold', async () => {
    const { wrapper } = render()

    // min value: -5 < threshold.min = 0
    await wrapper.setProps({ modelValue: { min: -5, max: 150 } })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([[{ min: 0, max: 100 }]])
  })

  it('should not emit when the modelValue does not change its values', async () => {
    const { wrapper } = render()

    await wrapper.setProps({ modelValue: { min: 10, max: 20 } })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
