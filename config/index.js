'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        // target: 'http://127.0.0.1:8088/member-admin',
        target: 'http://10.6.181.10:10008/member-admin',
        // target: 'http://10.6.206.237:10004/member-admin',
        // target: 'http://10.52.56.43:8090/member-admin',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/schedulerApi': {
        target: 'http://127.0.0.1:8080/member-scheduler',
        changeOrigin: true,
        pathRewrite: {
          '^/schedulerApi': '/'
        }
      },
      '/exchangeApi': {
        target: 'http://127.0.0.1:8080/member-exchange',
        changeOrigin: true,
        pathRewrite: {
          '^/exchangeApi': '/'
        }
      }
    },


    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 80, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    // devtool: 'cheap-module-eval-source-map',
    devtool: '#source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    bundleAnalyzerReport: process.env.npm_config_report,
    buildProd: process.env.npm_config_prod,
    buildStage: process.env.npm_config_stage,
  }
}
