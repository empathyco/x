import ReactDOM, { Renderer } from 'react-dom';
import { CreateElement } from 'vue';
import { defineComponent } from './vue-creator.utils';

type ReactRenderableElement = Parameters<Renderer>[0];
/**
 * Vue component that renders a React Node, which is provided via props.
 * This component is part of the mechanism that allows using Slots/Children of the
 * {@link ReactWrapper} inside a Vue component.
 */
export const VueChildrenWrapper = defineComponent({
  props: {
    slotContent: {
      required: true,
      type: [Object, Array, String]
    }
  },
  render(h: CreateElement) {
    return h('div', { staticClass: 'react-wrapper-slot' });
  },
  mounted() {
    /*
     * Create a container element, and then render the ReactSlotContent into it.
     * After React has rendered the element or elements inside this container, we create a
     * fragment with the slot contents, that can be a single node or multiple ones, and insert
     * it before the element that Vue created (which is a comment), using a fragment to
     * increase performance. Then, we create hook in the Vue component, to remove the react
     * rendered nodes before destroying component.
     */
    this.$watch(
      'slotContent',
      (slotContent: ReactRenderableElement) => {
        ReactDOM.render(slotContent, this.$el);
      },
      { immediate: true }
    );
  },
  beforeDestroy() {
    const container = this.$root.$el.parentElement;
    /* If the parent exists, we delegate into a mutation observer, to check when the Vue
     component has been removed from the DOM. Else, we execute the cleanup immediately. */
    if (container) {
      /*
       * We cannot guarantee that neither the `beforeDestroy` or `destroyed` hooks will
       * be executed after the Vue component has been removed from the DOM. This happens
       * because Vue transitions depend on these hooks. The component is actually destroyed
       * immediately,but its DOM content is removed after the leave transitions has ended.
       * For this reason, the only possible solution is to detect when the DOM has been
       * modified. A mutation observer that checks if the Vue rendered node has been removed
       * from the DOM using the `isConnected` property.
       */
      const observer = new MutationObserver(() => {
        if (!this.$el.isConnected) {
          observer.disconnect();
          ReactDOM.unmountComponentAtNode(this.$el);
        }
      });
      observer.observe(container, {
        subtree: true,
        childList: true,
        attributes: false
      });
    } else {
      ReactDOM.unmountComponentAtNode(this.$el);
    }
  }
});
