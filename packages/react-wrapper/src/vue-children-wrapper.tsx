import React from 'react';
import ReactDOM, { Renderer } from 'react-dom';
import Vue, { CreateElement, PropType } from 'vue';

type ReactRenderableElement = Parameters<Renderer>[0] | Parameters<typeof React.createElement>[0];

/**
 * Returns true when the component is a component definition, to be used
 * within a JSX element or a `React.createElement` call.
 *
 * @param component - The component to test if it is a rendered node or a component definition.
 * @returns True when the component is either a component class or a component function.
 */
function isReactComponentDefinition(
  component: ReactRenderableElement
): component is Parameters<typeof React.createElement>[0] {
  return typeof component === 'function';
}

/**
 * Vue component that renders a React Node, which is provided via props.
 * This component is part of the mechanism that allows using Slots/Children of the
 * {@link ReactWrapper} inside a Vue component.
 */
export const VueChildrenWrapper = Vue.extend({
  props: {
    slotContent: {
      required: true,
      type: [Object, Array, String, Function] as PropType<ReactRenderableElement>
    },
    reactProps: {}
  },
  render(h: CreateElement) {
    return h('div', { staticClass: 'react-wrapper-slot' });
  },
  mounted() {
    /* eslint-disable @typescript-eslint/unbound-method */
    this.$watch('slotContent', this.renderReactComponent, { immediate: true });
    this.$watch('reactProps', this.renderReactComponent);
    /* eslint-enable @typescript-eslint/unbound-method */
  },
  methods: {
    renderReactComponent() {
      if (isReactComponentDefinition(this.slotContent)) {
        const ReactComponent = this.slotContent as any; // TODO Fix type.
        ReactDOM.render(<ReactComponent {...this.reactProps} />, this.$el);
      } else {
        ReactDOM.render(this.slotContent, this.$el);
      }
    }
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
