/**
 * Transforms the string parameter into a single line.
 *
 * @param text - Multiline string to transform into a single one.
 * @returns Text in a single line.
 */
import React, { ComponentClass, ReactElement } from 'react';
import ReactDOM from 'react-dom';

/**
 * Transforms an string into a single line, removing spaces, tabs, break lines...
 *
 * @param text - The text to transform to a single line.
 * @returns An string containing the same text but removing the line breaks and spaces.
 */
export function transformStringIntoASingleLine(text: string): string {
  return text.replace(/[\n\r\t]|\s{2,}/g, '');
}

/**
 * Holder for the return value of {@link renderClassComponent}.
 */
interface RenderAPI<SomeComponent extends ComponentClass> {
  /** The instance of the rendered component, where all the methods are accessible. */
  instance: InstanceType<SomeComponent>;
  /** The HTML node that the component has been rendered to. */
  root: HTMLElement;
}

/**
 * Renders a react class component, returning a reference to its instance.
 *
 * @param component - The component to render.
 * @returns An object containing a reference to the rendered component instance, and the HTML
 * element it has been rendered to.
 */
export function renderClassComponent<SomeComponent extends ComponentClass>(
  component: SomeComponent // TODO I can't find the correct type for this parameter.
): RenderAPI<SomeComponent> {
  const ComponentToRender = component as any;
  const instance = React.createRef<InstanceType<SomeComponent>>();
  const root = document.createElement('div');
  ReactDOM.render(<ComponentToRender ref={instance} />, root);

  return {
    instance: instance.current!,
    root
  };
}

/**
 * Renders the given React node to a container.
 *
 * @param node - The node to render.
 * @returns The container that the node has been rendered to.
 */
export function renderReactNode(node: ReactElement): HTMLElement {
  const root = document.createElement('div');
  ReactDOM.render(node, root);
  return root;
}
