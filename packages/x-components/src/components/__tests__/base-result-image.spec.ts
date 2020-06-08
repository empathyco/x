import { mount } from '@vue/test-utils';
import { getResultsStub } from '../../__stubs__/results-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils';
import BaseResultImage from '../base-result-image.vue';

describe('testing BaseResultImage component', () => {
  const result = getResultsStub()[0];
  const [, localVue] = installNewXPlugin();

  it('renders the content overriding placeholder', () => {
    const customResultImageWrapper = mount(BaseResultImage, {
      localVue,
      propsData: { result },
      scopedSlots: { ['placeholder']: '<span  data-test="result-figure-placeholder"/>' }
    });
    expect(
      customResultImageWrapper.find(getDataTestSelector('result-figure')).element
    ).toBeDefined();
    expect(
      customResultImageWrapper.find(getDataTestSelector('result-figure-placeholder')).element
    ).toBeDefined();
  });

  it('renders the content overriding fallback slot', async () => {
    const customResultImageWrapper = mount(BaseResultImage, {
      localVue,
      propsData: { result },
      scopedSlots: { ['fallback']: '<span  data-test="result-figure-fallback"/>' },
      data() {
        return {
          hasEnteredView: true
        };
      }
    });
    const image = customResultImageWrapper.get(getDataTestSelector('result-picture__image'));
    image.trigger('error');
    image.trigger('error');

    await localVue.nextTick();

    expect(
      customResultImageWrapper.find(getDataTestSelector('result-figure')).element
    ).toBeDefined();
    expect(
      customResultImageWrapper.find(getDataTestSelector('result-figure-fallback')).element
    ).toBeDefined();
  });

  it('checks that the result image is loaded overriding the two slots', async () => {
    const customResultImageWrapper = mount(BaseResultImage, {
      localVue,
      propsData: { result },
      scopedSlots: {
        ['placeholder']: '<span  data-test="result-figure-placeholder"/>',
        ['fallback']: '<span  data-test="result-figure-fallback"/>'
      },
      data() {
        return {
          hasEnteredView: true
        };
      }
    });

    expect(
      customResultImageWrapper.find(getDataTestSelector('result-figure-placeholder')).element
    ).toBeDefined();

    const image = customResultImageWrapper.get(getDataTestSelector('result-picture__image'));
    image.trigger('load');
    await localVue.nextTick();

    expect((customResultImageWrapper.vm as any).hasImageLoaded).toBeTruthy();
    expect(
      customResultImageWrapper.find(getDataTestSelector('result-figure-placeholder')).element
    ).not.toBeDefined();
  });
});
