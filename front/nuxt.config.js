import colors from 'vuetify/es5/util/colors';

export default {

  ssr: false,

  server: {
    host: '0',
    port: 8000
  },

  env: {
    HOST: process.env.HOST,
    BACKHOST: process.env.BACKHOST
  },

  // router: {
  //   middleware: 'login'
  // },

  // proxy: {
  //   '/api': { target: 'http://localhost:3000/api', pathRewrite:{'^/api': ''} }
  // },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Tronscendance',
    title: 'Tronscendance',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "~layouts/global.css",
    "~layouts/Orbitron.css"
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/game.io.ts', ssr: false },
    { src: '~/plugins/chat.io.ts', ssr: false },
    { src: '~/plugins/active.io.ts', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: ['~/components/',
              '~/components/channel/',
              '~/components/channel/button',
              '~/components/profile',
              '~/components/achievements',
              '~/components/home'
            ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',

    '@nuxtjs/proxy',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'http://' + process.env.HOST,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/Classes-scss/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: '#ff0000',
          accent: '#f28482',
          secondary: '#f28482',
          info: '#f28482',
          warning: '#f28482',
          error: '#f28482',
          success: '#f28482',
          orange_neon: '#ffa768',
          orange_glowing: '#fc6500',
          purple_neon: '#e9c8ff',
          purple_glowing: '#9141c7',
          blue_neon: '#a5fafa',
          blue_glowing: '#0affff',
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      })
    },
  }
}
