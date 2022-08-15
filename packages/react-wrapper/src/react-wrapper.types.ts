import { JSXElementConstructor, ReactNode } from 'react';
import Vue, { ComponentOptions, VNode } from 'vue';
import { ScopedSlot } from 'vue/types/vnode';

/**
 * Props accepted by the {@link ReactWrapper} component.
 */
export interface ReactWrapperProps {
  /**
   * Vue component to render.
   */
  component: typeof Vue | ComponentOptions<Vue>;
  /**
   * React slots, also known as children or react render props.
   * Property children will override any slot named `default`.
   */
  slots?: {
    [slotName: string]: ReactNode;
  };
  /**
   * Default react slot. Overrides `slots.default`.
   */
  children?: ReactNodeWithoutRenderProps;
  /**
   * Vue event listeners to subscribe. The key will be the Vue event name to subscribe and the
   * value a callback function which will be executed when the Vue event is triggered.
   */
  on?: Record<string, (eventPayload?: any) => void>;
  /**
   * CSS Classes to apply to the react-wrapper container.
   */
  className?: string;
  /**
   * React context to pass to vue component where it is stored in a provider
   */
  context?: any
  /**
   * Any other prop is passed down to the Vue component.
   */
  [key: string]: any;
}

/**
 * State of the {@link ReactWrapper} component.
 */
export interface ReactWrapperState {
  vueInstance: Vue | null;
}

/**
 * Type used to group the 2 types of slots that vue knows when creating a VNode.
 */
export interface VueSlots {
  /**
   * An array containing default slots and named slots.
   */
  children: VNode[];
  /**
   * A dictionary where each key is the scoped slot name, and the value is the function
   * that returns the VNodes to render.
   */
  scopedSlots: Record<string, ScopedSlot>;
}

/**
 * Every type of react nodes except render props.
 */
export type ReactNodeWithoutRenderProps = Exclude<ReactNode, JSXElementConstructor<any>>;
export type ReactRenderProps = (data: any) => ReactNodeWithoutRenderProps;
