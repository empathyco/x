import React from 'react';
import { ReactWrapperProps, ReactWrapperState } from './react-wrapper.types';
import { createVueInstance, updateVueInstance } from './vue-creator';

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
    updateVueInstance(vueInstance, reactProps);
    return { vueInstance };
  }

  protected reactRenderedHTMLElement!: HTMLElement;

  constructor(props: ReactWrapperProps) {
    super(props);
    this.mountVueInstance = this.mountVueInstance.bind(this);

    this.state = {
      vueInstance: createVueInstance(this)
    };
  }

  /**
   * Mounts the vueInstance over the React rendered HTML Element.
   *
   * @param htmlElement - The root React rendered HTML element where the vueInstance will be
   * mounted.
   */
  protected mountVueInstance(htmlElement: HTMLElement | null) {
    if (htmlElement && this.state.vueInstance) {
      this.reactRenderedHTMLElement = htmlElement;
      this.state.vueInstance.$mount(htmlElement);
    }
  }

  /**
   * This method will be executed when the React Wrapper will be unmounted. It unmounts the
   * vueInstance of the wrapper.
   */
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

  /**
   * Render function of the React wrapper.
   */
  render() {
    return <div ref={ this.mountVueInstance }/>;
  }
}
