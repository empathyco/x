import { InspectorNodeTag } from '@vue/devtools-api';
import { map } from '@empathyco/x-utils';
import { RootXStoreModule, XModuleState } from '../../store/x.module';
import { XModuleName } from '../../x-modules/x-modules.types';

/** Unique text and background colors for each module. */
type ModuleColors = Record<XModuleName, Pick<InspectorNodeTag, 'textColor' | 'backgroundColor'>>;
/**
 * Unique color values for the text and background of each module.
 *
 * @internal
 */
export const moduleColors = createModuleColors();

/**
 * Creates a dictionary with unique colors for each {@link XModule}.
 *
 * @returns A dictionary with unique text and background colors for every {@link XModule}.
 */
function createModuleColors(): ModuleColors {
  const xState = (RootXStoreModule.state as () => XModuleState)();
  const modulesCount = Object.keys(xState).length;
  return map(xState, (moduleName, _, index) => {
    const hue = Math.trunc((index * 360) / modulesCount);
    return {
      textColor: hslToHex(hue, 30, 97.5),
      backgroundColor: hslToHex(hue, 80, 35)
    };
  });
}

/**
 * Transforms HSL values into a hex number.
 *
 * @param hue - The hue value, from 0 to 360.
 * @param saturation - The saturation value, from 0 to 100.
 * @param lightness - The lightness value, from 0 to 100.
 * @returns The hex value of the color.
 * @internal
 */
export function hslToHex(hue: number, saturation: number, lightness: number): number {
  lightness /= 100;
  const a = (saturation * Math.min(lightness, 1 - lightness)) / 100;
  const f = (n: number): string => {
    const k = (n + hue / 30) % 12;
    const color = lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return parseInt(`${f(0)}${f(8)}${f(4)}`, 16);
}
