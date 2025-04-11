import { mount } from '@vue/test-utils'
import { getDataTestSelector } from '../../__tests__/utils'
import AutoProgressBar from '../auto-progress-bar.vue'

function render({ durationInSeconds = 1, isLoading = true } = {}) {
  const wrapper = mount({
    components: { AutoProgressBar },
    data: () => ({ durationInSeconds, isLoading }),
    template: '<AutoProgressBar :durationInSeconds="durationInSeconds" :isLoading="isLoading"/>',
  })

  return {
    wrapper,
    getProgressBarEl: () => wrapper.find(getDataTestSelector('progress-bar')),
    getProgressBarLineEl: () => wrapper.find(getDataTestSelector('progress-bar-line')),
  }
}

describe('testing AutoProgressBar component', () => {
  it('renders a progress bar component', () => {
    const { getProgressBarEl } = render()

    expect(getProgressBarEl().exists()).toBe(true)
  })

  it("doesn't render a progress bar component when is not loading", async () => {
    const { wrapper, getProgressBarEl } = render()

    expect(getProgressBarEl().exists()).toBe(true)

    await wrapper.setData({ isLoading: false })

    expect(getProgressBarEl().exists()).toBe(false)
  })

  it('render a progress bar component with an animation', () => {
    const { getProgressBarLineEl } = render({ durationInSeconds: 2.5 })

    expect(getProgressBarLineEl().attributes().style).toBe('animation-duration: 2.5s;')
  })
})
