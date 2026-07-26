import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // @gamepark/rules-api ships directory imports, which Node's ESM resolver rejects:
    // let Vite resolve them instead of externalizing the dependency.
    server: { deps: { inline: ['@gamepark/rules-api'] } }
  }
})
