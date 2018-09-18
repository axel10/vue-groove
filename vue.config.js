module.exports = {
  baseUrl: '/',
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'lodash': '_',
      'iview': 'iview',
      '@shopify/draggable': 'Draggable',
      'vue-router': 'VueRouter'
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    devServer:{
      // historyApiFallback: true
    }
  },

  productionSourceMap:false,
}