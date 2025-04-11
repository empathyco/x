import type { Banner as BannerModel } from '@empathyco/x-types'
import { createBannerStub } from '../../src/__stubs__/banners-stubs.factory'
import Banner from '../../src/x-modules/search/components/banner.vue'

const bannerBase: Partial<BannerModel> = {
  title: 'Search UIs',
  url: 'https://empathy.co',
  position: 1,
}

function render(banner = createBannerStub('banner', bannerBase)) {
  cy.mount(Banner, { props: { banner } })

  return {
    getBanner: () => cy.getByDataTest('banner'),
    getBannerImage: () => cy.getByDataTest('banner-image'),
  }
}

describe('testing Banner component', () => {
  it('banner renders if the image loads', () => {
    const { getBanner, getBannerImage } = render(
      createBannerStub('banner', { ...bannerBase, image: '/img/test-image-1.jpeg' }),
    )

    // Loading
    getBanner().should('exist')
    getBannerImage().should('exist')

    // Success
    getBanner().should('exist')
    getBannerImage().should('exist')
  })

  it('banner is not rendered if image load fails', () => {
    const { getBanner, getBannerImage } = render()

    // Loading
    getBanner().should('exist')
    getBannerImage().should('exist')

    // Error
    getBanner().should('not.exist')
  })
})
