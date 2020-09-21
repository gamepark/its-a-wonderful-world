import excludeDependenciesFromBundle from 'rollup-plugin-exclude-dependencies-from-bundle'
import typescript from 'rollup-plugin-typescript2'

// noinspection JSUnusedGlobalSymbols
export default {
  input: 'src/Rules.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [typescript({useTsconfigDeclarationDir: true}), excludeDependenciesFromBundle()],
  external: ['@gamepark/workshop']
}