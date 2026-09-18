function stripBrokenDevtoolsPlugin(plugins: unknown) {
  if (!Array.isArray(plugins)) return
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i]
    if (Array.isArray(plugin)) {
      stripBrokenDevtoolsPlugin(plugin)
      continue
    }
    if (
      plugin
      && typeof plugin === 'object'
      && 'name' in plugin
      && (plugin.name === 'nuxt:devtools:config' || plugin.name === 'nuxt:devtools:config-retriever')
      && 'applyToEnvironment' in plugin
    ) {
      plugins[i] = { name: 'nuxt:devtools:config-retriever', enforce: 'post' }
    }
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Vite 8 warns because DevTools 3.4.2 returns a `configResolved` plugin from
  // applyToEnvironment. Replace that plugin before Vite resolves environments.
  hooks: {
    'vite:extend'({ config }) {
      stripBrokenDevtoolsPlugin(config.plugins)
    }
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Valencia CHO · Integrated Health Platform',
      meta: [
        {
          name: 'description',
          content:
            'LGU Valencia City prototype for specialty routing, hybrid scheduling, and prescription supply-chain operations.'
        }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650;9..144,720&family=Figtree:wght@400;500;600;700&display=swap'
        }
      ]
    }
  }
})
