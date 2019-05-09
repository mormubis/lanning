import external from 'rollup-plugin-auto-external';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import del from 'rollup-plugin-delete';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import visualizer from 'rollup-plugin-visualizer';

import pkg from './package.json';

const env = process.env.NODE_ENV;

const config = {
  input: 'src/index.js',
  output: [
    {
      exports: 'named',
      file: pkg.main,
      format: 'cjs',
      name: 'spooner',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    external({ includeDependencies: true }),
    ...(env === 'production'
      ? [
          del({
            targets: ['./dist/'],
          }),
        ]
      : []),
    babel({
      exclude: '**/node_modules/**',
      // runtimeHelpers: true,
    }),
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    commonjs(),
    visualizer({ filename: './statistics.html', sourcemap: true }),
  ],
};

if (env === 'production') {
  config.plugins.push(
    sizeSnapshot(),
    minify({
      comments: false,
    }),
  );
}

export default config;
