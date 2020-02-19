import { XModuleName } from '../x-modules/x-modules.types';
import { XComponentModule } from './x-component.utils';

/**
 * An XComponent is just a normal Vue component that has an {@link XModule} linked to its usage.
 * If the XComponent is imported in a consumer project, the {@link XModule} will be registered.
 *
 * @internal
 */
export interface XComponent extends Vue {
  [XComponentModule]: XModuleName;
}
