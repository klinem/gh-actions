import { builtinModules } from 'module';
import commonjs from 'rollup-plugin-commonjs';
// import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/bundle.js',
    format: 'cjs',
  },
  plugins: [nodeResolve(), commonjs(), typescript()],
  external: builtinModules,
};
