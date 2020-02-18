import { XModuleName } from '../x-modules/x-modules.types';
import { XComponentModule } from './x-component.mixin';

export interface XComponent {
  [XComponentModule]: XModuleName;
}
