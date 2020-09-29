module.exports = {
  "configureWebpack": {
    "devtool": "source-map"
  },
  "transpileDependencies": [
    "vuetify"
  ]
    devServer: {
        proxy: 'http://localhost:5001'
    }
}