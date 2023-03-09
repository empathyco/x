import { mount } from 'cypress/vue2';
import { Banner as BannerModel } from '@empathyco/x-types';
import Banner from '../../src/x-modules/search/components/banner.vue';
import { createBannerStub } from '../../src/__stubs__/index';

/**
 * Mounts a {@link Banner} component with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An API to test the component.
 */
function mountBanner({
  banner,
  template = `
        <div>
          <Banner :banner="banner"/>
        </div>
      `
}: MountBannerOptions): MountBannerAPI {
  cy.viewport(1920, 200);
  mount({
    components: {
      Banner
    },
    data() {
      return {
        banner
      };
    },
    template
  });

  return {
    getBanner() {
      return cy.getByDataTest('banner');
    },
    getBannerImage() {
      return cy.getByDataTest('banner-image');
    }
  };
}

describe('testing Banner component', () => {
  it('banner renders if the image loads', () => {
    const { getBanner, getBannerImage } = mountBanner({
      banner: createBannerStub('banner', {
        title: 'Search UIs',
        url: 'https://empathy.co',
        position: 1,
        image: '/img/test-image-1.jpeg'
      })
    });
    // Loading
    getBanner().should('exist');
    getBannerImage().should('exist');

    // Success
    getBanner().should('exist');
    getBannerImage().should('exist');
  });

  it('banner is not rendered if image load fails', () => {
    const { getBanner, getBannerImage } = mountBanner({
      banner: createBannerStub('banner', {
        title: 'Search UIs',
        url: 'https://empathy.co',
        position: 1
      })
    });
    // Loading
    getBanner().should('exist');
    getBannerImage().should('exist');

    // Error
    getBanner().should('not.exist');
  });
});

interface MountBannerOptions {
  /** The banner data. */
  banner?: BannerModel;
  /** The template to be rendered. */
  template?: string;
}

interface MountBannerAPI {
  getBanner: () => Cypress.Chainable<JQuery>;
  getBannerImage: () => Cypress.Chainable<JQuery>;
}
