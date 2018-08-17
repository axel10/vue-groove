module.exports = {
  baseUrl: './',
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'lodash': '_',
      'iview': 'iview',
      '@shopify/draggable': 'Draggable',
      'vue-router': 'VueRouter'
    }
  },
  productionSourceMap:false
}