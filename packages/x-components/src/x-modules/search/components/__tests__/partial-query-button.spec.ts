import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import PartialQueryButton from '../partial-query-button.vue';

function renderPartialQueryButton({
  template = `<PartialQueryButton :query="query" />`,
  query = ''
}: RenderPartialQueryButtonOptions = {}): RenderPartialQueryButtonAPI {
  const [, localVue] = installNewXPlugin();

  const wrapper = mount(
    {
      components: {
        PartialQueryButton
      },
      props: ['query'],
      template
    },
    {
      localVue,
      propsData: {
        query
      }
    }
  );

  const partialQueryButtonWrapper = wrapper.findComponent(PartialQueryButton);

  return {
    partialQueryButtonWrapper,
    async click() {
      await wrapper.trigger('click');
    }
  };
}

describe('testing PartialQueryButton component', () => {
  it('is an XComponent', () => {
    const { partialQueryButtonWrapper } = renderPartialQueryButton();
    expect(isXComponent(partialQueryButtonWrapper.vm)).toEqual(true);
  });
  it('has Search as XModule', () => {
    const { partialQueryButtonWrapper } = renderPartialQueryButton();
    expect(getXComponentXModuleName(partialQueryButtonWrapper.vm)).toEqual('search');
  });
  it('renders the default partial query', () => {
    const { partialQueryButtonWrapper } = renderPartialQueryButton({
      query: 'lego'
    });

    expect(partialQueryButtonWrapper.find(getDataTestSelector('partial-query-button')).text()).toBe(
      'lego'
    );
  });
  it('renders a custom partial query', () => {
    const { partialQueryButtonWrapper } = renderPartialQueryButton({
      query: 'lego',
      template: `
      <PartialQueryButton :query="query" >
        <template #default="{ query }">
          <span data-test="partial-query-button__text" class="x-partial-query-button__text">
            Set this partial query {{ query }} as the new query.
          </span>
        </template>
      </PartialQueryButton>`
    });

    expect(
      partialQueryButtonWrapper.find(getDataTestSelector('partial-query-button__text')).text()
    ).toBe('Set this partial query lego as the new query.');
  });
  // eslint-disable-next-line max-len
  it('emits the UserAcceptedAQuery and UserClickedPartialQuery events when the button is clicked', () => {
    const userAcceptedAQuery = jest.fn();
    const UserClickedPartialQuery = jest.fn();
    const query = 'coche';
    const { partialQueryButtonWrapper, click } = renderPartialQueryButton({
      query
    });
    const $x = partialQueryButtonWrapper.vm.$x;

    $x.on('UserAcceptedAQuery').subscribe(userAcceptedAQuery);
    $x.on('UserClickedPartialQuery').subscribe(UserClickedPartialQuery);

    click();

    expect(userAcceptedAQuery).toHaveBeenNthCalledWith(1, query);
    expect(UserClickedPartialQuery).toHaveBeenNthCalledWith(1, query);
  });
});

interface RenderPartialQueryButtonOptions {
  /** The template to be rendered. */
  template?: string;
  /** The query property. */
  query?: string;
}

interface RenderPartialQueryButtonAPI {
  /** The wrapper of the button element.*/
  partialQueryButtonWrapper: Wrapper<Vue>;
  /** Clicks the event button and waits for the view to update. */
  click: () => Promise<void>;
}
