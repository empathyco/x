import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.ts',
  preserveModules: true,
  output: [
    {
      format: 'cjs',
      dir: 'dist/cjs'
    },
    {
      format: 'esm',
      dir: 'dist/esm'
    }
  ],
  plugins: [
    del({ targets: 'dist' }),
    copy({
      targets: [{ src: 'src/home', dest: 'dist' }]
    }),
    typescript({
      clean: true,
      useTsconfigDeclarationDir: true
    })
  ]
};
