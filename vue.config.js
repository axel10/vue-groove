module.exports = {
  publicPath: "/",
  chainWebpack: (config) => {
    config.plugins.delete("fork-ts-checker");
  },
  configureWebpack: {
    externals: {
      "vue": "Vue",
      "lodash": "_",
      "iview": "iview",
      "@shopify/draggable": "Draggable",
      "vue-router": "VueRouter",
    },
    resolve: {
      alias: {
        "vue$": "vue/dist/vue.esm.js",
      },
    },
    /*    devServer:{
          // historyApiFallback: true
          overlay:{
            warnings:false
          },
        },*/
  },

  productionSourceMap: false,
};
