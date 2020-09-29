module.exports = {
  "configureWebpack": {
    "devtool": "source-map"
  },
      devServer: {
        proxy: 'http://localhost:5001'
    },
  "transpileDependencies": [
    "vuetify"
  ]
}