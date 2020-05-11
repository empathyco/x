import ReactDOM from 'react-dom';
import { ComponentOptions, CreateElement } from 'vue';
import { ReactNodeWithoutRenderProps, ReactRenderProps } from './react-wrapper.types';

/**
 * Transforms a React node into a Vue component. The Vue component renders the React content passed, and a comment (created by Vue)
 * to keep track of changes in the DOM.
 *
 * @param reactSlotContent - The React content to wrap with a Vue component
 * @returns A Vue component options object that renders the react content, plus a comment to track changes.
 */
export const wrapChildren = (reactSlotContent: ReactNodeWithoutRenderProps) => defineComponent({
  render(h: CreateElement) {
    return h();
  },
  mounted() {
    const vueReferenceElement = this.$el;
    const reactContainer = document.createElement('div');

    /*
     * Create a container element, and then render the ReactSlotContent into it.
     * After React has rendered the element or elements inside this container, we create a fragment
     * with the slot contents, that can be a single node or multiple ones, and insert it before the element
     * that Vue created (which is a comment), using a fragment to increase performance.
     * Then, we create hook in the Vue component, to remove the react rendered nodes before destroying component.
     * TODO improve types
     */
    ReactDOM.render(reactSlotContent as any, reactContainer, () => {
      const parentElement = vueReferenceElement.parentElement!;
      const fragment = document.createDocumentFragment();
      const reactNodes = [...reactContainer.childNodes];
      fragment.append(...reactNodes);
      parentElement.insertBefore(fragment, vueReferenceElement);

      this.$on('hook:beforeDestroy', () => {
        document.createDocumentFragment();
        fragment.append(...reactNodes);
        reactContainer.append(fragment);
        ReactDOM.unmountComponentAtNode(reactContainer);
      });
    });
  }
});

/**
 * Checks if the slot content is {@link ReactRenderProps}.
 *
 * @param slotContent - The slot content to test if it is a {@link ReactRenderProps}
 * @returns true if the slotContent is a ReactRenderProps
 */
export function isScopedSlot(slotContent: unknown): slotContent is ReactRenderProps {
  return typeof slotContent === 'function';
}

/**
 * Helper function to define a Vue component in a type safe way.
 *
 * @param options - The component options
 * @returns the same component options
 */
export function defineComponent<Data,
  Methods,
  Computed,
  PropsDef,
  Props>(options: ComponentOptions<Vue, Data, Methods, Computed, PropsDef, Props> & ThisType<Vue & Data & Methods & Computed & PropsDef & Props>): ComponentOptions<Vue, Data, Methods, Computed, PropsDef, Props> {
  return options;
}
