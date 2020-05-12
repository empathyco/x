import Vue from 'vue';
import { XAPI } from './api/api.types';
import { BaseXAPI } from './api/base-api';
import { xPlugin } from './plugins/x-plugin';
import { XPluginOptions } from './plugins/x-plugin.types';

declare global {
  interface Window {
    X: XAPI;
  }
}

/**
 * Function to install the {@link XPlugin} with the core functionality and the {@link XAPI} exposes
 * through the {@link https://developer.mozilla.org/en-US/docs/Web/API/Window | window} property
 * `X`.
 *
 * @param options - Options to customize the installation {@link XPluginOptions}.
 * @param vue - Optional Vue constructor where the {@link XPlugin} will be installed.
 *
 * @public
 */
export function installX(options: XPluginOptions, vue = Vue): void {
  window.X = new BaseXAPI(); // TODO Inject this constructor
  vue.use(xPlugin, options);
}
