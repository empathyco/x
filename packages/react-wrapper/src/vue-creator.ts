import Vue from 'vue';
import { ReactWrapper } from './react-wrapper';
import {
  ReactNodeWithoutRenderProps,
  ReactRenderProps,
  ReactWrapperProps,
  VueSlots
} from './react-wrapper.types';
import { VueChildrenWrapper } from './vue-children-wrapper';
import { getVueComponentProps, isScopedSlot } from './vue-creator.utils';

/**
 * Stores the Vue constructor extending its interface with the methods required to map React
 * slots into Vue ones.
 */
export const VueExtended = Vue.extend({
  methods: {
    /**
     * Maps React children and slots props to the valid Vue children and scopedSlots.
     *
     * @param reactProps - React wrapper props with the slots and children ones.
     * @returns The Vue slots.
     */
    mapSlots(reactProps: ReactWrapperProps): VueSlots {
      const slots = reactProps.slots ?? {};
      if (reactProps.children) {
        // `children` is the default prop name for React slots
        slots.default = reactProps.children;
      }

      /*
       * Divide the slots into the two groups that Vue has: scoped slots, and children.
       * Note that children here is the name used by the Vue createElement function (AKA h),
       * not the React children property.
       */
      return Object.entries(slots).reduce<VueSlots>(
        (slotsTypes, [slotName, slotContent]) => {
          if (isScopedSlot(slotContent)) {
            slotsTypes.scopedSlots[slotName] = this.createScopedSlot(slotName, slotContent);
          } else {
            slotsTypes.children.push(this.createVueSlotContent(slotName, slotContent));
          }
          return slotsTypes;
        },
        { children: [], scopedSlots: {} }
      );
    },

    /**
     * Creates Vue Scoped slot with the given react render props.
     *
     * @param slotName - The name of the scoped slot.
     * @param slotContentFactory - A function that returns the react nodes to render.
     * @returns A Vue scoped slot that renders the react content factory.
     */
    createScopedSlot(slotName: string, slotContentFactory: ReactRenderProps) {
      return (data: unknown) => {
        const slotContent = slotContentFactory(data);
        return this.createVueSlotContent(slotName, slotContent);
      };
    },

    /**
     * Creates a vue virtual node for the given slot name, and with the react node passed.
     *
     * @param slotName - The name of the slot to pass the created vue node.
     * @param slotContent - The react node to render inside the slot.
     * @returns A Vue VNode that renders the react node.
     */
    createVueSlotContent(slotName: string, slotContent: ReactNodeWithoutRenderProps) {
      return this.$createElement(VueChildrenWrapper, {
        props: {
          slotContent
        },
        slot: slotName,
        ref: slotName
      });
    }
  }
});

/**
 * Creates the Vue Instance with the Vue component passed through the React props. It contains
 * the slots and children configuration rendering, event listeners and the rest of the props.
 *
 * @param reactWrapper - React props passes through the ReactWrapper.
 * @returns The Vue constructor with the extended methods.
 */
export function createVueInstance(reactWrapper: ReactWrapper): Vue {
  return new VueExtended({
    data: getVueComponentProps(reactWrapper.props),
    render(h) {
      const reactProps = reactWrapper.props;
      const { children, scopedSlots } = this.mapSlots(reactProps);

      return h(
        reactProps.component,
        {
          props: this.$data,
          scopedSlots,
          on: reactProps.on
        },
        children
      );
    }
  });
}

/**
 * Update the Vue Instance with the new React props and resynchronize the new Vue listeners.
 *
 * @param vueInstance - The Vue Instance rendered by the React wrapper and stored in its state.
 * @param reactProps - The react props which have changed.
 */
export function updateVueInstance(
  vueInstance: Vue | null,
  reactProps: Readonly<ReactWrapperProps>
): void {
  if (vueInstance) {
    const vueProps = getVueComponentProps(reactProps);
    Object.assign(vueInstance, vueProps);
    // It forces to update the Vue listeners of the `on` React prop
    vueInstance.$forceUpdate();
  }
}
