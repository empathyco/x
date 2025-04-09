declare module 'tailwindcss/nesting' {
  import type { PluginCreator } from 'postcss';
  const plugin: PluginCreator<void>;
  export default plugin;
}
