import Vue from 'vue';
import { XModuleName } from '../x-modules/x-modules.types';
import { XComponentModule } from './x-component.utils';

/**
 * An XComponent is just a normal Vue component that has an {@link XModule} linked to its usage.
 * If the XComponent is imported in a consumer project, the {@link XModule} will be registered.
 *
 * @public
 */
export interface XComponent extends Vue {
  /**
   * Property to store the x-component module name.
   * If any component has this property, it means that it is an XComponent.
   *
   * @internal
   */
  [XComponentModule]: XModuleName;
}

/**
 * Types allow for values of scroll direction.
 *
 * @public
 */
export type ScrollDirection = 'UP' | 'DOWN';
