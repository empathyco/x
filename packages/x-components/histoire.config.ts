import { defineConfig } from 'histoire';
import { HstVue } from '@histoire/plugin-vue2';

export default defineConfig({
  plugins: [HstVue()],
  setupFile: './src/histoire-setup.ts'
});
