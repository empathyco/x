import { Result } from '@empathyco/x-types';
import { mount, WrapperArray } from '@vue/test-utils';
import { createResultStub } from '../../../__stubs__/results-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import { XComponentBusAPI } from '../../../plugins/x-plugin.types';
import BaseResultRating from '../base-result-rating.vue';

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
    clickRating: () => await wrapper.findComponent(BaseResultRating).trigger('click'),
    on: wrapper.vm.$x.on
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
    const { on, clickRating } = renderBaseResultRating({
      template: `<BaseResultRating :result="result" :max="10" />`,
      result
    });
    const eventListener = jest.fn();
    on('UserClickedAResultRating').subscribe(eventListener);

    await clickRating();
    expect(eventListener).toHaveBeenCalledWith(result);
  });
});

interface RenderBaseResultRatingOptions {
  template: string;
  result: Result;
}

interface RenderBaseResultRatingApi {
  getHtml: () => string;
  getFilledIcons: () => WrapperArray<Vue>;
  getEmptyIcons: () => WrapperArray<Vue>;
  clickRating: () => Promise<void>;
  on: XComponentBusAPI['on'];
}
