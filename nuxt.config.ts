function hushDevtoolsVite8Warning(config: { customLogger?: { warn: (...args: unknown[]) => void } }) {
  const logger = config.customLogger
  if (!logger || '__valenciaDevtoolsWarnPatched' in logger) return
  const original = logger.warn.bind(logger)
  logger.warn = (msg, ...rest) => {
    if (
      typeof msg === 'string'
      && msg.includes('nuxt:devtools:config-retriever')
      && msg.includes('applyToEnvironment')
    ) {
      return
    }
    original(msg, ...rest)
  }
  Object.defineProperty(logger, '__valenciaDevtoolsWarnPatched', { value: true })
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // @nuxt/devtools 3.4.2 puts `configResolved` on a plugin returned from
  // `applyToEnvironment`. Vite 8 never calls that hook (shared-config only)
  // and prints this warning for client + SSR. Harmless; hush until DevTools ships a fix.
  hooks: {
    'vite:extendConfig'(config) {
      hushDevtoolsVite8Warning(config)
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
