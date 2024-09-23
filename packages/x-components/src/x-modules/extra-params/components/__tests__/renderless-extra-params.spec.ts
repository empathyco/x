import { Dictionary } from '@empathyco/x-utils';
import { mount } from '@vue/test-utils';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { WirePayload } from '../../../../wiring';
import { extraParamsXModule } from '../../x-module';
import RenderlessExtraParam from '../renderless-extra-param.vue';
import { resetXExtraParamStateWith } from './utils';

function render({ template = `<RenderlessExtraParam :name="name" />`, name = 'warehouse' } = {}) {
  const wrapper = mount(
    {
      template,
      components: {
        RenderlessExtraParam
      },
      data: () => ({ name })
    },
    {
      global: {
        plugins: [installNewXPlugin({ initialXModules: [extraParamsXModule] })]
      }
    }
  );

  return {
    wrapper: wrapper.findComponent(RenderlessExtraParam)
  };
}

describe('testing RenderlessExtraParam component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = render({});

    expect(isXComponent(wrapper.vm)).toBeTruthy();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('extraParams');
  });

  it("doesn't emit ExtraParamsProvided event when the component receives a default value if it's in the store", () => {
    const extraParamsProvidedCallback = jest.fn();
    render();
    XPlugin.bus.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);

    resetXExtraParamStateWith(XPlugin.store, { params: { warehouse: 1234 } });
    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(0);
  });

  it('emits UserChangedExtraParams event when the update method is called', () => {
    const userChangedExtraParamsCallback = jest.fn();
    const { wrapper } = render({
      template: `
        <RenderlessExtraParam name="warehouse" #default="{ defaultValue, updateValue }">
          <button data-test="custom-slot" @click="updateValue(45678)">Update warehouse</button>
        </RenderlessExtraParam>`
    });

    XPlugin.bus.on('UserChangedExtraParams', true).subscribe(userChangedExtraParamsCallback);

    expect(userChangedExtraParamsCallback).toHaveBeenCalledTimes(0);
    wrapper.find(getDataTestSelector('custom-slot')).trigger('click');

    expect(userChangedExtraParamsCallback).toHaveBeenCalledWith<[WirePayload<Dictionary<unknown>>]>(
      {
        eventPayload: { warehouse: 45678 },
        metadata: { moduleName: 'extraParams', location: 'none', replaceable: true }
      }
    );

    expect(userChangedExtraParamsCallback).toHaveBeenCalledTimes(1);
  });
});
