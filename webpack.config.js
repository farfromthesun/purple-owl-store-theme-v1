const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "assets"),
    filename: 'custom.v1.js',
    clean: true,
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js)$/i,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "custom.v1.css",
    }),
  ],
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }

  return config;
};
