import { InspectorNodeTag } from '@vue/devtools-api';
import { RootXStoreModule } from '../../store/x.module';
import { NiladicFunction } from '../../utils/types';
import { XModuleName } from '../../x-modules/x-modules.types';

/** Unique text and background colors for each module. */
type ModuleColors = Record<XModuleName, Pick<InspectorNodeTag, 'textColor' | 'backgroundColor'>>;
/**
 * Unique color values for the text and background of each module.
 *
 * @internal
 */
export const moduleColors: ModuleColors = Object.keys(
  (RootXStoreModule.state as NiladicFunction)!()
).reduce((colors, moduleName, index, keys) => {
  const hue = Math.trunc((index * 360) / keys.length);
  colors[moduleName as XModuleName] = {
    textColor: hslToHex(hue, 25, 95),
    backgroundColor: hslToHex(hue, 75, 40)
  };
  return colors;
}, <ModuleColors>{});

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
