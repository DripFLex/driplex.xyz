import astro from 'eslint-plugin-astro';
import ts from 'typescript-eslint';
export default [{ ignores: ['dist/**', '.astro/**', 'node_modules/**'] }, ...ts.configs.recommended, ...astro.configs.recommended];
