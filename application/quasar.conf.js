const path = require('path')
const cors = require('cors')
const { name } = require('./package')
const SystemJSPublicPathWebpackPlugin = require('systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin')

function resolve (...dirs) {
  return path.join(__dirname, ...dirs)
}

module.exports = function () {
  return {
    css: [
      'app.sass'
    ],

    extras: [ // Optional extras you may have
      'fontawesome-v5',
      'roboto-font',
      'material-icons'
    ],

    framework: {
      iconSet: 'fontawesome-v5'
    },

    vendor: {
      disable: true // Makes bundler smaller
    },

    build: {
      vueRouterBase: 'app', // must be the same as the container "activeWhen"
      vueRouterMode: 'history',
      scopeHoisting: true,
      chainWebpack (config) {
        config.entry('app').add(resolve('src', 'single-spa-entry.js')) // This is the magic to make quasar work with single-spa
      },
      extendWebpack (cfg) {
        cfg.output = { // As per single-spa documentation
          library: `${name}-[name]`,
          libraryTarget: 'umd',
          jsonpFunction: `webpackJsonp_${name}`
        }
        cfg.externals = [ // [OPTIONAL] Dependencies that will be provided by the container
          'quasar',
          '@quasar/extras',
          'vue',
          'vue-router',
          'core-js',
          'axios',
          'single-spa-vue'
        ]

        cfg.plugins.push(new SystemJSPublicPathWebpackPlugin({ systemjsModuleName: name }))
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: { formatter: require('eslint').CLIEngine.getFormatter('stylish') }
        })
      }
    },

    devServer: {
      port: 8080,
      open: false,
      https: true, // Important if want to use hot reload. You MUST navigate to https://localhost:8080/app.js and bypass invalid certificate warning. Otherwise it won't work
      disableHostCheck: true,
      before (app) {
        app.use(cors())
      }
    }
  }
}
