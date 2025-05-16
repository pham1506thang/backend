import { register } from 'tsconfig-paths';
import { compilerOptions } from './tsconfig.json';

register({
  baseUrl: './src',
  paths: compilerOptions.paths,
}); 