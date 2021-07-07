declare module 'postcss-logical' {
  import { Options } from './postcss-types/options';

  function postcssLogical(options?: Options = {}): Plugin<Options>;
  export = postcssLogical;
}
