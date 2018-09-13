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
/*  configureWebpack: config=>{
    console.log(config);
    config.resolve.alias
        .set('vue$','vue/dist/vue.esm.js')
      .historyApiFallback({
        rewrites: [
          { from: /./, to: '/' }
        ]
      })
  },*/
  productionSourceMap:false,
}