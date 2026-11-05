import type { Result } from '@empathyco/x-types'
import { mount } from '@vue/test-utils'
import { createResultStub } from '@x/__stubs__'
import { CrossFade } from '../../animations'
import BaseResultImage from '../base-result-image.vue'

describe('testing BaseResultImage component', () => {
  const firstImage = 'https://picsum.photos/seed/1/200/300'
  const secondImage = 'https://picsum.photos/seed/2/200/300'
  const thirdImage = 'https://picsum.photos/seed/3/200/300'

  function createResult(images: string[]): Result {
    return createResultStub('Product 001', { images })
  }

  function render({
    props = {},
    slots = {},
    attrs = {},
  }: {
    props?: Record<string, unknown>
    slots?: Record<string, string>
    attrs?: Record<string, unknown>
  } = {}) {
    // CrossFade is used instead of the default NoAnimation: NoAnimation only renders the first
    // vnode of the slot, which in dev builds (where template comments are kept) is a comment,
    // hiding the placeholder/fallback/loaded branches.
    const wrapper = mount(BaseResultImage, {
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
      attrs,
    })
    return {
      wrapper,
      get loader() {
        return wrapper.find('[data-test="result-picture-loader"]')
      },
      get image() {
        return wrapper.find('[data-test="result-picture-image"]')
      },
      get picture() {
        return wrapper.find('[data-test="result-picture"]')
      },
      get placeholder() {
        return wrapper.find('[data-test="placeholder"]')
      },
      get fallback() {
        return wrapper.find('[data-test="fallback"]')
      },
    }
  }

  describe('basic rendering (backwards compatible behavior)', () => {
    it('does not render the image until it has been loaded', () => {
      const sut = render()

      expect(sut.loader.exists()).toBeTruthy()
      expect(sut.image.exists()).toBeFalsy()
      expect(sut.placeholder.exists()).toBeTruthy()
    })

    it('renders the result image once it has been loaded', async () => {
      const sut = render()

      expect(sut.loader.attributes('src')).toBe(firstImage)

      await sut.loader.trigger('load')

      expect(sut.loader.exists()).toBeFalsy()
      expect(sut.image.exists()).toBeTruthy()
      expect(sut.image.attributes('src')).toBe(firstImage)
      expect(sut.image.attributes('alt')).toBe('Product 001')
      expect(sut.image.classes()).toContain('x-result-picture-image')
    })

    it('renders the visible image without srcset, sizes and extra attributes when not provided', async () => {
      const sut = render()
      await sut.loader.trigger('load')

      expect(sut.image.attributes('srcset')).toBeFalsy()
      expect(sut.image.attributes('sizes')).toBeFalsy()
      expect(sut.image.attributes('decoding')).toBeFalsy()
      expect(sut.image.attributes('fetchpriority')).toBeFalsy()
      expect(sut.image.attributes('width')).toBeFalsy()
      expect(sut.image.attributes('height')).toBeFalsy()
      expect(sut.image.attributes('crossorigin')).toBeFalsy()
      expect(sut.image.attributes('referrerpolicy')).toBeFalsy()
    })

    it('uses lazy loading by default', () => {
      const sut = render()
      expect(sut.loader.attributes('loading')).toBe('lazy')
    })

    it('shows the fallback slot when all the images have failed', async () => {
      const sut = render({ props: { result: createResult([firstImage, secondImage]) } })

      await sut.loader.trigger('error')
      await sut.loader.trigger('error')

      expect(sut.loader.exists()).toBeFalsy()
      expect(sut.image.exists()).toBeFalsy()
      expect(sut.fallback.exists()).toBeTruthy()
    })

    it('resets the queue when the result images change', async () => {
      const sut = render()
      await sut.loader.trigger('load')
      expect(sut.image.attributes('src')).toBe(firstImage)

      await sut.wrapper.setProps({ result: createResult([thirdImage]) })

      expect(sut.image.exists()).toBeFalsy()
      expect(sut.placeholder.exists()).toBeTruthy()
      expect(sut.loader.attributes('src')).toBe(thirdImage)

      await sut.loader.trigger('load')
      expect(sut.image.attributes('src')).toBe(thirdImage)
    })
  })

  describe('fallback images queue', () => {
    it('tries the next image when the first one fails', async () => {
      const sut = render({ props: { result: createResult([firstImage, secondImage]) } })

      expect(sut.loader.attributes('src')).toBe(firstImage)

      await sut.loader.trigger('error')
      expect(sut.loader.attributes('src')).toBe(secondImage)

      await sut.loader.trigger('load')
      expect(sut.image.attributes('src')).toBe(secondImage)
    })

    it('emits image-error with the failed image', async () => {
      const sut = render({ props: { result: createResult([firstImage, secondImage]) } })

      await sut.loader.trigger('error')

      expect(sut.wrapper.emitted('imageError')).toHaveLength(1)
      expect(sut.wrapper.emitted('imageError')?.[0]).toEqual([
        { index: 0, src: firstImage, srcset: undefined },
      ])
    })
  })

  describe('hover image', () => {
    it('preloads the second image on hover and shows it while hovering', async () => {
      const sut = render({
        props: { result: createResult([firstImage, secondImage]), showNextImageOnHover: true },
      })

      await sut.loader.trigger('load')
      expect(sut.image.attributes('src')).toBe(firstImage)
      expect(sut.loader.exists()).toBeFalsy()

      await sut.picture.trigger('mouseenter')

      expect(sut.loader.exists()).toBeTruthy()
      expect(sut.loader.attributes('src')).toBe(secondImage)

      await sut.loader.trigger('load')
      expect(sut.image.attributes('src')).toBe(secondImage)

      await sut.picture.trigger('mouseleave')
      expect(sut.image.attributes('src')).toBe(firstImage)
    })
  })

  describe('srcset and sizes', () => {
    it('applies a single srcset string to the loader and the visible image', async () => {
      const srcset = 'image1-480.jpg 480w, image1-1024.jpg 1024w'
      const sut = render({ props: { srcset } })

      expect(sut.loader.attributes('srcset')).toBe(srcset)

      await sut.loader.trigger('load')
      expect(sut.image.attributes('srcset')).toBe(srcset)
    })

    it('applies the per-image srcset of a srcset array', async () => {
      const firstSrcset = 'first-480.jpg 480w, first-1024.jpg 1024w'
      const secondSrcset = 'second-480.jpg 480w, second-1024.jpg 1024w'
      const sut = render({
        props: {
          result: createResult([firstImage, secondImage]),
          srcset: [firstSrcset, secondSrcset],
          showNextImageOnHover: true,
        },
      })

      expect(sut.loader.attributes('srcset')).toBe(firstSrcset)

      await sut.loader.trigger('load')
      expect(sut.image.attributes('srcset')).toBe(firstSrcset)

      await sut.picture.trigger('mouseenter')
      expect(sut.loader.attributes('srcset')).toBe(secondSrcset)

      await sut.loader.trigger('load')
      expect(sut.image.attributes('srcset')).toBe(secondSrcset)
    })

    it('applies sizes to the loader and the visible image', async () => {
      const sizes = '(min-width: 600px) 33vw, 100vw'
      const sut = render({ props: { sizes } })

      expect(sut.loader.attributes('sizes')).toBe(sizes)

      await sut.loader.trigger('load')
      expect(sut.image.attributes('sizes')).toBe(sizes)
    })

    it('keeps the src as fallback when srcset is provided', async () => {
      const sut = render({ props: { srcset: 'image1-480.jpg 480w' } })

      expect(sut.loader.attributes('src')).toBe(firstImage)

      await sut.loader.trigger('load')
      expect(sut.image.attributes('src')).toBe(firstImage)
    })
  })

  describe('image attributes', () => {
    it('applies the loading prop to the loader', () => {
      const sut = render({ props: { loading: 'eager' } })
      expect(sut.loader.attributes('loading')).toBe('eager')
    })

    it('forwards additional img attributes to the loader and the visible image', async () => {
      const sut = render({
        props: {
          decoding: 'async',
          fetchPriority: 'high',
          crossorigin: 'anonymous',
          referrerPolicy: 'no-referrer',
          width: 256,
          height: 371,
        },
      })

      expect(sut.loader.attributes('decoding')).toBe('async')
      expect(sut.loader.attributes('fetchpriority')).toBe('high')
      expect(sut.loader.attributes('width')).toBe('256')
      expect(sut.loader.attributes('height')).toBe('371')

      await sut.loader.trigger('load')

      expect(sut.image.attributes('decoding')).toBe('async')
      expect(sut.image.attributes('fetchpriority')).toBe('high')
      expect(sut.image.attributes('crossorigin')).toBe('anonymous')
      expect(sut.image.attributes('referrerpolicy')).toBe('no-referrer')
      expect(sut.image.attributes('width')).toBe('256')
      expect(sut.image.attributes('height')).toBe('371')
    })

    it('does not forward consumer event listeners to the images', async () => {
      const onLoad = vi.fn()
      const sut = render({ attrs: { onLoad } })

      await sut.loader.trigger('load')

      expect(onLoad).not.toHaveBeenCalled()
      // The component's own loading logic still works
      expect(sut.image.exists()).toBeTruthy()
    })

    it('does not forward additional img attributes to the root element', () => {
      const sut = render({
        props: {
          decoding: 'async',
          fetchPriority: 'high',
          crossorigin: 'anonymous',
          referrerPolicy: 'no-referrer',
          width: 256,
          height: 371,
        },
      })

      expect(sut.picture.attributes('decoding')).toBeFalsy()
      expect(sut.picture.attributes('fetchpriority')).toBeFalsy()
      expect(sut.picture.attributes('crossorigin')).toBeFalsy()
      expect(sut.picture.attributes('referrerpolicy')).toBeFalsy()
      expect(sut.picture.attributes('width')).toBeFalsy()
      expect(sut.picture.attributes('height')).toBeFalsy()
    })

    it('keeps applying the consumer class and style to the root element', () => {
      const sut = render({ attrs: { class: 'custom-class', style: 'max-width: 200px' } })

      expect(sut.picture.classes()).toContain('custom-class')
      expect(sut.picture.attributes('style')).toContain('max-width: 200px')
    })
  })

  describe('events', () => {
    it('emits image-loaded with the loaded image information', async () => {
      const sut = render({ props: { result: createResult([firstImage, secondImage]) } })

      await sut.loader.trigger('load')

      const loaded = sut.wrapper.emitted('imageLoaded')
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
      const sut = render({ props: { result: createResult([firstImage, secondImage, thirdImage]) } })

      await sut.loader.trigger('error')
      await sut.loader.trigger('error')

      const errors = sut.wrapper.emitted('imageError')
      expect(errors).toHaveLength(2)
      expect(errors?.[0]).toEqual([{ index: 0, src: firstImage, srcset: undefined }])
      expect(errors?.[1]).toEqual([{ index: 1, src: secondImage, srcset: undefined }])
    })
  })
})
