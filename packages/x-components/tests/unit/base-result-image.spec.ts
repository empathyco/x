import { mount } from '@cypress/vue';
import { Result } from '@empathyco/x-types';
import { createResultStub } from '../../src/__stubs__/results-stubs.factory';
import BaseResultImage from '../../src/components/result/base-result-image.vue';

/**
 * Mounts a {@link BaseResultImage} component with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An API to test the component.
 */
function mountBaseResultImage({
  result,
  showSecondImageOnHover = false
}: MountBaseResultImageOptions): MountBaseResultImageAPI {
  cy.viewport(1920, 200);
  mount(
    {
      components: {
        BaseResultImage
      },
      data() {
        return {
          result,
          showSecondImageOnHover
        };
      },
      template: `
        <div>
          <BaseResultImage
              :result="result"
              :showSecondImageOnHover="showSecondImageOnHover"
              class="x-picture--colored">
            <template #placeholder>
              <div data-test="result-picture-placeholder"
                  style="padding-top: 100%; background-color: lightgray"></div>
            </template>
            <template #fallback>
              <div
                data-test="result-picture-fallback"
                style="padding-top: 100%; background-color: lightsalmon"
              ></div>
            </template>
          </BaseResultImage>
        </div>
      `
    },
    {
      propsData: { result, showSecondImageOnHover }
    }
  );

  return {
    getResultPicture() {
      return cy.getByDataTest('result-picture');
    },
    getResultPictureImage() {
      return cy.getByDataTest('result-picture-image');
    },
    getResultPictureFallback() {
      return cy.getByDataTest('result-picture-fallback');
    },
    getResultPicturePlaceholder() {
      return cy.getByDataTest('result-picture-placeholder');
    }
  };
}

describe('testing Base Result Image component', () => {
  it('placeholder is replaced for an image', () => {
    const result = createResultStub('Result', {
      images: ['/img/test-image-1.jpeg', '/img/test-image-2.jpeg']
    });
    const { getResultPictureImage, getResultPictureFallback, getResultPicturePlaceholder } =
      mountBaseResultImage({ result });
    // Loading
    getResultPicturePlaceholder().should('exist');
    getResultPictureImage().should('not.exist');
    // Success
    getResultPictureImage().should('have.attr', 'src', '/img/test-image-1.jpeg');
    getResultPicturePlaceholder().should('not.exist');
    getResultPictureFallback().should('not.exist');
  });

  it('placeholder is replaced for a fallback since there are no valid images', () => {
    const result = createResultStub('Result', {
      images: ['https://notexistsimage1.com', 'https://notexistsimage2.com']
    });
    const { getResultPictureFallback, getResultPicturePlaceholder, getResultPictureImage } =
      mountBaseResultImage({
        result
      });
    // Loading
    getResultPicturePlaceholder().should('exist');
    getResultPictureFallback().should('not.exist');
    // Loading failed
    getResultPictureFallback().should('exist');
    getResultPicturePlaceholder().should('not.exist');
    getResultPictureImage().should('not.exist');
  });

  it('placeholder is replaced for the last valid image', () => {
    const result = createResultStub('Result', {
      images: [
        'https://notexistsimage1.com',
        'https://notexistsimage2.com',
        'https://notexistsimage3.com',
        '/img/test-image-1.jpeg'
      ]
    });
    const { getResultPictureImage, getResultPictureFallback, getResultPicturePlaceholder } =
      mountBaseResultImage({ result });
    // Loading
    getResultPicturePlaceholder().should('exist');
    getResultPictureImage().should('not.exist');
    // Success
    getResultPictureImage().should('have.attr', 'src', '/img/test-image-1.jpeg');
    getResultPicturePlaceholder().should('not.exist');
    getResultPictureFallback().should('not.exist');
  });

  it('does not change the image on hover if `showSecondImageOnHover` is false', () => {
    const result = createResultStub('Result', {
      images: ['/img/test-image-1.jpeg', '/img/test-image-2.jpeg']
    });
    const { getResultPictureImage, getResultPicture } = mountBaseResultImage({
      result,
      showSecondImageOnHover: false
    });
    getResultPictureImage().should('have.attr', 'src', '/img/test-image-1.jpeg');
    getResultPicture().trigger('mouseenter');
    // Setting this wait to make the test fail if we change showSecondImageOnHover
    // or the second image src.
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    getResultPictureImage().should('not.have.attr', 'src', '/img/test-image-2.jpeg');
  });

  it('shows the next valid image on hover if `showSecondImageOnHover` is true', () => {
    const result = createResultStub('Result', {
      images: ['/img/test-image-1.jpeg', 'https://notexistsimage1.com', '/img/test-image-2.jpeg']
    });

    const { getResultPictureImage, getResultPicture } = mountBaseResultImage({
      result,
      showSecondImageOnHover: true
    });
    getResultPictureImage().should('have.attr', 'src', '/img/test-image-1.jpeg');
    getResultPicture().trigger('mouseenter');
    // It should have load the third image after the second one failed.
    getResultPictureImage().should('have.attr', 'src', '/img/test-image-2.jpeg');
  });
});

interface MountBaseResultImageOptions {
  result: Result;
  showSecondImageOnHover?: boolean;
}

interface MountBaseResultImageAPI {
  /** Gets the result picture image. */
  getResultPicture: () => Cypress.Chainable<JQuery>;
  /** Gets the result picture image. */
  getResultPictureImage: () => Cypress.Chainable<JQuery>;
  /** Gets the result picture fallback. */
  getResultPictureFallback: () => Cypress.Chainable<JQuery>;
  /** Gets the result picture placeholder. */
  getResultPicturePlaceholder: () => Cypress.Chainable<JQuery>;
}
