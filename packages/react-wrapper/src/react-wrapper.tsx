import React from 'react';
import Vue from 'vue';
import {
  ReactNodeWithoutRenderProps,
  ReactRenderProps,
  ReactWrapperProps,
  ReactWrapperState,
  VueSlots
} from './react-wrapper.types';
import { isScopedSlot, wrapChildren } from './react-wrapper.utils';

export class ReactWrapper extends React.Component<ReactWrapperProps, ReactWrapperState> {

  /**
   * This method will be executed when props of the react-wrapper have changed. It synchronizes
   * these new props with the Vue instance, resubscribe the new event listeners and the Vue instance
   * modified to the React state.
   *
   * @param reactProps - The react props which have changed.
   * @param prevState - The previous React state which contains the Vue instance rendered.
   * @returns The new React state which contains the Vue instance with the new props synchronized.
   */
  static getDerivedStateFromProps(
    reactProps: Readonly<ReactWrapperProps>,
    prevState: Readonly<ReactWrapperState>
  ): Readonly<ReactWrapperState> {
    const vueInstance = prevState.vueInstance;
    if (vueInstance) {
      const vueProps = ReactWrapper.getVueComponentProps(reactProps);
      Object.assign(vueInstance, vueProps);
      // It forces to update the Vue listeners of the `on` React prop
      vueInstance.$forceUpdate();
    }
    return { vueInstance };
  }

  protected reactRenderedHTMLElement!: HTMLElement;

  constructor(props: ReactWrapperProps) {
    super(props);
    this.mountVueInstance = this.mountVueInstance.bind(this);

    this.state = {
      vueInstance: this.createVueInstance()
    };
  }

  protected mountVueInstance(htmlElement: HTMLElement | null) {
    if (htmlElement && this.state.vueInstance) {
      this.reactRenderedHTMLElement = htmlElement;
      this.state.vueInstance.$mount(htmlElement);
    }
  }

  protected createVueInstance(): Vue {
    const reactWrapper = this;
    return new Vue({
      data: ReactWrapper.getVueComponentProps(this.props),
      render(h) {
        const slots = reactWrapper.props.slots ?? {};
        if (reactWrapper.props.children) {
          // `children` is the default prop name for React slots
          slots.default = reactWrapper.props.children;
        }

        /*
         * Divide the slots into the two groups that Vue has: scoped slots, and children.
         * Note that children here is the name used by the Vue createElement function (AKA h),
         * not the React children property.
         */
        const { scopedSlots, children } = Object.entries(slots)
          .reduce<VueSlots>((slotsTypes, [slotName, slotContent]) => {
            if (isScopedSlot(slotContent)) {
              slotsTypes.scopedSlots[slotName] =
                reactWrapper.createScopedSlot(this, slotName, slotContent);
            } else {
              slotsTypes.children.push(
                reactWrapper.createVueSlotContent(this, slotName, slotContent));
            }
            return slotsTypes;
          }, { children: [], scopedSlots: {} });

        return h(reactWrapper.props.component, {
          props: this.$data,
          scopedSlots,
          on: reactWrapper.props.on
        }, children);
      }
    });
  }

  /**
   * Creates Vue Scoped slot with the given react render props.
   *
   * @param vueInstance - The Vue instance that owns the scoped slot
   * @param slotName - The name of the scoped slot
   * @param slotContentFactory - A function that returns the react nodes to render
   * @returns a Vue scoped slot that renders the react content factory
   */
  protected createScopedSlot(vueInstance: Vue, slotName: string,
    slotContentFactory: ReactRenderProps) {
    return (data: any) => {
      const slotContent = slotContentFactory(data);
      return this.createVueSlotContent(vueInstance, slotName, slotContent);
    };
  }

  /**
   * Creates a vue virtual node for the given slot name, and with the react node passed.
   * @param vueInstance - The vue instance that will own the vnode
   * @param slotName - The name of the slot to pass the created vue node
   * @param slotContent - The react node to render inside the slot
   * @returns A Vue VNode that renders the react node.
   */
  protected createVueSlotContent(vueInstance: Vue, slotName: string,
    slotContent: ReactNodeWithoutRenderProps) {
    const component = wrapChildren(slotContent);
    return vueInstance.$createElement(component, {
      slot: slotName
    });
  }

  /**
   * Extracts the React props used in the wrapper and returns the rest which are props of the
   * Vue component rendered into.
   *
   * @param reactProps - The react props passed through the wrapper.
   */
  static getVueComponentProps(reactProps: Readonly<ReactWrapperProps>) {
    const { component, children, slots: reactSlots, on, ...vueProps } = reactProps;
    return vueProps;
  }

  componentWillUnmount(): void {
    if (this.state.vueInstance) {
      /* We restore the react rendered HTMLElement into the DOM to prevent a crash when React
       finishes executing the unmounting process */
      const vueHTMLElement = this.state.vueInstance.$el as HTMLElement;
      const reactContainer = vueHTMLElement.parentElement;
      if (reactContainer) {
        reactContainer.insertBefore(this.reactRenderedHTMLElement, vueHTMLElement);
        reactContainer.removeChild(vueHTMLElement);
      }
      // Finally, we destroy vueInstance
      this.state.vueInstance.$destroy();
      this.setState({ vueInstance: null });
    }
  }

  render() {
    return <div ref={ this.mountVueInstance }/>;
  }
}
