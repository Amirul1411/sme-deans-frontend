const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const devMode = process.env.NODE_ENV !== "production";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

// constants
const OUTPUT_PATH = path.resolve(__dirname, "../dist");
const SRC_PATH = path.resolve(__dirname, "../src");
const PROJECT_ROOT = path.resolve(__dirname, "../");

const config = {
  entry: ["babel-polyfill", SRC_PATH + "/index.js"],
  output: {
    filename: "[name].[hash].js",
    publicPath: "/",
    path: OUTPUT_PATH
  },
  resolve: {
    alias: {
      src: SRC_PATH,
      "@components": SRC_PATH + "/components",
      "@containers": SRC_PATH + "/containers",
      "@api": SRC_PATH + "/api",
      "@redux": SRC_PATH + "/redux",
      "@assets": SRC_PATH + "/assets"
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }]
      },
      {
        test: [
          /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)/,
          /\/typefaces\/.*\.svg/
        ],
        exclude: /node_modules/,
        use: [{ loader: "file-loader" }]
      },
      {
        test: /\.css$/,
        // exclude: /node_modules/,
        use: [
          {
            loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              minimize: true,
              sourceMap: true,
              camelCase: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              config: {
                path: path.resolve(PROJECT_ROOT, "postcss.config.js")
              }
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS,
            options: {
              modifyVars: {
                "primary-color": "#000000",
                "link-color": "#000000",
                "border-radius-base": "2px",
                "item-hover-bg": "rgba(250,250,250,.9)",
                "item-active-bg": "rgba(250,250,250,.9)",
                "table-row-hover-bg": "rgba(250,250,250,.9)"
              },
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              importLoaders: 2, // Ensures PostCSS and Sass loaders are applied to imported CSS
              modules: true,
              camelCase: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: path.resolve(PROJECT_ROOT, "postcss.config.js") // Adjust PostCSS config if necessary
              },
              sourceMap: true
            }
          },
          {
            loader: "resolve-url-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                includePaths: [path.resolve(SRC_PATH, "styles")]
              }
            }
          }
        ]
      }
      
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: PROJECT_ROOT + "/index.html"
    }),
    new CleanWebpackPlugin([OUTPUT_PATH], {
      root: PROJECT_ROOT
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
    })
  ]
};

module.exports = config;
