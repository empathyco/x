declare module 'postcss-dir-pseudo-class' {
  import { Options } from './postcss-types/options';

  function postcssDirPseudoClass(options?: Options = {}): Plugin<Options>;
  export = postcssDirPseudoClass;
}
