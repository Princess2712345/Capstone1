import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const target = join(root, 'node_modules/@nuxt/devtools/dist/chunks/module-main.mjs')

if (!fs.existsSync(target)) {
  console.warn('skip DevTools patch: file missing')
  process.exit(0)
}

let source = fs.readFileSync(target, 'utf8')
if (source.includes('/* valencia-vite8-patch */')) {
  process.exit(0)
}

const needle = 'name: "nuxt:devtools:config"'
const start = source.indexOf(needle)
if (start === -1) {
  console.warn('skip DevTools patch: plugin not found')
  process.exit(0)
}

const pluginStart = source.lastIndexOf('addVitePlugin({', start)
const pluginEnd = source.indexOf('});', start)
if (pluginStart === -1 || pluginEnd === -1) {
  console.warn('skip DevTools patch: bounds not found')
  process.exit(0)
}

const replacement = `addVitePlugin({
    /* valencia-vite8-patch */
    name: "nuxt:devtools:config-retriever",
    enforce: "post",
    configResolved(config) {
      viteServer = normalizeViteConfig(config);
      viteClient = normalizeViteConfig(config);
    }
  });`

source = source.slice(0, pluginStart) + replacement + source.slice(pluginEnd + 3)
fs.writeFileSync(target, source)
console.log('patched @nuxt/devtools Vite 8 config-retriever plugin')
