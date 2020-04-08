import React from 'react';
import Vue, { ComponentOptions } from 'vue';

interface ReactWrapperProps {
  component: typeof Vue | ComponentOptions<Vue>;
  [key: string]: any;
}

interface ReactWrapperState {
  vueInstance: Vue | null;
}

export class ReactWrapper extends React.Component<ReactWrapperProps, ReactWrapperState> {

  static getDerivedStateFromProps({ component, ...props }: Readonly<ReactWrapperProps>, prevState: Readonly<ReactWrapperState>) {
    Object.assign(prevState.vueInstance, props);
    return { vueInstance: prevState.vueInstance };
  }

  protected reactRenderedHTMLElement!: HTMLElement;

  constructor(props: ReactWrapperProps) {
    super(props);
    this.mountVueInstance = this.mountVueInstance.bind(this);
    const { component, ...vueProps } = props;

    this.state = {
      vueInstance: new Vue({
        data: vueProps,
        render(h) { return h(component, { props: this.$data }); }
      })
    };
  }

  protected mountVueInstance(htmlElement: HTMLElement | null) {
    if (htmlElement && this.state.vueInstance) {
      this.reactRenderedHTMLElement = htmlElement;
      this.state.vueInstance.$mount(htmlElement);
    }
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
