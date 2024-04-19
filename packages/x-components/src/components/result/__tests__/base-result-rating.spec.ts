import { Result } from '@empathyco/x-types';
import { mount, WrapperArray } from '@vue/test-utils';
import { createResultStub } from '../../../__stubs__/results-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseResultRating from '../base-result-rating.vue';
import { XPlugin } from '../../../plugins/index';

const result = createResultStub('Product Test', {
  rating: {
    value: 2.5
  }
});

function renderBaseResultRating({
  template,
  result
}: RenderBaseResultRatingOptions): RenderBaseResultRatingApi {
  const [, localVue] = installNewXPlugin();

  const wrapper = mount(
    { template },
    {
      localVue,
      components: { BaseResultRating },
      data() {
        return {
          result
        };
      }
    }
  );

  return {
    getHtml: (): string => wrapper.html(),
    getFilledIcons: (): WrapperArray<Vue> =>
      wrapper.find(getDataTestSelector('rating-filled')).findAll(':scope > *'),
    getEmptyIcons: (): WrapperArray<Vue> =>
      wrapper.find(getDataTestSelector('rating-empty')).findAll(':scope > *'),
    clickRating: async () => {
      await wrapper.findComponent(BaseResultRating).trigger('click');
    }
  };
}

describe('testing BaserResultRating component', () => {
  it('renders the default icons a number of times based on the max prop', () => {
    const { getFilledIcons, getEmptyIcons } = renderBaseResultRating({
      template: `<BaseResultRating :result="result" :max="10" />`,
      result
    });
    expect(getEmptyIcons()).toHaveLength(10);
    expect(getFilledIcons()).toHaveLength(10);
  });

  it('renders the passed by slot icons a number of times based on the max prop', () => {
    const { getFilledIcons, getEmptyIcons } = renderBaseResultRating({
      template: `<BaseResultRating :result="result" :max="6" >
                  <template #empty-icon><span class="test-empty-icon" /></template>
                  <template #filled-icon><span class="test-filled-icon" /></template>
                 </BaseResultRating>`,
      result
    });
    expect(getFilledIcons().filter(w => w.classes('test-filled-icon'))).toHaveLength(6);
    expect(getEmptyIcons().filter(w => w.classes('test-empty-icon'))).toHaveLength(6);
  });

  it('does not render anything if result has no rating', () => {
    const resultWithNoRating = createResultStub('No Rating Result', { rating: undefined });

    const { getHtml } = renderBaseResultRating({
      template: `<BaseResultRating :result="result" :max="10" />`,
      result: resultWithNoRating
    });
    expect(getHtml()).toEqual('');
  });

  it('emits event when clicked with the result as payload', async () => {
    const { clickRating } = renderBaseResultRating({
      template: `<BaseResultRating :result="result" :max="10" />`,
      result
    });
    const eventListener = jest.fn();
    XPlugin.bus.on('UserClickedAResultRating').subscribe(eventListener);

    await clickRating();
    expect(eventListener).toHaveBeenCalledWith(result);
  });
});

interface RenderBaseResultRatingOptions {
  /** The template to render. */
  template: string;
  /** The result with the rating to be interacted with. */
  result: Result;
}

interface RenderBaseResultRatingApi {
  /** Retrieves the wrapper with the main html content. */
  getHtml: () => string;
  /** Retrieves the wrapper that matches the rating filled icons. */
  getFilledIcons: () => WrapperArray<Vue>;
  /** Retrieves the wrapper that matches the rating empty icons. */
  getEmptyIcons: () => WrapperArray<Vue>;
  /** Clicks the rating icons and waits for the view to update. */
  clickRating: () => Promise<void>;
}
