import type { Result } from '@empathyco/x-types'
import type { VNode } from 'vue'
import { h, ref } from 'vue'
import { createResultStub } from '../../src/__stubs__/results-stubs.factory'
import BaseResultImage from '../../src/components/result/base-result-image.vue'

function render(result: Result, showNextImageOnHover = false, rootVNode?: VNode) {
  cy.mount(
    () =>
      rootVNode ??
      h(
        BaseResultImage,
        {
          result,
          showNextImageOnHover,
          loadAnimation: 'span',
        },
        {
          placeholder: () =>
            h('div', {
              'data-test': 'result-picture-placeholder',
              style: 'padding-top: 100%; background-color: lightgray',
            }),
          fallback: () =>
            h('div', {
              'data-test': 'result-picture-fallback',
              style: 'padding-top: 100%; background-color: lightsalmon',
            }),
        },
      ),
  )

  return {
    getResultPicture: () => cy.getByDataTest('result-picture'),
    getResultPictureImage: () => cy.getByDataTest('result-picture-image'),
    getResultPictureFallback: () => cy.getByDataTest('result-picture-fallback'),
    getResultPicturePlaceholder: () => cy.getByDataTest('result-picture-placeholder'),
  }
}

describe.skip('testing Base Result Image component', () => {
  it('placeholder is replaced for an image', () => {
    const { getResultPictureImage, getResultPictureFallback, getResultPicturePlaceholder } = render(
      createResultStub('Result', {
        images: ['/img/test-image-1.jpeg', '/img/test-image-2.jpeg'],
      }),
    )

    // Loading
    getResultPicturePlaceholder().should('exist')
    getResultPictureImage().should('not.exist')

    // Success
    getResultPictureImage().should('have.attr', 'src', '/img/test-image-1.jpeg')
    getResultPicturePlaceholder().should('not.exist')
    getResultPictureFallback().should('not.exist')
  })

  it('placeholder is replaced for a fallback since there are no valid images', () => {
    const { getResultPictureFallback, getResultPicturePlaceholder, getResultPictureImage } = render(
      createResultStub('Result', {
        images: ['https://notexistsimage1.com', 'https://notexistsimage2.com'],
      }),
    )

    // Loading
    getResultPicturePlaceholder().should('exist')
    getResultPictureFallback().should('not.exist')

    // Loading failed
    getResultPictureFallback().should('exist')
    getResultPicturePlaceholder().should('not.exist')
    getResultPictureImage().should('not.exist')
  })

  it('placeholder is replaced for the last valid image', () => {
    const { getResultPictureImage, getResultPictureFallback, getResultPicturePlaceholder } = render(
      createResultStub('Result', {
        images: [
          'https://notexistsimage1.com',
          'https://notexistsimage2.com',
          'https://notexistsimage3.com',
          '/img/test-image-1.jpeg',
        ],
      }),
    )

    // Loading
    getResultPicturePlaceholder().should('exist')
    getResultPictureImage().should('not.exist')

    // Success
    getResultPictureImage().should('have.attr', 'src', '/img/test-image-1.jpeg')
    getResultPicturePlaceholder().should('not.exist')
    getResultPictureFallback().should('not.exist')
  })

  it('does not change the image on hover if `showNextImageOnHover` is false', () => {
    const { getResultPictureImage, getResultPicture } = render(
      createResultStub('Result', {
        images: ['/img/test-image-1.jpeg', '/img/test-image-2.jpeg'],
      }),
      false,
    )

    getResultPictureImage().should('have.attr', 'src', '/img/test-image-1.jpeg')
    getResultPicture().trigger('mouseenter')
    getResultPictureImage().should('not.have.attr', 'src', '/img/test-image-2.jpeg')
  })

  it('shows the next valid image on hover if `showNextImageOnHover` is true', () => {
    const { getResultPictureImage, getResultPicture } = render(
      createResultStub('Result', {
        images: ['/img/test-image-1.jpeg', 'https://notexistsimage1.com', '/img/test-image-2.jpeg'],
      }),
      true,
    )

    getResultPictureImage().should('have.attr', 'src', '/img/test-image-1.jpeg')
    getResultPicture().trigger('mouseenter')
    getResultPictureImage().should('have.attr', 'src', '/img/test-image-2.jpeg')
  })

  it('resets images state when `result` prop changes', () => {
    const result = ref(createResultStub('Result', { images: ['/img/test-image-1.jpeg'] }))
    const { getResultPictureImage } = render(
      result.value,
      false,
      h('div', [
        h(BaseResultImage, { result: result.value, loadAnimation: 'span' }),
        h(
          'button',
          {
            'data-test': 'button-images-change',
            onClick: () => (result.value.images = ['/img/test-image-2.jpeg']),
          },
          'Change result images',
        ),
      ]),
    )

    getResultPictureImage().should('have.attr', 'src', '/img/test-image-1.jpeg')
    cy.getByDataTest('button-images-change').trigger('click')
    getResultPictureImage().should('have.attr', 'src', '/img/test-image-2.jpeg')
  })
})
