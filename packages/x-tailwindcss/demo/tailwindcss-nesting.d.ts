declare module 'tailwindcss/nesting' {
  import { PluginCreator } from 'postcss';
  const plugin: PluginCreator<void>;
  export default plugin;
}
