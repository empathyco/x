import type { Result } from '@empathyco/x-types'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { createResultStub } from '../../../__stubs__/results-stubs.factory'
import { CrossFade } from '../../animations'
import BaseResultImage from '../base-result-image.vue'

describe('testing BaseResultImage component', () => {
  const firstImage = 'https://picsum.photos/seed/1/200/300'
  const secondImage = 'https://picsum.photos/seed/2/200/300'
  const thirdImage = 'https://picsum.photos/seed/3/200/300'

  function createResult(images: string[]): Result {
    return createResultStub('Product 001', { images })
  }

  function mountImage(
    props: Record<string, unknown> = {},
    slots: Record<string, string> = {},
  ): VueWrapper {
    // CrossFade is used instead of the default NoAnimation: NoAnimation only renders the first
    // vnode of the slot, which in dev builds (where template comments are kept) is a comment,
    // hiding the placeholder/fallback/loaded branches.
    return mount(BaseResultImage, {
      props: {
        result: createResult([firstImage]),
        loadAnimation: CrossFade,
        ...props,
      },
      slots: {
        placeholder: '<span data-test="placeholder">placeholder</span>',
        fallback: '<span data-test="fallback">fallback</span>',
        ...slots,
      },
    })
  }

  function findLoader(wrapper: VueWrapper) {
    return wrapper.find('[data-test="result-picture-loader"]')
  }

  function findImage(wrapper: VueWrapper) {
    return wrapper.find('[data-test="result-picture-image"]')
  }

  function findPicture(wrapper: VueWrapper) {
    // The root div, triggered explicitly: in dev builds the leading template comments make the
    // component root a fragment, so wrapper.trigger() would not reach the div.
    return wrapper.find('[data-test="result-picture"]')
  }

  describe('basic rendering (backwards compatible behavior)', () => {
    it('does not render the image until it has been loaded', () => {
      const wrapper = mountImage()

      expect(findLoader(wrapper).exists()).toBe(true)
      expect(findImage(wrapper).exists()).toBe(false)
      expect(wrapper.find('[data-test="placeholder"]').exists()).toBe(true)
    })

    it('renders the result image once it has been loaded', async () => {
      const wrapper = mountImage()

      expect(findLoader(wrapper).attributes('src')).toBe(firstImage)

      await findLoader(wrapper).trigger('load')

      expect(findLoader(wrapper).exists()).toBe(false)
      const image = findImage(wrapper)
      expect(image.exists()).toBe(true)
      expect(image.attributes('src')).toBe(firstImage)
      expect(image.attributes('alt')).toBe('Product 001')
      expect(image.classes()).toContain('x-result-picture-image')
    })

    it('renders the visible image without srcset, sizes and extra attributes when not provided', async () => {
      const wrapper = mountImage()
      await findLoader(wrapper).trigger('load')

      const image = findImage(wrapper)
      expect(image.attributes('srcset')).toBeUndefined()
      expect(image.attributes('sizes')).toBeUndefined()
      expect(image.attributes('decoding')).toBeUndefined()
      expect(image.attributes('fetchpriority')).toBeUndefined()
      expect(image.attributes('width')).toBeUndefined()
      expect(image.attributes('height')).toBeUndefined()
      expect(image.attributes('crossorigin')).toBeUndefined()
      expect(image.attributes('referrerpolicy')).toBeUndefined()
    })

    it('uses lazy loading by default', () => {
      const wrapper = mountImage()
      expect(findLoader(wrapper).attributes('loading')).toBe('lazy')
    })

    it('shows the fallback slot when all the images have failed', async () => {
      const wrapper = mountImage({ result: createResult([firstImage, secondImage]) })

      await findLoader(wrapper).trigger('error')
      await findLoader(wrapper).trigger('error')

      expect(findLoader(wrapper).exists()).toBe(false)
      expect(findImage(wrapper).exists()).toBe(false)
      expect(wrapper.find('[data-test="fallback"]').exists()).toBe(true)
    })

    it('resets the queue when the result images change', async () => {
      const wrapper = mountImage()
      await findLoader(wrapper).trigger('load')
      expect(findImage(wrapper).attributes('src')).toBe(firstImage)

      await wrapper.setProps({ result: createResult([thirdImage]) })

      expect(findImage(wrapper).exists()).toBe(false)
      expect(wrapper.find('[data-test="placeholder"]').exists()).toBe(true)
      expect(findLoader(wrapper).attributes('src')).toBe(thirdImage)

      await findLoader(wrapper).trigger('load')
      expect(findImage(wrapper).attributes('src')).toBe(thirdImage)
    })
  })

  describe('fallback images queue', () => {
    it('tries the next image when the first one fails', async () => {
      const wrapper = mountImage({ result: createResult([firstImage, secondImage]) })

      expect(findLoader(wrapper).attributes('src')).toBe(firstImage)

      await findLoader(wrapper).trigger('error')
      expect(findLoader(wrapper).attributes('src')).toBe(secondImage)

      await findLoader(wrapper).trigger('load')
      expect(findImage(wrapper).attributes('src')).toBe(secondImage)
    })

    it('emits image-error with the failed image', async () => {
      const wrapper = mountImage({ result: createResult([firstImage, secondImage]) })

      await findLoader(wrapper).trigger('error')

      expect(wrapper.emitted('imageError')).toHaveLength(1)
      expect(wrapper.emitted('imageError')?.[0]).toEqual([
        { index: 0, src: firstImage, srcset: undefined },
      ])
    })
  })

  describe('hover image', () => {
    it('preloads the second image on hover and shows it while hovering', async () => {
      const wrapper = mountImage({
        result: createResult([firstImage, secondImage]),
        showNextImageOnHover: true,
      })

      await findLoader(wrapper).trigger('load')
      expect(findImage(wrapper).attributes('src')).toBe(firstImage)
      expect(findLoader(wrapper).exists()).toBe(false)

      await findPicture(wrapper).trigger('mouseenter')

      expect(findLoader(wrapper).exists()).toBe(true)
      expect(findLoader(wrapper).attributes('src')).toBe(secondImage)

      await findLoader(wrapper).trigger('load')
      expect(findImage(wrapper).attributes('src')).toBe(secondImage)

      await findPicture(wrapper).trigger('mouseleave')
      expect(findImage(wrapper).attributes('src')).toBe(firstImage)
    })
  })

  describe('srcset and sizes', () => {
    it('applies a single srcset string to the loader and the visible image', async () => {
      const srcset = 'image1-480.jpg 480w, image1-1024.jpg 1024w'
      const wrapper = mountImage({ srcset })

      expect(findLoader(wrapper).attributes('srcset')).toBe(srcset)

      await findLoader(wrapper).trigger('load')
      expect(findImage(wrapper).attributes('srcset')).toBe(srcset)
    })

    it('applies the per-image srcset of a srcset array', async () => {
      const firstSrcset = 'first-480.jpg 480w, first-1024.jpg 1024w'
      const secondSrcset = 'second-480.jpg 480w, second-1024.jpg 1024w'
      const wrapper = mountImage({
        result: createResult([firstImage, secondImage]),
        srcset: [firstSrcset, secondSrcset],
        showNextImageOnHover: true,
      })

      expect(findLoader(wrapper).attributes('srcset')).toBe(firstSrcset)

      await findLoader(wrapper).trigger('load')
      expect(findImage(wrapper).attributes('srcset')).toBe(firstSrcset)

      await findPicture(wrapper).trigger('mouseenter')
      expect(findLoader(wrapper).attributes('srcset')).toBe(secondSrcset)

      await findLoader(wrapper).trigger('load')
      expect(findImage(wrapper).attributes('srcset')).toBe(secondSrcset)
    })

    it('applies sizes to the loader and the visible image', async () => {
      const sizes = '(min-width: 600px) 33vw, 100vw'
      const wrapper = mountImage({ sizes })

      expect(findLoader(wrapper).attributes('sizes')).toBe(sizes)

      await findLoader(wrapper).trigger('load')
      expect(findImage(wrapper).attributes('sizes')).toBe(sizes)
    })

    it('keeps the src as fallback when srcset is provided', async () => {
      const wrapper = mountImage({ srcset: 'image1-480.jpg 480w' })

      expect(findLoader(wrapper).attributes('src')).toBe(firstImage)

      await findLoader(wrapper).trigger('load')
      expect(findImage(wrapper).attributes('src')).toBe(firstImage)
    })
  })

  describe('image attributes', () => {
    it('applies the loading prop to the loader', () => {
      const wrapper = mountImage({ loading: 'eager' })
      expect(findLoader(wrapper).attributes('loading')).toBe('eager')
    })

    it('forwards additional img attributes to the loader and the visible image', async () => {
      const wrapper = mountImage({
        decoding: 'async',
        fetchPriority: 'high',
        crossorigin: 'anonymous',
        referrerPolicy: 'no-referrer',
        width: 256,
        height: 371,
      })

      const loader = findLoader(wrapper)
      expect(loader.attributes('decoding')).toBe('async')
      expect(loader.attributes('fetchpriority')).toBe('high')
      expect(loader.attributes('width')).toBe('256')
      expect(loader.attributes('height')).toBe('371')

      await loader.trigger('load')

      const image = findImage(wrapper)
      expect(image.attributes('decoding')).toBe('async')
      expect(image.attributes('fetchpriority')).toBe('high')
      expect(image.attributes('crossorigin')).toBe('anonymous')
      expect(image.attributes('referrerpolicy')).toBe('no-referrer')
      expect(image.attributes('width')).toBe('256')
      expect(image.attributes('height')).toBe('371')
    })

    it('does not forward consumer event listeners to the images', async () => {
      const onLoad = vi.fn()
      const wrapper = mount(BaseResultImage, {
        props: { result: createResult([firstImage]), loadAnimation: CrossFade },
        attrs: { onLoad },
      })

      await findLoader(wrapper).trigger('load')

      expect(onLoad).not.toHaveBeenCalled()
      // The component's own loading logic still works
      expect(findImage(wrapper).exists()).toBe(true)
    })
  })

  describe('events', () => {
    it('emits image-loaded with the loaded image information', async () => {
      const wrapper = mountImage({ result: createResult([firstImage, secondImage]) })

      await findLoader(wrapper).trigger('load')

      const loaded = wrapper.emitted('imageLoaded')
      expect(loaded).toHaveLength(1)
      const [payload] = loaded?.[0] as [
        {
          index: number
          src: string
          currentSrc: string
          element: HTMLImageElement
        },
      ]
      expect(payload.index).toBe(0)
      expect(payload.src).toBe(firstImage)
      expect(typeof payload.currentSrc).toBe('string')
      expect(payload.currentSrc.length).toBeGreaterThan(0)
      expect(payload.element).toBeInstanceOf(HTMLImageElement)
    })

    it('emits image-error for every failed image', async () => {
      const wrapper = mountImage({ result: createResult([firstImage, secondImage, thirdImage]) })

      await findLoader(wrapper).trigger('error')
      await findLoader(wrapper).trigger('error')

      const errors = wrapper.emitted('imageError')
      expect(errors).toHaveLength(2)
      expect(errors?.[0]).toEqual([{ index: 0, src: firstImage, srcset: undefined }])
      expect(errors?.[1]).toEqual([{ index: 1, src: secondImage, srcset: undefined }])
    })
  })
})
