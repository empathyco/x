import React, { ReactNode } from 'react';
import { ReactWrapperProps, ReactWrapperState } from './react-wrapper.types';
import { createVueInstance, updateVueInstance } from './vue-creator';

export class ReactWrapper extends React.Component<ReactWrapperProps, ReactWrapperState> {
  // https://github.com/vuejs/core/pull/7083/files
  // Fixes collision between React and Vue JSX types.
  public $props!: never;
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
    updateVueInstance(prevState.vueInstance, reactProps);
    return { ...prevState };
  }

  public constructor(props: ReactWrapperProps) {
    super(props);
    this.mountVueInstance = this.mountVueInstance.bind(this);

    this.state = {
      vueInstance: createVueInstance(this)
    };
  }

  protected get className(): string {
    const reactWrapperClass = 'react-wrapper';
    return this.props.className
      ? `${reactWrapperClass} ${this.props.className}`
      : reactWrapperClass;
  }

  /**
   * Mounts the vueInstance over the React rendered HTML Element.
   *
   * @param htmlElement - The root React rendered HTML element where the vueInstance will be
   * mounted.
   */
  protected mountVueInstance(htmlElement: HTMLElement | null): void {
    if (htmlElement && this.state.vueInstance) {
      const vueTarget = document.createElement('div');
      htmlElement.appendChild(vueTarget);
      this.state.vueInstance.$mount(vueTarget);
    }
  }

  /**
   * This method will be executed when the React Wrapper will be unmounted. It unmounts the
   * vueInstance of the wrapper.
   */
  componentWillUnmount(): void {
    if (this.state.vueInstance) {
      const vueHTMLElement = this.state.vueInstance.$el as HTMLElement;
      const reactContainer = vueHTMLElement.parentElement;
      if (reactContainer) {
        reactContainer.removeChild(vueHTMLElement);
      }
      // Finally, we destroy vueInstance
      this.state.vueInstance.$destroy();
      this.setState({ vueInstance: null });
    }
  }

  /**
   * Render function of the React wrapper.
   *
   * @returns The ReadNode with the Vue instance rendered.
   */
  render(): ReactNode {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return <div className={this.className} ref={this.mountVueInstance} />;
  }
}
