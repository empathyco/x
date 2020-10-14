import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { CreateElement } from 'vue';
import { defineComponent } from './vue-creator.utils';

/**
 * Vue component that renders a React Node, which is provided via props.
 * This component is part of the mechanism that allows using Slots/Children of the
 * {@link ReactWrapper} inside a Vue component.
 */
export const VueChildrenWrapper = defineComponent({
  props: {
    slotContent: {
      required: true,
      type: [Object, Array] as ReactNode
    }
  },
  render(h: CreateElement) {
    return h();
  },
  mounted() {
    const vueReferenceElement = this.$el;
    const reactContainer = document.createElement('div');

    /*
     * Create a container element, and then render the ReactSlotContent into it.
     * After React has rendered the element or elements inside this container, we create a
     * fragment with the slot contents, that can be a single node or multiple ones, and insert
     * it before the element that Vue created (which is a comment), using a fragment to
     * increase performance. Then, we create hook in the Vue component, to remove the react
     * rendered nodes before destroying component.
     */
    ReactDOM.render(this.slotContent as any, reactContainer, () => {
      const parentElement = vueReferenceElement.parentElement!;
      const fragment = document.createDocumentFragment();
      let reactDOMNodes: ChildNode[] = [];
      /**
       * Moves the DOM nodes that have been rendered by React inside the un-attached container
       * before the Comment rendered by this Vue component.
       */
      const moveReactRenderedNodesToDOM = (): void => {
        reactDOMNodes = [...reactContainer.childNodes];
        fragment.append(...reactDOMNodes);
        parentElement.insertBefore(fragment, vueReferenceElement);
      };
      /**
       * Restores the DOM nodes that have been rendered by React to the reactContainer.
       * This has to be done before re-rendering the React virtual nodes so it does not complain
       * that the DOM is not matching with its VDOM.
       */
      const restoreReactRenderedNodesToContainer = (): void => {
        fragment.append(...reactDOMNodes);
        reactContainer.append(fragment);
      };

      moveReactRenderedNodesToDOM();

      this.$watch('slotContent', slotContent => {
        restoreReactRenderedNodesToContainer();
        ReactDOM.render(slotContent, reactContainer, moveReactRenderedNodesToDOM);
      });

      this.$on('hook:beforeDestroy', () => {
        restoreReactRenderedNodesToContainer();
        ReactDOM.unmountComponentAtNode(reactContainer);
      });
    });
  }
});
