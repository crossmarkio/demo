const path = require('path');

const fontRegex = /\.(woff|woff2|eot|ttf|otf)$/;
const sassRegex = /\.(scss|sass)$/;

module.exports = async ({config})  => {

  config.resolve.fallback.stream = require.resolve("stream-browserify")
  config.resolve.fallback.url = require.resolve("url/")
  config.resolve.fallback.https = require.resolve("https-browserify")
  config.resolve.fallback.crypto = require.resolve("crypto-browserify")
  config.resolve.fallback.http = require.resolve("stream-http")
  config.resolve.fallback.buffer = require.resolve("buffer")
  config.resolve.fallback.net = false
  config.resolve.fallback.tls = false

  config.module.rules.push(
    {
                test:sassRegex,
                use: ['resolve-url-loader'],
                include: path.resolve(__dirname, '../')
              });

  config.module.rules.push(
  {
              test:fontRegex,
              use: [{
                  loader: require.resolve('file-loader'),
                  options: {
                      name: '[name].[ext]'
                  }
              }],
              include: path.resolve(__dirname, '../')
            });
            
    return config
  }
           