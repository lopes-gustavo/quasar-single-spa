const path = require('path')
const { name } = require('./package')
const SystemJSPublicPathWebpackPlugin = require('systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')

function resolve (...dirs) {
  return path.join(__dirname, ...dirs)
}

module.exports = function (ctx) {
  return {
    boot: [
    ],

    css: [
      'app.sass'
    ],

    extras: [
      'fontawesome-v5',
      'roboto-font',
      'material-icons'
    ],

    framework: {
      iconSet: 'fontawesome-v5',
      lang: 'pt-br',
      // all: true,

      plugins: [
        'Notify',
        'Loading',
        'LocalStorage',
        'Dialog'
      ]
    },

    htmlVariables: {
      buildDate: new Date().toISOString(),
      version: process.env.VERSION || '0.0.1'
    },

    vendor: {
      disable: true
    },

    build: {
      vueRouterBase: 'app', // must be the same as the container "activeWhen"
      vueRouterMode: 'history',
      env: {
      },
      scopeHoisting: true,
      chainWebpack (config) {
        config.entry('app').add(resolve('src', 'single-spa-entry.js'))
      },
      extendWebpack (cfg) {
        cfg.output = {
          library: `${name}-[name]`,
          libraryTarget: 'umd',
          jsonpFunction: `webpackJsonp_${name}`
        }
        cfg.externals = [ // Dependencies that will be provided by the container
          'quasar',
          '@quasar/extras',
          'vue',
          'vue-router',
          'core-js',
          'axios',
          'single-spa-vue'
        ]

        // cfg.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }))
        // cfg.plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }))
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
        const cors = require('cors')
        app.use(cors())
      }
    }
  }
}
