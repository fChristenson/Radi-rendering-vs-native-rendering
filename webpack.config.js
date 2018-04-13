const path = require("path");

module.exports = {
  entry: path.join(__dirname, "main.js"),
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["react"]
        }
      }
    ]
  }
};
