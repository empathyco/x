import { mount } from '@cypress/vue';
import { Result } from '@empathyco/x-types';
import { createResultStub } from '../../src/__stubs__/results-stubs.factory';
import BaseResultImageHover from '../../src/components/result/base-result-image-hover.vue';

/**
 * Mounts a {@link BaseResultImageHover} component with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An API to test the component.
 */
function mountBaseResultImage({ result }: MountBaseResultImageOptions): MountBaseResultImageAPI {
  cy.viewport(1920, 200);
  mount(
    {
      components: {
        BaseResultImageHover
      },
      props: ['result'],
      template: `
        <div>
          <BaseResultImageHover :result="result" class="x-picture--colored">
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
          </BaseResultImageHover>
        </div>
      `
    },
    {
      propsData: { result }
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
      images: ['https://picsum.photos/seed/18/100/100', 'https://picsum.photos/seed/2/100/100']
    });
    const { getResultPictureImage, getResultPictureFallback, getResultPicturePlaceholder } =
      mountBaseResultImage({ result });
    // Loading
    getResultPicturePlaceholder().should('exist');
    getResultPictureImage().should('not.exist');
    // Success
    getResultPictureImage().should('have.attr', 'src', 'https://picsum.photos/seed/18/100/100');
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
        'https://picsum.photos/seed/20/100/100'
      ]
    });
    const { getResultPictureImage, getResultPictureFallback, getResultPicturePlaceholder } =
      mountBaseResultImage({ result });
    // Loading
    getResultPicturePlaceholder().should('exist');
    getResultPictureImage().should('not.exist');
    // Success
    getResultPictureImage().should('have.attr', 'src', 'https://picsum.photos/seed/20/100/100');
    getResultPicturePlaceholder().should('not.exist');
    getResultPictureFallback().should('not.exist');
  });

  it('shows the next valid image on hover', () => {
    const result = createResultStub('Result', {
      images: [
        'https://picsum.photos/seed/18/100/100',
        'https://notexistsimage1.com',
        'https://picsum.photos/seed/2/100/100'
      ]
    });

    const { getResultPictureImage, getResultPicture } = mountBaseResultImage({ result });
    getResultPictureImage().should('have.attr', 'src', 'https://picsum.photos/seed/18/100/100');
    getResultPicture().trigger('mouseenter');
    // It should have load the third image after the second one failed.
    getResultPictureImage().should('have.attr', 'src', 'https://picsum.photos/seed/2/100/100');
  });
});

interface MountBaseResultImageOptions {
  result: Result;
}

interface MountBaseResultImageAPI {
  getResultPicture: () => Cypress.Chainable<JQuery>;
  /** Gets the result picture image. */
  getResultPictureImage: () => Cypress.Chainable<JQuery>;
  /** Gets the result picture fallback. */
  getResultPictureFallback: () => Cypress.Chainable<JQuery>;
  /** Gets the result picture placeholder. */
  getResultPicturePlaceholder: () => Cypress.Chainable<JQuery>;
}
