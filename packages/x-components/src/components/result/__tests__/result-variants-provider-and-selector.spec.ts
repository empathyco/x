import type { Result } from '@empathyco/x-types'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { createResultStub } from '../../../__stubs__/index'
import { findTestDataById, getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins'
import ResultVariantSelector from '../result-variant-selector.vue'
import ResultVariantsProvider from '../result-variants-provider.vue'

const variants = [
  {
    name: 'red jacket',
    images: ['red-jacket-image'],
    variants: [{ name: 'red jacket XL' }, { name: 'red jacket L' }],
  },
  {
    name: 'blue jacket',
    variants: [
      {
        name: 'blue jacket L',
        variants: [
          { name: 'blue jacket L1' },
          { name: 'blue jacket L2' },
          { name: 'blue jacket L3' },
        ],
      },
      { name: 'blue jacket S' },
    ],
  },
]
const result = createResultStub('jacket', { variants })

const render = ({
  template = '<ResultVariantSelector/>',
  result = {},
  autoSelectDepth = Number.POSITIVE_INFINITY,
  queryPreviewHash = null as string | null,
} = {}) => {
  const resultComponent = defineComponent({
    components: {
      ResultVariantsProvider,
      ResultVariantSelector,
    },
    provide: {
      queryPreviewHash,
    },
    data() {
      return {
        result,
        autoSelectDepth,
      }
    },
    template: `
      <ResultVariantsProvider
        :result="result"
        :autoSelectDepth="autoSelectDepth"
        #default="{ result: newResult }">
        ${template}
      </ResultVariantsProvider>`,
  })

  const wrapper = mount(resultComponent, {
    global: { plugins: [installNewXPlugin()] },
  })

  return {
    wrapper: wrapper.findComponent(ResultVariantsProvider),
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
    findSelectorButtonByLevel: (level: number) =>
      findTestDataById(wrapper, 'variants-list')
        .at(level)
        ?.findAll(getDataTestSelector('variant-button')),
    findSelectorItemByLevel: (level: number) =>
      findTestDataById(wrapper, 'variants-list')
        .at(level)
        ?.findAll(getDataTestSelector('variant-item')),
    setResult: async (result: Result) => {
      ;(wrapper.vm as any).result = result
      return nextTick()
    },
  }
}

describe('results with variants', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('provider exposes the result in the default slot', () => {
    const template = `
      <span data-test="result-name">{{ newResult.name }}</span>`
    const result = createResultStub('tshirt')
    const { wrapper } = render({ result, template })

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toEqual('tshirt')
  })

  it('merges the selected and parent variants data with the result', async () => {
    const { wrapper, findSelectorButtonByLevel } = render({
      template: `
        <div>
          <ResultVariantSelector #variant-content="{variant}">
            {{variant.name}}
          </ResultVariantSelector>
          <ResultVariantSelector :level="1" #variant-content="{variant}">
            {{variant.name}}
          </ResultVariantSelector>
          <span data-test="result-name">{{ newResult.name }}</span>
          <span data-test="result-image" v-if="newResult.images">{{ newResult.images[0] }}</span>
        </div>`,
      result,
      autoSelectDepth: 0,
    })

    const firstLevelVariantButtons = findSelectorButtonByLevel(0)

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toEqual('jacket')
    expect(wrapper.find(getDataTestSelector('result-image')).text()).toEqual('')

    await firstLevelVariantButtons?.at(0)?.trigger('click')

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toEqual('red jacket')
    expect(wrapper.find(getDataTestSelector('result-image')).text()).toEqual('red-jacket-image')

    const secondLevelVariantButtons = findSelectorButtonByLevel(1)

    await secondLevelVariantButtons?.at(1)?.trigger('click')

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toEqual('red jacket L')
    expect(wrapper.find(getDataTestSelector('result-image')).text()).toEqual('red-jacket-image')

    // It won't deselect the child variant if the parent is clicked.

    await firstLevelVariantButtons?.at(0)?.trigger('click')

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toEqual('red jacket L')

    await firstLevelVariantButtons?.at(1)?.trigger('click')

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toEqual('blue jacket')
    expect(wrapper.find(getDataTestSelector('result-image')).text()).toEqual('')
  })

  it('keeps the original result unmodified', async () => {
    const { wrapper } = render({
      template: `
        <div>
          <ResultVariantSelector/>
          <span data-test="result-name">{{ newResult.name }}</span>
        </div>`,
      result,
      autoSelectDepth: 0,
    })

    const button = wrapper.find(getDataTestSelector('variant-button'))
    await button.trigger('click')

    expect(wrapper.find(getDataTestSelector('result-name')).text()).toEqual('red jacket')
    expect(result.name).toEqual('jacket')
  })

  it('emits UserSelectedAResultVariant event when a variant is selected', async () => {
    const { wrapper, emitSpy } = render({
      result,
      autoSelectDepth: 0,
    })

    const button = wrapper.find(getDataTestSelector('variant-button'))

    await button.trigger('click')

    expect(emitSpy).toHaveBeenCalledTimes(1)
    expect(emitSpy).toHaveBeenCalledWith(
      'UserSelectedAResultVariant',
      { result, variant: variants[0], level: 0, queryPreviewHash: null },
      expect.anything(),
    )
  })

  it('emits UserSelectedAResultVariant event when a variant from a query preview is selected', async () => {
    const { wrapper, emitSpy } = render({
      result,
      autoSelectDepth: 0,
      queryPreviewHash: 'abcd',
    })

    const button = wrapper.find(getDataTestSelector('variant-button'))

    await button.trigger('click')

    expect(emitSpy).toHaveBeenCalledTimes(1)
    expect(emitSpy).toHaveBeenCalledWith(
      'UserSelectedAResultVariant',
      { result, variant: variants[0], level: 0, queryPreviewHash: 'abcd' },
      expect.anything(),
    )
  })

  it('selects the first variant of all levels by default', () => {
    const { findSelectorItemByLevel } = render({
      template: `
        <div>
          <ResultVariantSelector :level="0"/>
          <ResultVariantSelector :level="1"/>
        </div>`,
      result,
    })

    const firstVariant = findSelectorItemByLevel(0)?.at(0)
    const secondSelectorFirstVariant = findSelectorItemByLevel(1)?.at(0)

    expect(firstVariant?.element.className).toContain('--is-selected')
    expect(secondSelectorFirstVariant?.element.className).toContain('--is-selected')
  })

  it('selects variants on init up to the level set in the autoSelectDepth prop', () => {
    const { findSelectorItemByLevel } = render({
      template: `
        <div>
          <ResultVariantSelector :level="0"/>
          <ResultVariantSelector :level="1"/>
        </div>`,
      result,
      autoSelectDepth: 1,
    })

    const firstVariant = findSelectorItemByLevel(0)?.at(0)
    const secondSelectorFirstVariant = findSelectorItemByLevel(1)?.at(0)

    expect(firstVariant?.element.className).toContain('--is-selected')
    expect(secondSelectorFirstVariant?.element.className).not.toContain('--is-selected')
  })

  it('wont select any variant by default if autoSelectDepth is 0', () => {
    const { wrapper } = render({
      result,
      autoSelectDepth: 0,
    })

    const firstVariant = wrapper.find(getDataTestSelector('variant-item'))

    expect(firstVariant.element.className).not.toContain('--is-selected')
  })

  it('does not emit the UserSelectedAResultVariant event when the variants are selected on init', () => {
    const { emitSpy } = render({ result })

    expect(emitSpy).not.toHaveBeenCalled()
  })

  it('reset the selected variants if the result changes', async () => {
    const { wrapper, setResult } = render({
      result,
      autoSelectDepth: 0,
    })
    const variantItem = wrapper.find(getDataTestSelector('variant-item'))
    const variantButton = variantItem.find(getDataTestSelector('variant-button'))

    await variantButton.trigger('click')

    expect(variantItem.element.className).toContain('--is-selected')

    await setResult(createResultStub('tshirt', { variants }))

    // Resets even if the same variants are passed.
    expect(variantItem.element.className).not.toContain('--is-selected')
  })

  describe('result variant selector', () => {
    it('renders the whole variant by default', () => {
      const { wrapper } = render({ result })
      const button = wrapper.find(getDataTestSelector('variant-button'))

      expect(JSON.parse(button.text())).toEqual(variants[0])
    })

    it('add selected class when a variant is selected', async () => {
      const className = 'x-result-variant-selector__item--is-selected'
      const { wrapper } = render({ result })

      const firstVariantButton = wrapper.find(getDataTestSelector('variant-button'))
      const variantWrappers = wrapper.findAll(getDataTestSelector('variant-item'))

      await firstVariantButton.trigger('click')

      expect(variantWrappers.at(0)?.element).toHaveClass(className)
      variantWrappers.slice(1).forEach(wrapper => {
        expect(wrapper.element.classList.contains(className)).toBe(false)
      })
    })

    it('renders all the variants of each level', async () => {
      const template = `
        <div>
          <ResultVariantSelector #variant-content="{variant}">
            <span data-test="variant-name">{{variant.name}}</span>
          </ResultVariantSelector>

          <ResultVariantSelector :level="1" #variant-content="{variant}">
            <span data-test="variant-name">{{variant.name}}</span>
          </ResultVariantSelector>

          <ResultVariantSelector :level="2" #variant-content="{variant}">
            <span data-test="variant-name">{{variant.name}}</span>
          </ResultVariantSelector>
        </div>`

      const { findSelectorButtonByLevel } = render({
        template,
        result,
      })

      const firstLevelVariantButtons = findSelectorButtonByLevel(0)

      expect(firstLevelVariantButtons).toHaveLength(2)
      expect(firstLevelVariantButtons?.at(0)?.text()).toEqual('red jacket')
      expect(firstLevelVariantButtons?.at(1)?.text()).toEqual('blue jacket')

      await firstLevelVariantButtons?.at(1)?.trigger('click')

      const secondLevelVariantButtons = findSelectorButtonByLevel(1)

      expect(secondLevelVariantButtons).toHaveLength(2)
      expect(secondLevelVariantButtons?.at(0)?.text()).toEqual('blue jacket L')
      expect(secondLevelVariantButtons?.at(1)?.text()).toEqual('blue jacket S')

      await secondLevelVariantButtons?.at(0)?.trigger('click')

      const thirdLevelVariantButtons = findSelectorButtonByLevel(2)

      expect(thirdLevelVariantButtons).toHaveLength(3)
      expect(thirdLevelVariantButtons?.at(0)?.text()).toEqual('blue jacket L1')
      expect(thirdLevelVariantButtons?.at(1)?.text()).toEqual('blue jacket L2')
      expect(thirdLevelVariantButtons?.at(1)?.text()).toEqual('blue jacket L2')
    })

    it('wont render if no result is injected', () => {
      const { wrapper } = render({
        result: {},
      })

      expect(wrapper.find(getDataTestSelector('variants-list')).exists()).toBeFalsy()
    })

    it('wont render if the provided result does not have variants', () => {
      const { wrapper } = render({
        result: createResultStub('jacket'),
      })

      expect(wrapper.find(getDataTestSelector('variants-list')).exists()).toBeFalsy()
    })

    it('exposes variants, selectedVariant and selectVariant in the default slot', async () => {
      const { wrapper } = render({
        template: `
          <ResultVariantSelector #default="{variants, selectedVariant, selectVariant}" >
            <div>
              <span v-if="selectedVariant" data-test="selected-variant">
                {{selectedVariant.name}}
              </span>
              <button
                  v-for="(variant, index) in variants"
                  data-test="variant"
                  :key="index"
                  :class="{'isSelected': variant === selectedVariant}"
                  @click="selectVariant(variant)">
                {{variant.name}}
              </button>
            </div>
          </ResultVariantSelector>`,
        result,
      })

      const variants = findTestDataById(wrapper, 'variant')

      expect(variants).toHaveLength(2)

      expect(variants.at(0)?.text()).toEqual('red jacket')
      expect(variants.at(1)?.text()).toEqual('blue jacket')

      await variants.at(0)?.trigger('click')

      expect(variants.at(0)?.element).toHaveClass('isSelected')
    })

    it('exposes variant, isSelected and selectVariant in the variant slot', async () => {
      const { wrapper } = render({
        template: `
          <ResultVariantSelector #variant="{variant, selectVariant, isSelected}">
            <button
                data-test="variant"
                @click="selectVariant"
                :class="{'isSelected': isSelected}">
              {{variant.name}}
            </button>
          </ResultVariantSelector>`,
        result,
      })

      const variants = findTestDataById(wrapper, 'variant')

      expect(variants).toHaveLength(2)

      expect(variants.at(0)?.text()).toEqual('red jacket')
      expect(variants.at(1)?.text()).toEqual('blue jacket')

      await variants.at(1)?.trigger('click')
      expect(variants.at(1)?.element).toHaveClass('isSelected')
    })

    it('exposes variant and isSelected in the variant-content slot', async () => {
      const { wrapper } = render({
        template: `
          <ResultVariantSelector #variant-content="{variant, isSelected}">
            {{variant.name}}<span v-if="isSelected"> SELECTED!</span>
          </ResultVariantSelector>`,
        result,
      })

      const variants = findTestDataById(wrapper, 'variant-button')

      expect(variants).toHaveLength(2)

      await variants.at(0)?.trigger('click')

      expect(variants.at(0)?.text()).toContain('red jacket SELECTED!')
      expect(variants.at(1)?.text()).toEqual('blue jacket')
    })
  })
})
