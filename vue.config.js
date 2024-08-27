module.exports = {
  publicPath: '/',
  devServer: {
    host: '0.0.0.0',  // Binds the server to 0.0.0.0, making it accessible on all network interfaces
    port: 9090,       // Specifies the port to run the server on
    proxy: {
      '/api': {
        target: 'http://43.231.66.174:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
  transpileDependencies: [
    'axios',
    'vue-router',
  ]
};
