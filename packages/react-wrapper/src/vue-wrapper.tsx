import React from 'react';
import ReactDOM from 'react-dom';
import Vue, { ComponentOptions } from 'vue';

interface VueWrapperProps<ReactComponentProps = object> {
  reactComponent: React.JSXElementConstructor<ReactComponentProps>;
  reactProps: ReactComponentProps;
}

type VueWrapperThis = ThisType<Vue & VueWrapperProps>;

export const VueWrapper: ComponentOptions<Vue, never, never, never, object, VueWrapperProps> & VueWrapperThis = {
  props: {
    reactComponent: {
      type: Function,
      required: true
    },
    reactProps: Object
  },
  render(h) {
    return h();
  },
  mounted() {
    // Parent node is stored due to Vue automatically removing it before the beforeDestroy hook is called.
    const parentNode = this.$el.parentElement!;
    // Before destroying Vue component we also destroy the React one
    this.$on('hook:beforeDestroy', () => {
      ReactDOM.unmountComponentAtNode(parentNode);
    });
    // Every time prop changes, we re-render the react component
    this.$watch('$props', ({ reactComponent: ReactComponent, reactProps }: VueWrapperProps) => {
      // Rendering a react component inside the `parentNode` removes the comment that Vue had rendered inside it.
      ReactDOM.render(<ReactComponent { ...reactProps }/>, parentNode);
    }, { deep: true, immediate: true });
    // We have to restore the Vue component `$el` so it can keep tracking of changes
    parentNode.appendChild(this.$el);
  }
};
