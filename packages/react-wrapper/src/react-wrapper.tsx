import React from 'react';
import Vue from 'vue';
import { ReactNodeWithoutRenderProps, ReactRenderProps, ReactWrapperProps, ReactWrapperState, VueSlots } from './react-wrapper.types';
import { isScopedSlot, wrapChildren } from './react-wrapper.utils';

export class ReactWrapper extends React.Component<ReactWrapperProps, ReactWrapperState> {

  static getDerivedStateFromProps({ component, slots, ...props }: Readonly<ReactWrapperProps>, prevState: Readonly<ReactWrapperState>) {
    Object.assign(prevState.vueInstance, props);
    return { vueInstance: prevState.vueInstance };
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
      data: this.getVueComponentProps(),
      render(h) {
        const slots = reactWrapper.props.slots ?? {};
        if (reactWrapper.props.children) {
          slots.default = reactWrapper.props.children; // `children` is the default prop name for React slots
        }

        /*
         * Divide the slots into the two groups that Vue has: scoped slots, and children.
         * Note that children here is the name used by the Vue createElement function (AKA h),
         * not the React children property.
         */
        const { scopedSlots, children } = Object.entries(slots)
          .reduce<VueSlots>((slotsTypes, [slotName, slotContent]) => {
            if (isScopedSlot(slotContent)) {
              slotsTypes.scopedSlots[slotName] = reactWrapper.createScopedSlot(this, slotName, slotContent);
            } else {
              slotsTypes.children.push(reactWrapper.createVueSlotContent(this, slotName, slotContent));
            }
            return slotsTypes;
          }, { children: [], scopedSlots: {} });

        return h(reactWrapper.props.component, { props: this.$data, scopedSlots }, children);
      }
    });
  }

  protected getVueComponentProps() {
    const { component, children, slots: reactSlots, ...vueProps } = this.props;
    return vueProps;
  }

  /**
   * Creates Vue Scoped slot with the given react render props.
   *
   * @param vueInstance - The Vue instance that owns the scoped slot
   * @param slotName - The name of the scoped slot
   * @param slotContentFactory - A function that returns the react nodes to render
   * @returns a Vue scoped slot that renders the react content factory
   */
  protected createScopedSlot(vueInstance: Vue, slotName: string, slotContentFactory: ReactRenderProps) {
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
  protected createVueSlotContent(vueInstance: Vue, slotName: string, slotContent: ReactNodeWithoutRenderProps) {
    const component = wrapChildren(slotContent);
    return vueInstance.$createElement(component, {
      slot: slotName
    });
  }

  componentWillUnmount(): void {
    if (this.state.vueInstance) {
      // We restore the react rendered HTMLElement into the DOM to prevent a crash when React finishes executing the unmounting process
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
