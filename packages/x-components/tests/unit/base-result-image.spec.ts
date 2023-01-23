import { mount } from 'cypress/vue2';
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
  showNextImageOnHover = false,
  template = `
        <div>
          <BaseResultImage
              :result="result"
              :showNextImageOnHover="showNextImageOnHover"
              class="x-picture x-picture-overlay x-bg-neutral-50/60">
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
}: MountBaseResultImageOptions): MountBaseResultImageAPI {
  cy.viewport(1920, 200);
  mount({
    components: {
      BaseResultImage
    },
    data() {
      return {
        result,
        showNextImageOnHover
      };
    },
    template
  });

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

  it('does not change the image on hover if `showNextImageOnHover` is false', () => {
    const result = createResultStub('Result', {
      images: ['/img/test-image-1.jpeg', '/img/test-image-2.jpeg']
    });
    const { getResultPictureImage, getResultPicture } = mountBaseResultImage({
      result,
      showNextImageOnHover: false
    });
    getResultPictureImage().should('have.attr', 'src', '/img/test-image-1.jpeg');
    getResultPicture().trigger('mouseenter');
    // Setting this wait to make the test fail if we change showNextImageOnHover
    // or the second image src.
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    getResultPictureImage().should('not.have.attr', 'src', '/img/test-image-2.jpeg');
  });

  it('shows the next valid image on hover if `showNextImageOnHover` is true', () => {
    const result = createResultStub('Result', {
      images: ['/img/test-image-1.jpeg', 'https://notexistsimage1.com', '/img/test-image-2.jpeg']
    });

    const { getResultPictureImage, getResultPicture } = mountBaseResultImage({
      result,
      showNextImageOnHover: true
    });
    getResultPictureImage().should('have.attr', 'src', '/img/test-image-1.jpeg');
    getResultPicture().trigger('mouseenter');
    // It should have load the third image after the second one failed.
    getResultPictureImage().should('have.attr', 'src', '/img/test-image-2.jpeg');
  });

  it('resets images state when `result` prop changes', () => {
    const result = createResultStub('Result', { images: ['/img/test-image-1.jpeg'] });

    cy.viewport(1920, 200);
    const { getResultPictureImage } = mountBaseResultImage({
      result,
      template: `
        <div>
          <BaseResultImage :result="result" />
          <button @click="result.images = ['/img/test-image-2.jpeg']"
                  data-test="button-images-change">
            Change result images
          </button>
        </div>
      `
    });
    getResultPictureImage().should('have.attr', 'src', '/img/test-image-1.jpeg');
    cy.getByDataTest('button-images-change').trigger('click');
    getResultPictureImage().should('have.attr', 'src', '/img/test-image-2.jpeg');
  });
});

interface MountBaseResultImageOptions {
  result: Result;
  showNextImageOnHover?: boolean;
  template?: string;
}

interface MountBaseResultImageAPI {
  /** Gets the result picture container. */
  getResultPicture: () => Cypress.Chainable<JQuery>;
  /** Gets the result picture image. */
  getResultPictureImage: () => Cypress.Chainable<JQuery>;
  /** Gets the result picture fallback. */
  getResultPictureFallback: () => Cypress.Chainable<JQuery>;
  /** Gets the result picture placeholder. */
  getResultPicturePlaceholder: () => Cypress.Chainable<JQuery>;
}
