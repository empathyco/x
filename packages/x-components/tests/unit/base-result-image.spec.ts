import { mount } from '@cypress/vue';
import 'reflect-metadata';
import Vue from 'vue';
import { Result } from '@empathyco/x-types';
import { createResultStub } from '../../src/__stubs__/results-stubs.factory';
import { mockedAdapter } from '../../src/adapter/mocked-adapter';
import BaseResultImage from '../../src/components/result/base-result-image.vue';
import { BaseXBus } from '../../src/plugins/x-bus';
import { XPlugin } from '../../src/plugins/x-plugin';

/**
 * Mounts a {@link BaseResultImage} component with the provided options.
 */
function mountBaseResultImage({ result }: RenderBaseResultImageOptions): void {
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
      vue: Vue.extend({}),
      plugins: [[new XPlugin(new BaseXBus()), { adapter: mockedAdapter }]],
      propsData: { result }
    }
  );
}

describe('testing Base Result Image component', () => {
  it('placeholder is replaced for an image', () => {
    const result = createResultStub('Result', {
      images: ['https://picsum.photos/seed/18/100/100', 'https://picsum.photos/seed/2/100/100']
    });
    mountBaseResultImage({ result });
    cy.getByDataTest('result-picture-image').should(
      'have.attr',
      'src',
      'https://picsum.photos/seed/18/100/100'
    );
    cy.getByDataTest('result-picture-fallback').should('not.exist');
  });

  it('placeholder is replaced for a fallback since there are no valid images', () => {
    const result = createResultStub('Result', {
      images: ['https://notexistsimage1.com', 'https://notexistsimage2.com']
    });
    mountBaseResultImage({ result });
    cy.getByDataTest('result-picture-fallback').should('exist');
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
    mountBaseResultImage({ result });
    cy.getByDataTest('result-picture-image').should(
      'have.attr',
      'src',
      'https://picsum.photos/seed/20/100/100'
    );
    cy.getByDataTest('result-picture-fallback').should('not.exist');
  });
});

interface RenderBaseResultImageOptions {
  result: Result;
}
