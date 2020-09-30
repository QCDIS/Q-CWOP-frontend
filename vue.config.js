module.exports = {
  "configureWebpack": {
    "devtool": "source-map"
  },
      devServer: {
        proxy: 'http://qcdis.lab.uvalight.net:32767',
        disableHostCheck: true
    },
  "transpileDependencies": [
    "vuetify"
  ]
}