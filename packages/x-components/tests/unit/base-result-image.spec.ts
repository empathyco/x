import { mount } from '@cypress/vue';
import 'reflect-metadata';
import { Result } from '@empathyco/x-types';
import { createResultStub } from '../../src/__stubs__/results-stubs.factory';
import BaseResultImage from '../../src/components/result/base-result-image.vue';

/**
 * Mounts a {@link BaseResultImage} component with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An API to test the component.
 */
function mountBaseResultImage({ result }: MountBaseResultImageOptions): MountBaseResultImageAPI {
  cy.viewport(1920, 200);
  mount(
    {
      components: {
        BaseResultImage
      },
      props: ['result'],
      template: `
        <div>
          <BaseResultImage :result="result" class="x-picture--colored">
            <template #placeholder>
              <div style="padding-top: 100%; background-color: lightgray"></div>
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
      propsData: { result }
    }
  );

  return {
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
    getResultPicturePlaceholder()
      .should('exist')
      .then(() => {
        getResultPictureImage().should('have.attr', 'src', 'https://picsum.photos/seed/18/100/100');
        getResultPictureFallback().should('not.exist');
      });
  });

  it('placeholder is replaced for a fallback since there are no valid images', () => {
    const result = createResultStub('Result', {
      images: ['https://notexistsimage1.com', 'https://notexistsimage2.com']
    });
    const { getResultPictureFallback, getResultPicturePlaceholder } = mountBaseResultImage({
      result
    });
    getResultPicturePlaceholder()
      .should('exist')
      .then(() => {
        getResultPictureFallback().should('exist');
      });
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
    getResultPicturePlaceholder()
      .should('exist')
      .then(() => {
        getResultPictureImage().should('have.attr', 'src', 'https://picsum.photos/seed/20/100/100');
        getResultPictureFallback().should('not.exist');
      });
  });
});

interface MountBaseResultImageOptions {
  result: Result;
}

interface MountBaseResultImageAPI {
  /** Gets the result picture image. */
  getResultPictureImage: () => Cypress.Chainable<JQuery>;
  /** Gets the result picture fallback. */
  getResultPictureFallback: () => Cypress.Chainable<JQuery>;
  /** Gets the result picture placeholder. */
  getResultPicturePlaceholder: () => Cypress.Chainable<JQuery>;
}
